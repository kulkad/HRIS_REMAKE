"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Swal from "sweetalert2";
import Compressor from "compressorjs";

export default function Capture({ userName }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [keterangan, setKeterangan] = useState("Izin");
  const [alasan, setAlasan] = useState("");

  const [user, setUser] = useState([]); // untuk keamanan agar tidak bocor datanya
  const userData = localStorage.getItem("user");
    useEffect(() => {
  if (!userData) {
    window.location.href = "http://localhost:3000/authentication/login";
  } else {
    setUser(JSON.parse(userData));
  }


    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 60000, // 60 detik
        maximumAge: 0,
      };

      const id = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error accessing geolocation: ", error);
        },
        options
      );

      // Hentikan watching position setelah 15 detik
      const timeoutId = setTimeout(() => {
        navigator.geolocation.clearWatch(id);
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
          options
        );
      }, 15000);

      // Clear the timeout if the component unmounts
      return () => {
        clearTimeout(timeoutId);
        navigator.geolocation.clearWatch(id);
      };
    }
  }, []);

  const handleKeteranganChange = (event) => {
    setKeterangan(event.target.value);
  };

  const handleAlasanChange = (event) => {
    setAlasan(event.target.value);
  };

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

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
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
      logoImg.onload = async () => {
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

        const image = canvasRef.current.toDataURL("image/png");

        // Convert base64 to Blob
        const byteString = atob(image.split(",")[1]);
        const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        // Compress the image before setting it to state
        new Compressor(blob, {
          quality: 0.6, // Adjust the quality as needed
          success(result) {
            // Convert Blob to File object
            const file = new File([result], "photo.png", { type: result.type });
            setPhoto(file);
          },
          error(err) {
            console.error(err.message);
          },
        });
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
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("foto", photo); // Ensure `photo` is a File object
      formData.append("tanggal", formattedDate);
      formData.append("waktu_datang", formattedTime);
      formData.append("lat", location.latitude);
      formData.append("long", location.longitude);
      formData.append("keterangan", keterangan);
      formData.append("alasan", alasan);

      const response = await axios.post(
        "http://localhost:5001/absen/geolocation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
  };

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light dark:bg-dark">
      <h1 className="display-4 mt-2 font-bold mb-4 position-absolute top-0 start-0 ms-4 text-dark dark:text-white">
        {/* Geolocation */}
      </h1>
      {!photo && (
        <div className="d-flex flex-column align-items-center position-relative">
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
            src={URL.createObjectURL(photo)}
            alt="Captured"
            className="border border-secondary mt-2"
          />
          <div className="d-flex gap-2 mt-4">
            <button onClick={retakePhoto} className="btn btn-secondary">
              Retake Photo
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 w-100 d-flex justify-content-center">
        <form className="w-100" onSubmit={submitData}>
          <div className="d-flex align-items-center">
            <div className="form-group me-2">
              <select
                className="form-select"
                value={keterangan}
                onChange={handleKeteranganChange}
              >
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
              </select>
            </div>
            <textarea
              id="chat"
              rows="1"
              className="form-control me-2"
              placeholder="Keterangan..."
              value={alasan}
              onChange={handleAlasanChange}
            ></textarea>
            <button type="submit" className="btn btn-success">
              Kirim Data
            </button>
          </div>
        </form>
      </div>
      <canvas
        ref={canvasRef}
        className="d-none"
        width="480"
        height="320"
      ></canvas>
    </div>
  );
}
