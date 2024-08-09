"use client";

import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import axios from "axios";
import moment from "moment"; // Import moment.js untuk mempermudah manipulasi tanggal

const WebinarCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [absenHariIni, setAbsenHariIni] = useState(null);

  // Ambil data user dari local storage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login"; // Redirect ke login jika data user tidak ditemukan
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch data absens dari API
  useEffect(() => {
    const fetchAbsens = async () => {
      try {
        const response = await axios.get("http://localhost:5001/absens");
        console.log(response.data); // Cek data yang diterima

        // Filter absensi berdasarkan user yang sedang login
        const userAbsens = response.data.filter(absen => absen.userId === user.id);
        
        // Dapatkan tanggal hari ini dalam format yang sesuai dengan data di backend
        const today = moment().format("YYYY-MM-DD");
        
        // Cek apakah user sudah absen hari ini
        const absenToday = userAbsens.find(absen => absen.tanggal === today);
        
        setAbsenHariIni(absenToday || null); // Simpan data absensi hari ini atau null jika belum absen

      } catch (error) {
        console.error("Error fetching absens:", error);
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAbsens();
    }
  }, [user]);

  return (
    <>
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
              <Nav.Link href="/dashboard_rumah/geolocation" className="mx-3">
                Geolocation
              </Nav.Link>
              <Nav.Link href="/dashboard_rumah/keterangan" className="mx-3" active>
                Keterangan
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <section className="py-6">
        <div className="container">
          <div className="row">
            <div className="col-xxl-3 col-xl-4 col-lg-6">
              <div className="card mb-4 mb-xl-0 card-hover border">
                <div className="card-body">
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>Error: {error}</p>
                  ) : (
                    <>
                      <h3 className="mb-4 text-truncate">
                        <img 
                          src={`http://localhost:5001/${user.image}` || "/images/assets/gmt-ultra-full-extra-hd.png"} 
                          className="img-fluid w-6 h-12 rounded-top-3 mb-4" 
                          alt="Profile"
                        />
                        <div className="text-inherit">{user?.name}</div>
                      </h3>
                      <div className="mb-4">
                        <div className="mb-3 lh-1">
                          <span className="me-1">
                            <i className="bi bi-calendar-check"></i>
                          </span>
                          <span>{moment().format("dddd, MMMM Do YYYY")}</span> {/* Tampilkan tanggal hari ini */}
                        </div>
                        <div className="lh-1">
                          <span className="me-1">
                            <i className="bi bi-clock"></i>
                          </span>
                          <span>{absenHariIni ? absenHariIni.waktu_datang : "Belum Absen"}</span> {/* Tampilkan waktu absen atau keterangan belum absen */}
                        </div>
                      </div>
                      <p className="mt-4">
                        {absenHariIni ? "Anda sudah absen hari ini." : "Anda belum absen hari ini."}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WebinarCard;
