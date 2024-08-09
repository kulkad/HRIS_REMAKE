"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiSolidUserDetail } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
// import node module libraries
import { Fragment } from "react";
import { Container, Col, Row, Form, Pagination } from "react-bootstrap";
import { format } from "date-fns"; // import date-fns

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

      useEffect(() => {
          const fetchSettings = async () => {
              try {
                  const response = await axios.get("http://localhost:5001/settings/1");
                  setWarna(response.data);
              } catch (error) {
                  console.error("Error fetching Settings:", error);
              } finally {
                  setLoading(false);
              }
          };
          fetchSettings();
      }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchAbsens = async () => {
      try {
        const response = await axios.get("http://localhost:5001/absens");
        setData(response.data);
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
    const matchesName = item.user && item.user.name && item.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "" || item.user.role === selectedRole;
    const matchesDate = searchDate === "" || format(new Date(item.tanggal), 'yyyy-MM-dd') === searchDate;
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
      <div className="pt-10 pb-21" style={{ backgroundColor: warna.warna_secondary}}></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            {/* Page header */}
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0 text-white">Data Absensi</h3>
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
                          <b>{item.user.name}</b>
                        </td>
                        <td>
                          <span className="text-muted">{item.user.role.nama_role}</span>
                        </td>
                        <td>{item.tanggal}</td>
                        <td>{item.waktu_datang}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <Pagination.Item
                    key={pageIndex + 1}
                    active={pageIndex + 1 === currentPage}
                    onClick={() => handlePageChange(pageIndex + 1)}
                  >
                    {pageIndex + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

export default DataAbsen;