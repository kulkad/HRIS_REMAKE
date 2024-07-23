"use client";

import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Komponen utama FaceComparison
const FaceComparison = () => {
  // State untuk mengatur apakah model sedang diinisialisasi
  const [initializing, setInitializing] = useState(true);
  // State untuk menyimpan nilai kesamaan wajah
  const [similarity, setSimilarity] = useState(null);
  // State untuk menyimpan gambar yang diambil
  const [image2, setImage2] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [absenSuccess, setAbsenSuccess] = useState(false);
  // Refs untuk referensi webcam dan gambar
  const webcamRef = useRef(null);
  const imageRef2 = useRef(null);

  // Hook useEffect untuk memuat model face-api.js saat komponen pertama kali di-render
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      setInitializing(false);
    };
    loadModels();
  }, []);

  // Mengambil URL foto dari database
  const fetchUserPhotos = async () => {
    try {
      const response = await axios.get("http://localhost:5001/userfotoabsen"); // Ganti dengan endpoint API Anda
      setUserPhotos(response.data);
    } catch (error) {
      console.error("Error fetching user photos: ", error);
    }
  };

  useEffect(() => {
    fetchUserPhotos();
  }, []);

  

  // Fungsi untuk mengambil gambar dari webcam dan menyimpannya ke state
  const capture = (setImage, imageRef) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    imageRef.current.src = imageSrc;
  };

  // Fungsi untuk menghitung kesamaan antara dua wajah
  const calculateSimilarity = async () => {
    capture(setImage2, imageRef2);

    const img2 = imageRef2.current;
    let isAbsenSuccess = false;

    for (let userPhoto of userPhotos) {
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
        const similarityScore = (1 - distance).toFixed(2); // Skor kesamaan
        console.log(similarityScore);

        if (similarityScore >= 0.6) {
          // Tentukan threshold kesamaann
          isAbsenSuccess = true;
          setSimilarity(similarityScore);
          break;
        }
      }
    }

    if (isAbsenSuccess) {
      setAbsenSuccess(true);
      alert("Absen Pulang berhasil!");
      // Kirim data absen ke database
      await axios.post("/api/absen", { photo: image2 });
    } else {
      setSimilarity("Tidak dapat mendeteksi kedua wajah");
    }
  };

  // Jika model masih dalam proses inisialisasi, tampilkan pesan loadingg
  if (initializing) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 dark:text-white max-w-md mx-auto rounded-lg shadow-md overflow-hidden md:max-w-2xl p-4">
        <Skeleton height={40} count={1} className="mb-4"/>
        <Skeleton height={20} count={1} className="mb-4"/>
        <Skeleton height={20} count={1} className="mb-4"/>
        <Skeleton height={50} width={150} className="mb-4"/>
        <Skeleton height={50} width={150} className="mb-4"/>
      </div>
    );
  }

  // Tampilkan antarmuka pengguna
  return (
    <div className="flex justify-center bg-gray-300 dark:bg-gray-600 mt-2 ml-4 rounded-md">
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className=" mt-4 rounded-md w-96 h-auto"
          style={{ transform: "scaleX(-1)" }}
        />
        <div>
          <img ref={imageRef2} className="hidden" alt="Captured Image" />
        </div>
        <button
          className="flex justify-self-center ml-40 mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={calculateSimilarity}
        >
          Absen pulang
        </button>
        {similarity && (
          <p className="text-red-600 font-semibold mb-4">
            Kemiripan wajah :{" "}
            <span className="mb-4 text-blue-800 font-semibold">
              {similarity}
            </span>
          </p>
        )}
        {absenSuccess && (
          <p className="text-blue-600 font-semibold">
            Haii {userPhotos.name} Absen pulang berhasil! Silahkan melanjutkan
            aktifitas anda !
          </p>
        )}
      </div>
    </div>
  );
};

export default FaceComparison;
