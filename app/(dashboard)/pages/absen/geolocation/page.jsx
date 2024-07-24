"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FaRegImage } from "react-icons/fa6";

export default function Capture() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [attendance, setAttendance] = useState("Hadir");
  const fileInputRef = useRef(null); // Tambahkan ref untuk input file


  useEffect(() => {
    // Ambil geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error accessing geolocation: ", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const getFormattedDate = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("id-ID", options);
  };

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const context = canvasRef.current.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set background color
      context.fillStyle = "white";
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Flip the image horizontally
      context.translate(canvasRef.current.width, 0);
      context.scale(-1, 1);
      context.drawImage(
        img,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      context.setTransform(1, 0, 0, 1, 0, 0);

      // Ambil waktu sekarang
      const date = getFormattedDate();
      const time = getFormattedTime();

      // Menggambar latar belakang transparan untuk keterangan
      context.fillStyle = "rgba(128, 128, 128, 0.5)";
      context.fillRect(
        0,
        canvasRef.current.height - 150,
        canvasRef.current.width,
        150
      );

      // Muat logo dari direktori publik dan gambar di latar belakang transparan
      const logoImg = new Image();
      logoImg.src = "/images/assets/gmt-ultra-full-extra-hd.png";
      logoImg.onload = () => {
        // Perbesar logo dan posisikan di tengah area latar belakang transparan
        const logoWidth = 70; // Perbesar lebar logo
        const logoHeight = 70; // Perbesar tinggi logo
        const logoX = 10; // Posisi X logo
        const logoY = canvasRef.current.height - 140; // Posisi Y logo
        context.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

        // Tulis keterangan setelah logo dimuat
        context.font = "20px Arial";
        context.fillStyle = "white";
        const textX = logoX + logoWidth + 10; // Mulai teks setelah logo
        const nama = "Abyan Yusuf D"; // Ganti dengan variabel nama yang Anda miliki
        

        context.fillText(
          `Nama: ${nama}`,
          textX,
          canvasRef.current.height - 130
        );
        if (location.latitude && location.longitude) {
          context.fillText(
            `Lokasi Anda: ${location.latitude}, ${location.longitude}`,
            textX,
            canvasRef.current.height - 100
          );
        }
        context.fillText(
          `Tanggal: ${date}`,
          textX,
          canvasRef.current.height - 70
        );
        context.fillText(`Waktu: ${time}`, textX, canvasRef.current.height - 40);

        // Set foto dengan keterangan yang telah ditambahkan
        const image = canvasRef.current.toDataURL("image/png");
        setPhoto(image);
      };
    };

    img.src = imageSrc;
  };

  const retakePhoto = () => {
    setPhoto(null);
    setLocation({ latitude: null, longitude: null });

    // Ambil geolocation lagi
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error accessing geolocation: ", error);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const submitData = () => {
    // Kirim data photo dan geolocation ke server
    console.log("Photo:", photo);
    console.log("Location:", location);
    alert("Data submitted!");
  };

  const toggleAttendance = () => {
    setAttendance((prev) => (prev === "Hadir" ? "Tidak Hadir" : "Hadir"));
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light dark:bg-dark">
      <h1 className="display-4 mt-2 font-bold mb-4 position-absolute top-0 start-0 ms-4 text-dark dark:text-white">
        {/* Geolocation */}
      </h1>
      {!photo && (
        <div className="d-flex flex-column align-items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="border border-secondary mt-4 rounded"
            width="500"
            height="350"
            videoConstraints={{
              facingMode: "user",
            }}
            style={{ transform: "scaleX(-1)" }}
          />
          <button
            onClick={capturePhoto}
            className="btn btn-primary mt-4"
            disabled={location.latitude === null || location.longitude === null}
          >
            Ambil Foto
          </button>
        </div>
      )}
      {photo && (
        <div className="mt-4 d-flex flex-column align-items-center">
          <img
            src={photo}
            alt="Captured"
            className="border border-secondary mt-2"
          />
          <div className="d-flex gap-2 mt-4">
            <button
              onClick={retakePhoto}
              className="btn btn-secondary"
            >
              Retake Photo
            </button>
            <button
              onClick={submitData}
              className="btn btn-success"
            >
              Kirim Data
            </button>
          </div>
        </div>
      )}
      <button
        onClick={toggleAttendance}
        className={`btn mt-4 ${
          attendance === "Hadir" ? "btn-success" : "btn-danger"
        }`}
      >
        {attendance === "Hadir" ? "Hadir" : "Tidak Hadir"}
      </button>
      {attendance === "Tidak Hadir" && (
        <div className="mt-4 w-100 d-flex justify-content-center">
          <form className="w-100">
            <label htmlFor="chat" className="form-label">
              Alasan
            </label>
            <div className="d-flex align-items-center">
              <div className="form-group me-2">
                <select className="form-select">
                  <option>Izin</option>
                  <option>Sakit</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={handleFileUploadClick}
              >
                <input
                  type="file"
                  className="d-none"
                  ref={fileInputRef}
                />
                <FaRegImage size={24} />
              </button>
              <textarea
                id="chat"
                rows="1"
                className="form-control me-2"
                placeholder="Keterangan..."
              ></textarea>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="d-none"
        width="640"
        height="480"
      ></canvas>
    </div>
  );
}
