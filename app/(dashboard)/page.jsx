"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Card, Pagination, Alert } from "react-bootstrap";
import "react-loading-skeleton/dist/skeleton.css";
import { Fragment } from "react";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";
import { API_Backend } from "../api/hello.js";

// Fungsi untuk menghitung luminance
const getLuminance = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]); // State to store all users
  const [absens, setAbsens] = useState([]); // State to store all absens
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [absenBulanIni, setAbsenBulanIni] = useState({
    persentaseKehadiran: 0,
  });
  const [absenHariIni, setAbsenHariIni] = useState({
    hadir: 0,
    tidakHadir: 0,
  });

  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name)); // Mengurutkan semua pengguna
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser); // Menggunakan pengguna yang sudah diurutkan

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage); // Menghitung total halaman berdasarkan pengguna yang sudah diurutkan

  // Untuk mengganti warna dari database
  const [data, setData] = useState({});
  const [textColor, setTextColor] = useState("#FFFFFF");

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_Backend}/settings/1`);
      setData(response.data);

      // Mengambil warna latar belakang dari API
      const backgroundColor = response.data.warna_secondary;

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_Backend}/users`);
      setUsers(response.data); // Update state with fetched users
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAbsens = async () => {
    try {
      const response = await axios.get(`${API_Backend}/absens`);
      setAbsens(response.data); // Update state with fetched absens
      hitungAbsenBulanIni(response.data);
      hitungAbsenHariIni(response.data);
    } catch (error) {
      console.error("Error fetching absens:", error);
    } finally {
      setLoading(false);
    }
  };

  const hitungAbsenHariIni = (absenHarian) => {
    const todayAbsen = new Date().toISOString().split("T")[0];
    const absenHariIni = absenHarian.filter(
      (absen) => absen.tanggal === todayAbsen
    );

    const hadir = absenHariIni.filter(
      (absen) => absen.keterangan === "Hadir"
    ).length;

    const tidakHadir = absenHariIni.filter((absen) =>
      ["Sakit", "Izin", "Alpha"].includes(absen.keterangan)
    ).length;

    setAbsenHariIni({
      hadir,
      tidakHadir,
    });
  };

  const hitungAbsenBulanIni = (dataAbsen) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const absenBulanIni = dataAbsen.filter((absen) => {
      const [year, month] = absen.tanggal.split("-");
      return parseInt(month) === currentMonth && parseInt(year) === currentYear;
    });

    const hadir = absenBulanIni.filter(
      (absen) => absen.keterangan === "Hadir"
    ).length;
    const tidakHadir = absenBulanIni.filter((absen) =>
      ["Alpha", "Sakit", "Izin"].includes(absen.keterangan)
    ).length;
    const totalAbsen = hadir + tidakHadir;

    const persentaseKehadiran = totalAbsen > 0 ? (hadir / totalAbsen) * 100 : 0;

    setAbsenBulanIni({
      persentaseKehadiran: persentaseKehadiran.toFixed(2),
    });
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setIsLoggedIn(true);
        // Lanjutkan dengan mengambil data
        fetchSettings();
        fetchUsers();
        fetchAbsens();
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <div className="container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
        <Skeleton height={40} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">
          <Alert.Heading>Anda belum login</Alert.Heading>
          <p>
            Silakan login terlebih dahulu untuk mengakses dashboard.
          </p>
        </Alert>
      </div>
    );
  }

  return (
    <Fragment>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            {/* Page header */}
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-6">
                  <h2 className="mb-0" style={{ color: textColor }}>
                    Dashboard Admin
                  </h2>
                </div>
              </div>
            </div>
          </Col>

          {/* <!-- Card stats --> */}
          <div className="row py-5">
            <div className="col-xl-3 col-md-6">
              <div className="card card-stats">
                {/* <!-- Card body --> */}
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h5 className="card-title text-uppercase text-muted mb-0">
                        Total User Aktif
                      </h5>
                      <span className="h2 font-weight-bold mb-0">
                        {users.filter((user) => user.status === "Aktif").length}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 mb-0 text-sm">
                    <span className="text-nowrap">
                      <strong className="font-weight-bold">
                        {
                          users.filter((user) => user.status === "Non-Aktif")
                            .length
                        }
                      </strong>{" "}
                      User tidak aktif
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card card-stats">
                {/* <!-- Card body --> */}
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h5 className="card-title text-uppercase text-muted mb-0">
                        Hadir
                      </h5>
                      <span className="h2 font-weight-bold mb-0">
                        {absenHariIni.hadir}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 mb-0 text-sm">
                    <span className="text-nowrap">Hari Ini</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card card-stats">
                {/* <!-- Card body --> */}
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h5 className="card-title text-uppercase text-muted mb-0">
                        Tidak Hadir
                      </h5>
                      <span className="h2 font-weight-bold mb-0">
                        {absenHariIni.tidakHadir}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 mb-0 text-sm">
                    <span className="text-nowrap">Hari Ini</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card card-stats">
                {/* <!-- Card body --> */}
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h5 className="card-title text-uppercase text-muted mb-0">
                        Kehadiran
                      </h5>
                      <span className="h2 font-weight-bold mb-0">
                        {absenBulanIni.persentaseKehadiran}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 mb-0 text-sm">
                    <span className="text-nowrap">Bulan Ini</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Row>

        <div className="table-responsive">
          <div className="bg-white p-4 rounded">
            <h4>Total User : {users.length}</h4>
          </div>

          {/* Tabel untuk layar besar */}
          <div className="d-none d-md-block">
            <table className="table align-items-center table-flush mb-0">
              <thead className="thead-light">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role.nama_role}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu untuk layar kecil */}
          <div className="d-block d-md-none">
            <div className="d-flex flex-wrap">
              {currentUsers.map((user, index) => (
                <Card key={index} className="m-2" style={{ width: "18rem" }}>
                  <Card.Body>
                    <Card.Title>User {indexOfFirstUser + index + 1}</Card.Title>
                    <Card.Text>
                      <strong>Nama:</strong> {user.name}
                      <br />
                      <strong>Role:</strong> {user.role.nama_role}
                      <br />
                      <strong>Status:</strong> {user.status}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center my-4">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>

        <Row className="my-6">
          <Col xl={6} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            {/* Teams  */}
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default HomePage;