"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Card, Table, Dropdown, Image } from "react-bootstrap";
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
  const [user, setUser] = useState(null);
  const [user2, setUser2] = useState([]);
  const [usersByRole, setUsersByRole] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersByRole.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/authentication/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/users");
      console.log(response.data);
      setUser2(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
  
  },[]);

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
      <div className="bg-primary pt-10 pb-21"></div>
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
                      <span class="h2 font-weight-bold mb-0">100</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                        <i class="ni ni-active-40"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-success mr-2">
                      <i class="fa fa-arrow-up"></i> 100%
                    </span>
                    <span class="text-nowrap"> Bulan Ini </span>
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
                        Hadir
                      </h5>
                      <span class="h2 font-weight-bold mb-0">95</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                        <i class="ni ni-chart-pie-35"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-danger mr-2">
                      <i class="fa fa-arrow-down"></i> 5%
                    </span>
                    <span class="text-nowrap"> Bulan Ini </span>
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
                      <span class="h2 font-weight-bold mb-0">5</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                        <i class="ni ni-money-coins"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-danger mr-2">
                      <i class="fa fa-arrow-up"></i> 5%
                    </span>
                    <span class="text-nowrap"> Bulan Ini</span>
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
                      <span class="h2 font-weight-bold mb-0">95%</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                        <i class="ni ni-chart-bar-32"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-sm">
                    <span class="text-danger mr-2">
                      <i class="fa fa-arrow-down"></i> 5%
                    </span>
                    <span class="text-nowrap"> Bulan Ini</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Row>

        <div class="table-responsive">
          <div className="bg-white p-4">
            <h4 className="mb-0">Total User</h4>
          </div>
          <table class="table align-items-center table-flush">
            <thead class="thead-light">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
            {user2.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Row className="my-6">
          <Col xl={6} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            {/* Teams  */}
            <Teams />
          </Col>
          {/* card  */}
          <Col xl={6} lg={12} md={12} xs={12}>
            {/* Teams  */}
            <Teams />
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default HomePage;
