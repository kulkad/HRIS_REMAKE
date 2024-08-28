"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Swal from "sweetalert2";

export default function Capture({ userName }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [user, setUser] = useState();
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [keterangan, setKeterangan] = useState("Izin"); // Ubah nilai awal menjadi "Izin"
  const [alasan, setAlasan] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login";
    } else {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    }
  }, []);

  useEffect(() => {
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
    const imageSrc = webcamRef.current.getScreenshot({ format: "image/png" }); // Ubah format screenshot menjadi PNG
    const context = canvasRef.current.getContext("2d");
    const img = new Image();

    img.onload = () => {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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

      const date = getFormattedDate();
      const time = getFormattedTime();

      context.fillStyle = "rgba(128, 128, 128, 0.5)";
      context.fillRect(
        0,
        canvasRef.current.height - 150,
        canvasRef.current.width,
        150
      );

      const logoImg = new Image();
      logoImg.src = "/images/assets/gmt-ultra-full-extra-hd.png";
      logoImg.onload = () => {
        const logoWidth = 70;
        const logoHeight = 70;
        const logoX = 10;
        const logoY = canvasRef.current.height - 140;
        context.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

        context.font = "17px Arial";
        context.fillStyle = "white";
        const textX = logoX + logoWidth + 5;
        const nama = user.name;

        context.fillText(
          `Nama: ${nama}`,
          textX,
          canvasRef.current.height - 130
        );
        const marginTop = 6;
        let currentTextY = canvasRef.current.height - 130 + 30 + marginTop;

        if (location.latitude && location.longitude) {  
          context.fillText(
            `Lokasi Anda: ${location.latitude}, ${location.longitude}`,
            textX,
            currentTextY
          );
          currentTextY += 30 + marginTop;
        }
        context.fillText(`Tanggal: ${date}`, textX, currentTextY);
        currentTextY += 30 + marginTop;
        context.fillText(`Waktu: ${time}`, textX, currentTextY);

        const image = canvasRef.current.toDataURL("image/png"); // Pastikan format PNG
        setPhoto(image);
        
        // Tambahkan console.log di sini
        console.log("Isi foto yang dicapture:", image);
      };
    };

    img.src = imageSrc;
  };  

  const retakePhoto = () => {
    setPhoto(null);
    setLocation({ latitude: null, longitude: null });

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

  const submitData = async (e) => {
    e.preventDefault();
  
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toTimeString().split(" ")[0];
  
    try {
      // Kirim data dalam format JSON
      const response = await axios.post(
        "http://localhost:5001/absen/geolocation",
        {
          userId: user.id,
          lat: location.latitude,
          long: location.longitude,
          keterangan: keterangan,
          alasan: alasan,
          foto: photo, // Kirim string base64 secara langsung
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      Swal.fire({
        title: "Berhasil!",
        text: "Datamu berhasil terkirim! Silahkan melanjutkan ke absen hadir!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error Kirim Data", error);
    }
  
    console.log("Location:", location);
    console.log("Photo:", photo);
  };

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light dark:bg-dark">
        <h1 className="display-4 mt-7 font-bold mb-5 position-absolute top-0 start-0 ms-4 text-dark dark:text-white">
          {/* Geolocation */}
        </h1>
        {!photo && (
          <div className="d-flex flex-column align-items-center position-relative">
            <br />
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png" // Ubah format menjadi PNG
              className="rounded-circle w-100"
              videoConstraints={{
                facingMode: "user",
              }}
              style={{ transform: "scaleX(-1)" }}
            />
            <button
              onClick={capturePhoto}
              className="btn btn-primary mt-4"
              disabled={
                location.latitude === null || location.longitude === null
              }
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
              <button onClick={retakePhoto} className="btn btn-secondary">
                Retake Photo
              </button>
            </div>
            <div className="mt-4 w-100 d-flex justify-content-center">
              <form className="w-100">
                <div className="d-flex align-items-center">
                  <div className="form-group me-2 w-50">
                    <select 
                      className="form-select" 
                      value={keterangan} // Tambahkan ini
                      onChange={(e) => setKeterangan(e.target.value)}
                    >
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                    </select>
                  </div>
                  <textarea
                    id="chat"
                    rows="1"
                    className="form-control me-2"
                    placeholder="Alasan..."
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                  ></textarea>
                  <button onClick={submitData} className="btn btn-primary">
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="d-none"
          width="480"
          height="320"
        ></canvas>
      </div>
  );
}
