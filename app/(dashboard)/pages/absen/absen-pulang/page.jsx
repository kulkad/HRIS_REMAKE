"use client";

import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FaceComparison = () => {
  const [initializing, setInitializing] = useState(true);
  const [similarity, setSimilarity] = useState(null);
  const [image2, setImage2] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [absenSuccess, setAbsenSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const webcamRef = useRef(null);
  const imageRef2 = useRef(null);

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

  const fetchUserPhotos = async () => {
    try {
      const response = await axios.get("http://localhost:5001/userfotoabsen");
      setUserPhotos(response.data);
    } catch (error) {
      console.error("Error fetching user photos: ", error);
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
      try {
        await axios.post("http://localhost:5001/absen", {
          userId: matchedUser.id,
        });
        alert("Absen pulang berhasil!");
      } catch (error) {
        console.error("Error posting absen:", error);
        alert(`Gagal absen: ${error.response?.data?.msg || error.message}`);
      }
    } else {
      setSimilarity("Tidak dapat mendeteksi kedua wajah");
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
    <div className="container d-flex justify-content-center bg-light dark:bg-dark mt-2 rounded">
      <div className="text-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded mt-4 w-100"
          style={{ transform: "scaleX(-1)" }}
        />
        <div>
          <img ref={imageRef2} className="d-none" alt="Captured Image" />
        </div>
        <button
          className="btn text-primary btn-primary mt-3"
          onClick={calculateSimilarity}
        >
          Absen pulang
        </button>
        {similarity && (
          <p className="text-danger font-weight-bold mt-3">
            Kemiripan wajah :{" "}
            <span className="text-primary">
              {similarity}
            </span>
          </p>
        )}
        {absenSuccess && currentUser && (
          <p className="text-success font-weight-bold mt-3">
            Hai {currentUser.name}, absen pulang berhasil! Silahkan melanjutkan
            aktifitas anda!
          </p>
        )}
      </div>
    </div>
  );
};

export default FaceComparison;
