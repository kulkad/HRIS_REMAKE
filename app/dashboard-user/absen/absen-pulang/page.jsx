"use client";

import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import { Navbar, Container, Nav } from "react-bootstrap";
import { API_Backend } from "../../../api/hello.js";

const FaceComparison = () => {
  const [initializing, setInitializing] = useState(true);
  const [similarity, setSimilarity] = useState(null);
  const [image2, setImage2] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [absenSuccess, setAbsenSuccess] = useState(false);
  const [alasanSuccess, setAlasanSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAfterBack, setIsAfterBack] = useState(false);
  const [jamPulangRole, setJamPulangRole] = useState("");
  const [showReasonField, setShowReasonField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const webcamRef = useRef(null);
  const imageRef2 = useRef(null);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    setInitializing(false);
  };

  const fetchUserPhotos = async () => {
    try {
      const response = await axios.get(`${API_Backend}/userfotoabsen`);
      setUserPhotos(response.data);
    } catch (error) {
      console.error("Error fetching user photos: ", error);
    }
  };

  useEffect(() => {
    loadModels();
    fetchUserPhotos();
  }, []);

  const capture = (setImage, imageRef) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    imageRef.current.src = imageSrc;
  };

  const calculateSimilarity = async () => {
    capture(setImage2, imageRef2);

    const img2 = imageRef2.current;
    let isAbsenSuccess = false;
    let matchedUser = null;
    let pulangRole = null; // Variabel lokal untuk menyimpan jam pulang
    let canLeave = false; // Variabel lokal untuk mengecek apakah sudah saatnya pulang

    for (let userPhoto of userPhotos) {
      if (!userPhoto.url_foto_absen) {
        continue;
      }

      const img1 = new Image();
      img1.crossOrigin = "anonymous";
      img1.src = userPhoto.url_foto_absen;
      await new Promise((resolve) => (img1.onload = resolve));

      const detection1 = await faceapi
        .detectSingleFace(img1, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptor();

      const detection2 = await faceapi
        .detectSingleFace(img2, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection1 && detection2) {
        const distance = faceapi.euclideanDistance(
          detection1.descriptor,
          detection2.descriptor
        );
        const similarityScore = Math.min((1 - distance) * 100, 100).toFixed(2);

        if (similarityScore >= 60) {
          isAbsenSuccess = true;
          setSimilarity(similarityScore);
          matchedUser = userPhoto;

          try {
            const userRoleResponse = await axios.get(
              `${API_Backend}/users/${userPhoto.id}`
            );
            pulangRole = userRoleResponse.data.role.jam_pulang; // Mendapatkan jam pulang dari user yang cocok
            setJamPulangRole(pulangRole);

            // Cek apakah sudah saatnya pulang berdasarkan pulangRole
            const now = new Date();
            const [pulangHour, pulangMinute] = pulangRole
              .split(":")
              .map(Number); // Mengubah string jam_pulang menjadi angka
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            // Jika jam saat ini lebih dari atau sama dengan pulangRole, maka user bisa pulang
            canLeave =
              currentHour > pulangHour ||
              (currentHour === pulangHour && currentMinute >= pulangMinute);
            console.log(`Jam Pulang: ${pulangRole}, Bisa Pulang: ${canLeave}`);
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
          break; // Keluar dari loop setelah menemukan user yang cocok
        }
      }
    }

    if (isAbsenSuccess && matchedUser) {
      setAbsenSuccess(true);
      setCurrentUser(matchedUser);

      if (canLeave) {
        try {
          await axios.patch(`${API_Backend}/absen/${matchedUser.id}`, {
            userId: matchedUser.id,
          });
          Swal.fire({
            title: "Absen Pulang",
            text: `Hai ${matchedUser.name}. Hati-hati diperjalanan pulang yaa!`,
            icon: "success",
            confirmButtonText: "Close",
          });
        } catch (error) {
          console.error("Error posting absen:", error);
          Swal.fire({
            title: "Absen Gagal",
            text: `Gagal absen: ${error.response?.data?.msg || error.message}`,
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      } else {
        Swal.fire({
          title: "Belum saatnya pulang",
          text: "Belum saatnya untuk pulang. Berikan alasan anda!",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Batal",
          confirmButtonText: "Lanjut",
        }).then((result) => {
          if (result.isConfirmed) {
            setShowReasonField(true);
          }
        });
      }
    } else {
      setSimilarity("Tidak dapat mendeteksi wajah");
      Swal.fire({
        title: "Absen Gagal",
        text: "Tidak dapat mendeteksi wajah",
        icon: "error",
        confirmButtonText: "Close",
      });
    }

    setIsSubmitting(false);
  };

  const handleAbsenClick = () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      calculateSimilarity();
    }
  };

  const handleSubmitReason = async (event) => {
    event.preventDefault();
    if (currentUser) {
      try {
        await axios.patch(`${API_Backend}/absen/${currentUser.id}`, {
          userId: currentUser.id,
          reason: reason,
        });
        setAlasanSuccess(true);
        Swal.fire({
          title: "Data terkirim !",
          text: `Hai ${currentUser.name}, data sudah dikirim!`,
          icon: "success",
          confirmButtonText: "Close",
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error posting reason:", error);
        Swal.fire({
          title: "Gagal Mengirim Alasan",
          text: `Gagal mengirim alasan: ${
            error.response?.data?.msg || error.message
          }`,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    }
  };

  if (initializing) {
    return (
      <div className="container bg-white dark:bg-dark text-light dark:text-white rounded shadow p-4">
        <Skeleton height={40} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
      </div>
    );
  }

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="justify-content-between"
      >
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link href="/dashboard-user/absen">Absen Hadir</Nav.Link>
              <Nav.Link
                href="/dashboard-user/absen/absen-pulang"
                className="text-white text-decoration-underline text-decoration-white"
              >
                Absen Pulang
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container d-flex justify-content-center bg-light dark:bg-dark mt-2 rounded">
        <div className="text-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-circle w-100"
            videoConstraints={{
              facingMode: "user",
            }}
            style={{ transform: "scaleX(-1)" }}
          />
          <div>
            <img ref={imageRef2} className="d-none" alt="Captured Image" />
          </div>
          <button
            className="btn text-primary btn-primary mt-3 text-white"
            onClick={handleAbsenClick}
            disabled={isSubmitting} // Menonaktifkan tombol jika isSubmitting adalah true
          >
            {isSubmitting ? "Sedang memproses..." : "Absen pulang"}
          </button>
          {!isAfterBack && showReasonField && (
            <>
              <h3 className="mb-3 mt-4 text-lg text-danger font-weight-bold">
                Berikan alasan pulang lebih cepat
              </h3>
              <div className="d-flex flex-column align-items-center mt-2">
                <form className="w-75" onSubmit={handleSubmitReason}>
                  <div className="d-flex align-items-center">
                    <div className="form-group me-2 flex-grow-1">
                      <textarea
                        id="reason"
                        rows="2"
                        className="form-control me-2"
                        placeholder="Keterangan..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleSubmitReason}
                    >
                      Kirim
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <br />
    </>
  );
};

export default FaceComparison;
