"use client";

// Import necessary libraries and hooks
import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Modal, Button, Table } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import 'moment/locale/id'; // Impor locale Indonesia
import { API_Frontend, API_Backend } from "../../api/hello.js";

// Main component
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
  const [surat, setSurat] = useState({});
  const componentRef = useRef(); // Reference for printing

  // Effect untuk mengambil user dari localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = `${API_Frontend}/authentication/login`; // Ganti URL
    } else {
      setUser(JSON.parse(userData));
    }
    moment.locale('id'); // Set locale ke Indonesia
  }, []);

  // Effect untuk mengambil data absensi setelah user berhasil di-set
  useEffect(() => {
    if (user) {
      fetchSurat();
      fetchAbsens();
    }
  }, [user]);

    const fetchSurat = async () => {
      try {
        const response = await axios.get(`${API_Backend}/surats/1`); // Ganti URL
        setSurat(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Surat:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAbsens = async () => {
      try {
        const response = await axios.get(`${API_Backend}/absens`); // Ganti URL
        const userAbsens = response.data.filter(
          (absen) => absen.userId === user.id
        );
        const today = moment().format("YYYY-MM-DD");
        const absenToday = userAbsens.find((absen) => absen.tanggal === today);
        setAbsenHariIni(absenToday || null);
        hitungAbsenBulanIni(userAbsens);
      } catch (error) {
        console.error("Error fetching absens:", error);
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

  const hitungAbsenBulanIni = (dataAbsen) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const absenBulanIni = dataAbsen.filter((absen) => {
      const [year, month] = absen.tanggal.split("-");
      return parseInt(month) === currentMonth && parseInt(year) === currentYear;
    });
    const totalAbsen = absenBulanIni.length;
    const hadir = absenBulanIni.filter(
      (absen) => absen.keterangan === "Hadir"
    ).length;
    const persentaseKehadiran =
      totalAbsen > 0 ? ((hadir / totalAbsen) * 100).toFixed(2) : 0;
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="justify-content-beetween"
      >
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto fs-5">
              <Nav.Link href="/dashboard_rumah/geolocation" className="mx-3">
                Geolocation
              </Nav.Link>
              <Nav.Link
                href="/dashboard_rumah/keterangan"
                className="mx-3"
                active
              >
                Keterangan
              </Nav.Link>
              <Link href="/authentication/logout">
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px 20px",
                    marginLeft: "10px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Logout
                </button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
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
                          className="img-fluid w-50 h-auto rounded-top-3 mb-4" 
                          alt="Profile"
                        />
                      </h3>
                      <h3 className="mb-4 text-center">{user && user.name}</h3>
                      <div className="mb-4">
                        <div className="mb-3 lh-1">
                          <span>{moment().format("dddd, D MMMM YYYY")}</span>
                        </div>
                        <div className="lh-1">
                          <span>
                            Anda absen di jam :
                            {absenHariIni && absenHariIni.waktu_datang
                              ? ` ${absenHariIni.waktu_datang}`
                              : " Belum Absen"}
                          </span>
                          <p className="mt-4">
                            Persentase Kehadiran Bulan Ini:{" "}
                            {absenBulanIni.persentaseKehadiran}%
                          </p>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          height: "100px",
                          border: "2px solid blue",
                          borderRadius: "10px",
                        }}
                      >
                        <h4 className="text-center">{getMessage()}</h4>
                      </div>
                      <br />
                      <Button
                        className="d-flex justify-content-center align-items-center mx-auto" // Tambahkan mx-auto untuk memusatkan
                        onClick={handleShowModal}
                        variant="primary"
                        block
                        size="lg"
                      >
                        Cek Detail Kehadiran Bulan Ini
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Kehadiran Bulan Ini</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={componentRef}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {absenBulanIni.history.map((absen, index) => (
                  <tr key={index}>
                    <td>{absen.tanggal}</td>
                    <td>{absen.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WebinarCard;
