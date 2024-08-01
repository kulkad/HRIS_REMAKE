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
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAfterFour, setIsAfterFour] = useState(false);
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
      console.log("user photos: ", response.data);
    } catch (error) {
      console.error("Error fetching user photos: ", error);
    }
  };

  useEffect(() => {
    fetchUserPhotos();
  }, []);

  // Pengecekan jam, tidak bisa absen pulang sebelum jam 4 sore
  const checkTime = () => {
    const now = new Date();
    const hour = now.getHours();
    // Ini boleh di ganti ganti buat testing
    if (hour >= 9) {
      setIsAfterFour(true);
    }
  };

  useEffect(() => {
    checkTime();
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
      try {
        await axios.patch(`http://localhost:5001/absen/${matchedUser.id}`, {
          userId: matchedUser.id,
        });
        setShowModal(true); // Show success modal
      } catch (error) {
        console.error("Error posting absen:", error);
        setErrorMessage(
          `Gagal absen: ${error.response?.data?.msg || error.message}`
        );
        setShowErrorModal(true); // Show error modal
      }
    } else {
      setSimilarity("Tidak dapat mendeteksi kedua wajah");
      setErrorMessage("Tidak dapat mendeteksi kedua wajah");
      setShowErrorModal(true); // Show error modal
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
        {isAfterFour ? (
          <>
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
              onClick={calculateSimilarity}
            >
              Absen pulang
            </button>
            {similarity && (
              <p className="text-danger font-weight-bold mt-3">
                Kemiripan wajah :{" "}
                <span className="text-primary">{similarity}</span>
              </p>
            )}
            {absenSuccess && currentUser && (
              <p className="text-success font-weight-bold mt-3">
                Hai {currentUser.name}, absen pulang berhasil! Silahkan
                melanjutkan aktifitas anda!
              </p>
            )}
          </>
        ) : (
          <>
            <h2>Berikan alasan pulang lebih cepat</h2>
            <div className="mt-4 w-100 d-flex justify-content-center">
              <form className="w-100">
                <div className="d-flex align-items-center">
                  <div className="form-group me-2">
                    <textarea
                      id="chat"
                      rows="1"
                      className="form-control me-2"
                      placeholder="Keterangan..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Kirim
                  </button>
                </div>
              </form>
            </div>
            <p className="text-danger font-weight-bold mt-3">
              Anda hanya dapat absen pulang setelah jam 4 sore.
            </p>
          </>
        )}
      </div>

      {/* Success Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Absen Pulang</h5>
            </div>
            <div className="modal-body">
              <p>Absen pulang berhasil!</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <div
        className={`modal fade ${showErrorModal ? "show" : ""}`}
        style={{ display: showErrorModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 h5 className="modal-title">Absen Gagal</h5>
            </div>
            <div className="modal-body">
              <p>{errorMessage}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowErrorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceComparison;
