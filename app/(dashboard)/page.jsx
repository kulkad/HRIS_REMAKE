"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Card, Table, Dropdown, Image, Pagination } from "react-bootstrap";
import "react-loading-skeleton/dist/skeleton.css";
// import node module libraries
import { Fragment } from "react";
import Link from "next/link";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // State to store all users
  const [absens, setAbsens] = useState([]); // State to store all absens
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [absenHariIni, setAbsenHariIni] = useState({
    hadir: 0,
    tidakHadir: 0,
    persentaseKehadiran: 0
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  // Untuk mengganti warna dari database
  const [data, setData] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get("http://localhost:5001/settings/1");
                setData(response.data);
            } catch (error) {
                console.error("Error fetching Settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/users");
      setUsers(response.data); // Update state with fetched users
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchAbsens = async () => {
    try {
      const response = await axios.get("http://localhost:5001/absens");
      setAbsens(response.data); // Update state with fetched absens
      hitungAbsenHariIni(response.data);
    } catch (error) {
      console.error("Error fetching absens:", error);
    } finally {
      setLoading(false);
    }
  };

  const hitungAbsenHariIni = (dataAbsen) => {
    const today = new Date().toISOString().split('T')[0];
    const absenHariIni = dataAbsen.filter(absen => absen.tanggal === today);
    
    const hadir = absenHariIni.filter(absen => absen.keterangan === 'Hadir').length;
    const tidakHadir = absenHariIni.filter(absen => 
      ['Alpha', 'Sakit', 'Izin'].includes(absen.keterangan)).length;
    const totalAbsen = absenHariIni.length;
    
    const persentaseKehadiran = totalAbsen > 0 ? (hadir / totalAbsen) * 100 : 0;

    setAbsenHariIni({
      hadir,
      tidakHadir,
      persentaseKehadiran: persentaseKehadiran.toFixed(2)
    });
  };

  useEffect(() => {
    fetchAbsens();
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

  return (
    <Fragment>
      <div className="pt-10 pb-21" style={{ backgroundColor: data.warna_secondary }}></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            {/* Page header */}
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-6">
                  <h2 className="mb-0  text-white">Dashboard Admin</h2>
                </div>
              </div>
            </div>
          </Col>

          {/* <!-- Card stats --> */}
          <div class="row py-5">
            <div class="col-xl-3 col-md-6">
              <div class="card card-stats">
                {/* <!-- Card body --> */}
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">
                        Total User
                      </h5>
                      <span class="h2 font-weight-bold mb-0">
                        {users.length}
                      </span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                        <i class="ni ni-active-40"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="card card-stats">
                {/* <!-- Card body --> */}
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">
                        Hadir
                      </h5>
                      <span class="h2 font-weight-bold mb-0">
                        {absenHariIni.hadir}
                      </span>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-nowrap">Hari Ini</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="card card-stats">
                {/* <!-- Card body --> */}
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">
                        Tidak Hadir
                      </h5>
                      <span class="h2 font-weight-bold mb-0">{absenHariIni.tidakHadir}</span>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-nowrap">Hari Ini</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="card card-stats">
                {/* <!-- Card body --> */}
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">
                        Kehadiran
                      </h5>
                      <span class="h2 font-weight-bold mb-0">{absenHariIni.persentaseKehadiran}%</span>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-nowrap">Hari Ini</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Row>

        <div class="table-responsive">
          <div className="bg-white p-4 rounded">
            <h4>Total User : {users.length}</h4>
          </div>

          {/* Tabel untuk layar besar */}
          <div className="d-none d-md-block">
            <table class="table align-items-center table-flush mb-0">
              <thead class="thead-light">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role.nama_role}</td>
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
                      <strong>Email:</strong> {user.email}
                      <br />
                      <strong>Role:</strong> {user.role.nama_role}
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