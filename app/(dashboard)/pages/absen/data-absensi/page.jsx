"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import node module libraries
import { Fragment } from "react";
import { Container, Col, Row, Pagination } from "react-bootstrap";
import { format } from "date-fns"; // import date-fns

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

const DataAbsen = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Untuk mengganti warna dari database
  const [warna, setWarna] = useState({});
  const [textColor, setTextColor] = useState("#FFFFFF");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("http://localhost:5001/settings/1");
        setWarna(response.data);

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

    fetchSettings();
  }, []);

  // Cek data pengguna dari localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      // Jika tidak ada data pengguna, arahkan ke halaman login
      window.location.href = "http://localhost:3000/authentication/login";
    } else {
      const parsedUserData = JSON.parse(userData);

      // Periksa nilai nama_role
      if (
        parsedUserData.nama_role !== "Admin" &&
        parsedUserData.nama_role !== "Manager" &&
        parsedUserData.nama_role !== "Karyawan"
      ) {
        // Jika nama_role tidak sesuai, arahkan ke halaman geolocation
        window.location.href =
          "http://localhost:3000/dashboard_rumah/geolocation";
      } else {
        setUser(parsedUserData);
        console.log(parsedUserData);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAbsens = async () => {
      try {
        const response = await axios.get("http://localhost:5001/absens");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching absens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbsens();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const matchesName =
      item.user &&
      item.user.name &&
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "" ||
      (item.user.role && item.user.role.nama_role === selectedRole);

    const matchesDate =
      searchDate === "" ||
      format(new Date(item.tanggal), "yyyy-MM-dd") === searchDate;

    return matchesName && matchesRole && matchesDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (!user) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 dark:text-white max-w-md mx-auto rounded-lg shadow-md overflow-hidden md:max-w-2xl p-4">
        <Skeleton height={40} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
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
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0" style={{ color: textColor }}>
                    Data Absensi
                  </h3>
                </div>
              </div>
            </div>
          </Col>

          <div className="card container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
            {/* Search and Filter Inputs */}
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                placeholder="Cari Nama"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control w-25"
              />
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="form-control w-25 ml-3"
              >
                <option value="">Semua Role</option>
                <option value="Manager">Manager</option>
                <option value="Karyawan">Karyawan</option>
                <option value="Magang">Magang</option>
                <option value="Pkl">Pkl</option>
              </select>
              <input
                type="date"
                value={searchDate}
                onChange={handleDateChange}
                className="form-control w-25 ml-3"
              />
            </div>

            {/* Table Data Absensi */}
            <div className="table-responsive">
              <table className="table align-items-center table-flush">
                <thead className="thead-light">
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Role</th>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Keterangan</th>
                    <th>Keterangan tidak berangkat</th>
                    <th>Alasan tidak berangkat</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">
                        <Skeleton count={5} />
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item, index) => (
                      <tr key={item.id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td className="table-user">
                          <b>{item.user.name || "Tidak ada data"}</b>
                        </td>
                        <td>
                          <span className="text-muted">
                            {item.user.role.nama_role || "Tidak ada data"}
                          </span>
                        </td>
                        <td style={{ whiteSpace: "normal", width: "150px" }}>
                          {item.tanggal || "Tidak ada data"}
                        </td>
                        <td>{item.waktu_datang || "Tidak ada data"}</td>
                        <td>{item.keterangan || "Tidak ada data"}</td>
                        <td>
                          <img
                            src={item.url_foto}
                            alt="Tidak ada foto"
                            style={{ width: "200px", height: "130px" }}
                          />
                        </td>
                        <td>{item.alasan || "Tidak ada data"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <Pagination.Item
                    key={pageIndex + 1}
                    active={pageIndex + 1 === currentPage}
                    onClick={() => handlePageChange(pageIndex + 1)}
                  >
                    {pageIndex + 1}
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
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

export default DataAbsen;
