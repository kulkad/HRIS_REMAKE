"use client";

import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import { Navbar, Container, Nav } from "react-bootstrap";
import { API_Backend } from "../../api/hello.js";

const FaceComparison = () => {
  const [initializing, setInitializing] = useState(true);
  const [similarity, setSimilarity] = useState(null);
  const [image2, setImage2] = useState(null);
  const [jamAlpha, setJamAlpha] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [absenSuccess, setAbsenSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isWithinBounds, setIsWithinBounds] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webcamRef = useRef(null);
  const imageRef2 = useRef(null);

  const officeLat = -6.770397; // Latitude kantor
  const officeLng = 108.461445; // Longitude kantor
  const allowedRadius = 100000; // Kalau di laptop kurang akurat, jadi diubah saja

  const loadModels = async () => {
    const MODEL_URL = "/models";
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      setInitializing(false);
      console.log("Models loaded");
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const fetchUserPhotos = async () => {
    try {
      const response = await axios.get(`${API_Backend}/userfotoabsen`);
      setUserPhotos(response.data);
      console.log("Foto pengguna berhasil diambil");
    } catch (error) {
      console.error("Error mengambil foto pengguna");
      alert("Gagal mengambil foto pengguna. Silakan periksa server dan endpoint.");
    }
  };

  useEffect(() => {
    loadModels();
    fetchUserPhotos();

    fetchJamAlpha();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          //console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Log lokasi pengguna
          setLocation({ latitude, longitude });

          const withinBounds = isWithinOfficeBounds(latitude, longitude, officeLat, officeLng, allowedRadius);
          setIsWithinBounds(withinBounds);
          //console.log(`Within Bounds: ${withinBounds}`); // Log hasil perhitungan bounds
        },
        (error) => {
          console.error("Error obtaining location:", error);
          getLocationFromIP(); // Fallback to IP-based location
        },
      );
    } else {
      console.log("Geolocation is not supported by this browser. Using IP-based location as fallback.");
      getLocationFromIP(); // Fallback to IP-based location
    }
  }, []);

  const capture = (setImage, imageRef) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    imageRef.current.src = imageSrc;
  };

  const getCurrentTime24HourFormat = () => {
    const now = new Date();

    // Mengambil waktu lokal dari perangkat pengguna
    const hours = now.getHours().toString().padStart(2, "0"); // Jam (24 jam format)
    const minutes = now.getMinutes().toString().padStart(2, "0"); // Menit
    const seconds = now.getSeconds().toString().padStart(2, "0"); // Detik

    return `${hours}:${minutes}:${seconds}`;
  };

  const calculateSimilarity = async () => {
    const currentTime = getCurrentTime24HourFormat(); // Ambil waktu saat ini
    if (currentTime >= jamAlpha) {
      Swal.fire({
        title: "Gagal!",
        text: "Tidak dapat melakukan absen saat ini!",
        icon: "error",
      });
      setIsSubmitting(false);
      return; // Kembali dan tidak melanjutkan proses absen
    }

    capture(setImage2, imageRef2);

    const img2 = imageRef2.current;
    let isAbsenSuccess = false;
    let matchedUser = null;

    for (let userPhoto of userPhotos) {
      if (!userPhoto.url_foto_absen) {
        console.error("User photo URL is null or undefined:", userPhoto);
        continue;
      }

      const img1 = document.createElement("img");
      img1.crossOrigin = "anonymous";
      img1.src = userPhoto.url_foto_absen;

      await new Promise((resolve) => {
        img1.onload = resolve;
      });

      const detection1 = await faceapi.detectSingleFace(img1, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();

      const detection2 = await faceapi.detectSingleFace(img2, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();

      if (detection1 && detection2) {
        const distance = faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor);
        const similarityScore = ((1 - distance) * 100).toFixed(2); // Convert to percentage

        if (similarityScore >= 60) {
          // 60% similarity threshold
          isAbsenSuccess = true;
          setSimilarity(similarityScore);
          matchedUser = userPhoto;
          break;
        }
      }
    }

    if (isAbsenSuccess && matchedUser) {
      setAbsenSuccess(true);
      setCurrentUser(matchedUser);
      // console.log("Absen berhasil untuk user:", matchedUser);
      try {
        const currentTime = getCurrentTime24HourFormat();
        await axios.post(
          `${API_Backend}/absen`,
          {
            // Ganti IP dengan API_Backend
            userId: matchedUser.id,
            waktu_datang: currentTime,
            lat: location.latitude,
            long: location.longitude,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );
        Swal.fire({
          title: "Berhasil!",
          text: `Hai ${matchedUser.name}. Selamat melanjutkan aktivitas anda!`,
          icon: "success",
        });
      } catch (error) {
        console.error("Error mengirim data absen:", error);
        Swal.fire({
          title: "Gagal!",
          text: error.response?.data?.msg || error.message,
          icon: "error",
        });
      }
    } else {
      if (!isWithinBounds) {
        Swal.fire({
          title: "Gagal!",
          text: "Anda berada di luar jangkauan kantor!",
          icon: "error",
        });
        setIsSubmitting(false);
        return; // Kembali dan tidak melanjutkan proses absen
      }

      // Tambahkan logika untuk menangani wajah yang tidak terdaftar
      if (!matchedUser) {
        Swal.fire({
          title: "Peringatan!",
          text: "Wajah belum terdaftar.",
          icon: "warning",
        });
      }
      setSimilarity("Wajah tidak dikenali");
    }

    // Reset state setelah proses selesai
    setIsSubmitting(false); // Mengaktifkan kembali tombol setelah proses selesai

    // Reset currentUser dan absenSuccess jika user sudah absen
    if (currentUser && currentUser.id === matchedUser?.id) {
      setCurrentUser(null); // Reset currentUser setelah absen
      setAbsenSuccess(false); // Reset absenSuccess
    }
  };

  const getLocationFromIP = async () => {
    try {
      const response = await axios.get("https://ipapi.co/json/");
      const { latitude, longitude } = response.data;
      // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      setLocation({ latitude, longitude });

      const withinBounds = isWithinOfficeBounds(latitude, longitude, officeLat, officeLng, allowedRadius);
      setIsWithinBounds(withinBounds);
      // console.log(`Within Bounds: ${withinBounds}`);
    } catch (error) {
      console.error("Error obtaining location from IP:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // jari-jari bumi dalam meterpi
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // hasil dalam meter
    // console.log(`Distance: ${distance.toFixed(2)} meters`); // Log untuk memeriksa jarak
    return distance;
  };

  const isWithinOfficeBounds = (userLat, userLng, officeLat, officeLng, allowedRadius) => {
    const distance = calculateDistance(userLat, userLng, officeLat, officeLng);
    const withinBounds = distance <= allowedRadius;
    //console.log(`User is within bounds: ${withinBounds}`); // Log hasil perhitungan bounds
    return withinBounds;
  };

  const fetchJamAlpha = async () => {
    try {
      const response = await axios.get(`${API_Backend}/alpha/1`); // Ganti IP dengan API_Backend
      setJamAlpha(response.data.jam_alpha);
    } catch (error) {
      console.error("Error mengambil jam alpha:", error);
      alert("Gagal mengambil jam alpha. Silakan periksa server dan endpoint.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Nonaktifkan tombol selama proses berlangsung
    calculateSimilarity();
  };

  if (initializing) {
    return (
      <div className="container bg-white dark:bg-slate-900 dark:text-white rounded-lg shadow-md overflow-hidden p-4">
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
      {!initializing && (
        <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-between">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                <Nav.Link href="/dashboard-user/absen" className="text-white text-decoration-underline text-decoration-white">
                  Absen Hadir
                </Nav.Link>
                <Nav.Link href="/dashboard-user/absen/absen-pulang">Absen Pulang</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
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
          <form onSubmit={handleSubmit}>
            <button
              className="btn btn-primary mt-3"
              onClick={() => {
                if (!isSubmitting) {
                  if (isWithinBounds) {
                    setIsSubmitting(true); // Menonaktifkan tombol setelah diklik
                    calculateSimilarity();
                  } else {
                    alert("Anda berada di luar area kantor. Absen tidak diizinkan.");
                  }
                } else if (isSubmitting) {
                  handleSubmit();
                }
              }}
              disabled={isSubmitting} // Menonaktifkan tombol jika isSubmitting adalah true
            >
              {isSubmitting ? "Sedang memproses..." : "Absen"}
            </button>
          </form>
          {!isWithinBounds && <p className="text-danger font-weight-bold mt-3">Anda berada di luar area kantor. Absen tidak diizinkan.</p>}
        </div>
      </div>
      <br />
    </>
  );
};

export default FaceComparison;
