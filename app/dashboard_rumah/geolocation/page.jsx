"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FaRegImage } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function Capture({ userName }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [attendance, setAttendance] = useState("Hadir");

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
      logoImg.onload = () => {
        const logoWidth = 70;
        const logoHeight = 70;
        const logoX = 10;
        const logoY = canvasRef.current.height - 140;
        context.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

        context.font = "17px Arial";
        context.fillStyle = "white";
        const textX = logoX + logoWidth + 5;
        const nama = userName;

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
        setPhoto(image);
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

  const submitData = () => {
    console.log("Photo:", photo);
    console.log("Location:", location);
    Swal.fire({
      title: "Berhasil!",
      text: "Datamu berhasil terkirim! Silahkan melanjutkan ke absen hadir!",
      icon: "success",
    });
  };

  const toggleAttendance = () => {
    setAttendance((prev) => (prev === "Hadir" ? "Tidak Hadir" : "Hadir"));
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="justify-content-center"
      >
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto fs-5">
              <Nav.Link
                href="/dashboard_rumah/geolocation"
                className="mx-3"
                active
              >
                Geolocation
              </Nav.Link>
              <Nav.Link href="/dashboard_rumah/keterangan" className="mx-3">
                keterangan
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light dark:bg-dark">
        <h1 className="display-4 mt-7 font-bold mb-5 position-absolute top-0 start-0 ms-4 text-dark dark:text-white">
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
              <button onClick={submitData} className="btn btn-success">
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
                  <input type="file" className="d-none" ref={fileInputRef} />
                  <FaRegImage size={24} />
                </button>
                <textarea
                  id="chat"
                  rows="1"
                  className="form-control me-2"
                  placeholder="Keterangan..."
                ></textarea>
                <button type="submit" className="btn btn-primary">
                  Kirim
                </button>
              </div>
            </form>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="d-none"
          width="480"
          height="320"
        ></canvas>
      </div>
    </div>
  );
}
