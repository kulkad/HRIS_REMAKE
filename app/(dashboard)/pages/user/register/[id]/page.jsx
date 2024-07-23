"use client";

import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";
import { useParams } from "next/navigation";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const DaftarAbsen = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const [role, setRole] = useState("");

  useEffect(() => {
    // Mengambil parameter query 'role' dari URL
    const queryParams = new URLSearchParams(window.location.search);
    const roleFromUrl = queryParams.get("role");
    setRole(roleFromUrl);
  }, []);

  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [similarity, setSimilarity] = useState(null);
  const [absenSuccess, setAbsenSuccess] = useState(false);

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

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const retakePhoto = () => {
    setPhoto(null);
    setSimilarity(null);
    setAbsenSuccess(false);
  };

  const handleSubmit = async () => {
    if (!photo || !id) return; // Pastikan photo dan id ada

    try {
      const responseBlob = await fetch(photo);
      const blob = await responseBlob.blob();

      const formData = new FormData();
      formData.append("file", blob, "photo.png");

      const updateResponse = await axios.patch(
        `http://localhost:5001/userAbsen/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(updateResponse.data);
      setAbsenSuccess(true); // Set success message
      alert("Berhasil Daftar Absen");
      window.location.href = "/"; // Redirect setelah berhasil
    } catch (error) {
      console.error("Error submitting data:", error.message);
      alert("Gagal mengirim data, silakan coba lagi."); // Pesan error
    }
  };

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

  return (
    <div className="bg-white rounded-lg mx-4 p-4 text-xl dark:bg-gray-800">
      <div className="grid grid-cols-3 gap-4">
        <p className="px-6 py-10 font-semibold dark:text-white">
          Halaman Daftar Absen
        </p>
      </div>
      <div className="mt-5 flex justify-center">
        <div className="flex flex-col items-center">
          {!photo && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="640"
              height="480"
              videoConstraints={{
                facingMode: "user",
              }}
              className="transform scaleX-[-1]"
              style={{ transform: "scaleX(-1)" }}
            />
          )}
          {photo && <img src={photo} alt="Captured" className="mt-4" />}
        </div>
      </div>
      <div className="flex justify-center gap-16 mt-4">
        {!photo && (
          <button
            onClick={capture}
            className="flex self-start mt-3 w-30 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ambil Foto
          </button>
        )}
        {photo && (
          <div className="flex space-x-2 mt-4">
            <button
              onClick={retakePhoto}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Retake Photo
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Kirim Data
            </button>
          </div>
        )}
      </div>
      {similarity && (
        <p className="text-red-600 font-semibold mb-4">
          Kemiripan wajah : {similarity}
        </p>
      )}
      {absenSuccess && (
        <p className="text-blue-600 font-semibold">
          Absen berhasil! Silahkan melanjutkan aktifitas anda!
        </p>
      )}
    </div>
  );
};

export default DaftarAbsen;
