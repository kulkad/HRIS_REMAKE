"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, Nav, Container, Modal, Button, Table } from "react-bootstrap";
import axios from "axios";
import moment from "moment";

const WebinarCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [absenHariIni, setAbsenHariIni] = useState(null);
  const [absenBulanIni, setAbsenBulanIni] = useState({
    hadir: 0,
    tidakHadir: 0,
    persentaseKehadiran: 0,
    history: [],
  });
  const [showModal, setShowModal] = useState(false);

  // Untuk mengganti warna dari database
  const [warna, setWarna] = useState({});
  const [textColor, setTextColor] = useState("#FFFFFF");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("http://localhost:5001/settings/1");
        setWarna(response.data);

        // Mengambil warna latar belakang dari API
        const backgroundColor = response.data.warna_sidebar;

        // Menghitung luminance dari warna latar belakang
        const luminance = getLuminance(backgroundColor);

        // Jika luminance rendah, gunakan teks putih, jika tinggi, gunakan teks hitam
        setTextColor(luminance > 0.5 ? "#000000" : "#FFFFFF");
      } catch (error) {
        console.error("Error fetching Settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Retrieve user data from local storage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login"; // Redirect to login if user data not found
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch absens data from API
  useEffect(() => {
    const fetchAbsens = async () => {
      try {
        const response = await axios.get("http://localhost:5001/absens");
        // console.log(response.data); // Check the received data

        // Filter absensi based on the logged-in user
        const userAbsens = response.data.filter(
          (absen) => absen.userId === user.id
        );

        // Get today's date in a format matching the backend data
        const today = moment().format("YYYY-MM-DD");

        // Check if the user has already checked in today
        const absenToday = userAbsens.find((absen) => absen.tanggal === today);

        setAbsenHariIni(absenToday || null); // Save today's attendance data or null if not yet checked in

        // Calculate attendance for this month
        hitungAbsenBulanIni(userAbsens);
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

  // Calculate monthly attendance percentage and history
  const hitungAbsenBulanIni = (dataAbsen) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth is zero-indexed
    const currentYear = today.getFullYear();

    // Filter attendance for the current month and year
    const absenBulanIni = dataAbsen.filter((absen) => {
      const [year, month] = absen.tanggal.split("-");
      return parseInt(month) === currentMonth && parseInt(year) === currentYear;
    });

    // Count total attendance
    const totalAbsen = absenBulanIni.length;
    const hadir = absenBulanIni.filter(
      (absen) => absen.keterangan === "Hadir"
    ).length;

    // Calculate attendance percentage
    const persentaseKehadiran =
      totalAbsen > 0 ? ((hadir / totalAbsen) * 100).toFixed(2) : 0;

    // Prepare attendance history for the table
    const history = Array.from({ length: 31 }, (_, i) => {
      const date = moment(
        `${currentYear}-${currentMonth}-${i + 1}`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD");
      const absen = absenBulanIni.find((a) => a.tanggal === date);
      return {
        tanggal: i + 1,
        keterangan: absen ? absen.keterangan : "Tidak Ada Data",
      };
    });

    setAbsenBulanIni({
      hadir,
      tidakHadir: totalAbsen - hadir,
      persentaseKehadiran,
      history,
    });
  };

  // Determine the message based on keterangan
  const getMessage = () => {
    if (!absenHariIni) return "Anda belum absen hari ini.";
    switch (absenHariIni.keterangan) {
      case "Hadir":
        return "Anda sudah absen hari ini.";
      case "Alpha":
        return "Anda alpha untuk hari ini.";
      case "Sakit":
        return "Anda sedang sakit, silahkan beristirahat untuk hari ini.";
      case "Izin":
        return "Anda sedang izin hari ini.";
      default:
        return "Status kehadiran tidak diketahui.";
    }
  };

  // Open and close the modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
              <Nav.Link href="/dashboard_rumah/geolocation" className="mx-3" style={{
                  color: textColor,
                }}>
                Geolocation
              </Nav.Link>
              <Nav.Link
                href="/dashboard_rumah/keterangan"
                className="mx-3"
                style={{
                  color: textColor,
                }}
                active
              >
                Keterangan
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <div>
          <Link href="/authentication/logout">
            <button
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "10px 20px",
                marginRight: "20px",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Logout
            </button>
          </Link>
        </div>
      </Navbar>

      <section className="py-6">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-3 col-xl-4 col-lg-6">
              <div className="card mb-4 mb-xl-0 card-hover border">
                <div className="card-body">
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>Error: {error}</p>
                  ) : (
                    <>
                      <h3 className="mb-4 text-center">
                        <img
                          src={user.url}
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
                          <span>{moment().format("dddd, MMMM Do YYYY")}</span>{" "}
                          {/* Show today's date */}
                        </div>
                        <div className="lh-1">
                          <span className="me-1">
                            <i className="bi bi-clock"></i>
                          </span>
                          <span>
                            Anda absen di jam :
                            {absenHariIni && absenHariIni.waktu_datang
                              ? ` ${absenHariIni.waktu_datang}`
                              : " Belum Absen"}
                          </span>{" "}
                          {/* Show check-in time or not checked in yet */}
                        </div>
                      </div>
                      <p className="mt-4">{getMessage()}</p>
                      <p className="mt-4">
                        Persentase Kehadiran Bulan Ini:{" "}
                        {absenBulanIni.persentaseKehadiran}%
                      </p>
                      <button
                        onClick={handleShowModal}
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          padding: "10px 20px",
                          marginRight: "20px",
                          border: "none",
                          borderRadius: "5px",
                        }}
                      >
                        Absen bulan ini
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Riwayat Absen Bulan Ini</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {absenBulanIni.history.map((absen) => (
                <tr
                  key={absen.tanggal}
                  style={{
                    backgroundColor:
                      absen.keterangan === "Hadir"
                        ? "green"
                        : absen.keterangan === "Alpha"
                        ? "red"
                        : absen.keterangan === "Izin" ||
                          absen.keterangan === "Sakit"
                        ? "orange"
                        : "white",
                    color: "white",
                  }}
                >
                  <td>{absen.tanggal}</td>
                  <td>{absen.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default WebinarCard;
