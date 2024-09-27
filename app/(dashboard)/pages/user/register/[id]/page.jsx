"use client";

import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import { API_Frontend, API_Backend } from "../../../../../api/hello.js";

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
        `${API_Backend}/userAbsen/${id}`, // Ganti URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(updateResponse.data);
      setAbsenSuccess(true); // Set success message
      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil mendaftarkan wajah !",
        icon: "success",
      }).then(() => {
        // Pindah halaman setelah alert ditutup
        window.location.href = `${API_Frontend}/pages/user/users`; // Ganti URL
      });
    } catch (error) {
      console.error("Error submitting data:", error.message);
      Swal.fire({
        title: "Berhasil!",
        text: "Gagal mendaftarkan wajah !",
        icon: "error",
      }).then(() => {
        window.location.href = `${API_Frontend}/pages/user/register`; // Ganti URL
      });
    }
  };

  if (initializing) {
    return (
      <div className="container bg-white text-dark rounded shadow p-4">
        <Skeleton height={40} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
      </div>
    );
  }

  return (
    <div className="container bg-white rounded p-4 text-xl">
      <div className="row mb-4">
        <h4 className="col-12 text-center font-weight-bold">
          Halaman Daftar Absen
        </h4>
      </div>
      <div className="row justify-content-center">
        <div className="col-auto">
          {!photo && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "user",
              }}
              className="rounded-circle w-100"
              style={{ transform: "scaleX(-1)" }}
            />
          )}
          {photo && (
            <img
              src={photo}
              alt="Captured"
              className="mt-4 rounded-circle"
              style={{ transform: "scaleX(-1)" }}
            />
          )}
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        {!photo && (
          <button
            onClick={capture}
            className="btn btn-primary btn-sm"
            style={{ width: "auto" }}
          >
            Ambil Foto
          </button>
        )}
        {photo && (
          <div className="d-flex justify-content-center mt-4">
            <button
              onClick={retakePhoto}
              className="btn btn-secondary me-2 btn-sm"
            >
              Retake Photo
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-success ms-2 btn-sm"
            >
              Kirim Data
            </button>
          </div>
        )}
      </div>
      {similarity && (
        <p className="text-danger font-weight-bold mb-4">
          Kemiripan wajah : {similarity}
        </p>
      )}
      {absenSuccess && (
        <p className="text-primary font-weight-bold text-center"></p>
      )}
    </div>
  );
};

export default DaftarAbsen;
