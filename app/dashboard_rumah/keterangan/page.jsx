"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Nav, Container } from "react-bootstrap";
import axios from "axios";

const WebinarCard = () => {
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [absen, setAbsen] = useState(null); // Added state for storing absen data

  // Fetch user data from local storage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login"; // Redirect to login if user data is not found
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch absensi data
  useEffect(() => {
    const fetchAbsens = async () => {
      try {
        const response = await axios.get("http://localhost:5001/absens");
        setAbsen(response.data); // Store absen data
      } catch (error) {
        console.error("Error fetching absens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbsens();
  }, []);

  // Fetch attendance status once user and absen are set
  useEffect(() => {
    if (user && absen) {
      const fetchAttendanceStatus = async () => {
        if (absen.length > 0) { // Pastikan ada data absen
          const absenId = absen[0].id; // Ambil id dari data absen yang pertama
          try {
            const response = await axios.get(`http://localhost:5001/cek/absen/${user.id}/${absenId}`);
            setAttendanceStatus(response.data.msg);
            setLoading(false);
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        } else {
          setError("Tidak ada data absen.");
          setLoading(false);
        }
      };

      fetchAttendanceStatus();
    }
  }, [user, absen]);

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
              <Nav.Link
                href="/dashboard_rumah/geolocation"
                className="mx-3"
              >
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
                  <h3 className="mb-4 text-truncate">
                    <img 
                      src="/images/assets/gmt-ultra-full-extra-hd.png" 
                      className="img-fluid w-6 h-12 rounded-top-3 mb-4" 
                      layout="responsive"
                    />
                    <div className="text-inherit">Education Edition</div>
                  </h3>
                  <div className="mb-4">
                    <div className="mb-3 lh-1">
                      <span className="me-1">
                        <i className="bi bi-calendar-check"></i>
                      </span>
                      <span>Thu, November 10, 2023</span>
                    </div>
                    <div className="lh-1">
                      <span className="me-1">
                        <i className="bi bi-clock"></i>
                      </span>
                      <span>6:00 PM - 8:00 PM GMT</span>
                    </div>
                  </div>
                  <div className="attendance-status mt-4">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (
                      <p>{attendanceStatus}</p>
                    )}
                  </div>
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