"use client";

import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import { Navbar, Nav, Container, Card, Row, Col } from "react-bootstrap";

const FaceComparison = () => {
  const [initializing, setInitializing] = useState(true);
  const [similarity, setSimilarity] = useState(null);
  const [image2, setImage2] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [absenSuccess, setAbsenSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [isWithinBounds, setIsWithinBounds] = useState(false);
  const webcamRef = useRef(null);
  const imageRef2 = useRef(null);

  const officeLat = -6.756357; // Latitude kantor
  const officeLng = 108.474424; // Longitude kantor
  const allowedRadius = 100; // Radius yang diizinkan dalam meter
  // const officeLat = -6.770397; // Latitude kantor
  // const officeLng = 108.461445; // Longitude kantor
  // const allowedRadius = 100; // Radius yang diizinkan dalam meter
  
  useEffect(() => {
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
    loadModels();
  }, []);

  const fetchUserPhotos = async () => {
    try {
      const response = await axios.get("http://localhost:5001/userfotoabsen");
      setUserPhotos(response.data);
      console.log("Foto pengguna berhasil diambil:", response.data);
    } catch (error) {
      console.error("Error mengambil foto pengguna: ", error);
      alert(
        "Gagal mengambil foto pengguna. Silakan periksa server dan endpoint."
      );
    }
  };

  useEffect(() => {
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

    for (let userPhoto of userPhotos) {
      if (!userPhoto.url_foto_absen) {
        console.error("User photo URL is null or undefined:", userPhoto);
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
        const similarityScore = (1 - distance).toFixed(2);

        if (similarityScore >= 0.6) {
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
      console.log("Absen berhasil untuk user:", matchedUser);
      try {
        await axios.post("http://localhost:5001/absen", {
          userId: matchedUser.id,
        });
        alert("Absen berhasil!");
      } catch (error) {
        console.error("Error mengirim data absen:", error);
        alert(`Gagal absen: ${error.response?.data?.msg || error.message}`);
      }
    } else {
      setSimilarity("Tidak dapat mendeteksi wajah");
    }
  };

  // Utility untuk menghitung jarak dua titik menggunakan Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // jari-jari bumi dalam meter
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // hasil dalam meter
  };

  // Fungsi untuk memeriksa apakah lokasi pengguna dalam batas kantor
  const isWithinOfficeBounds = (
    userLat,
    userLng,
    officeLat,
    officeLng,
    allowedRadius
  ) => {
    const distance = calculateDistance(userLat, userLng, officeLat, officeLng);
    return distance <= allowedRadius;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          const withinBounds = isWithinOfficeBounds(
            latitude,
            longitude,
            officeLat,
            officeLng,
            allowedRadius
          );
          setIsWithinBounds(withinBounds);
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

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
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-center">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link href="/dashboard-user/absen/geolocation" className="mx-3">Geolocation</Nav.Link>
              <Nav.Link href="/dashboard-user/absen" active className="mx-3" >Absen Hadir</Nav.Link>
              <Nav.Link href="/dashboard-user/absen/absen-pulang" className="mx-3">
                Absen Pulang
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container d-flex justify-content-center bg-light dark:bg-dark mt-7 mb-5 rounded">
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
            className="btn btn-primary mt-3"
            onClick={() => {
              if (isWithinBounds) {
                calculateSimilarity();
              } else {
                alert(
                  "Anda berada di luar area kantor. Absen tidak diizinkan."
                );
              }
            }}
          >
            Absen
          </button>
          {similarity && (
            <p className="text-danger font-weight-bold mt-3">
              Kemiripan wajah :{" "}
              <span className="text-primary">{similarity}</span>
            </p>
          )}
          {absenSuccess && currentUser && (
            <p className="text-success font-weight-bold mt-3">
              Hai {currentUser.name}, absen berhasil! Silahkan melanjutkan
              aktifitas anda!
            </p>
          )}
          {!isWithinBounds && (
            <p className="text-danger font-weight-bold mt-3">
              Anda berada di luar area kantor. Absen tidak diizinkan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceComparison;
