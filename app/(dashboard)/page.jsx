"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import node module libraries
import { Fragment } from "react";
import Link from "next/link";
import { Container, Col, Row } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/authentication/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
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
      <div className="bg-primary pt-12 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <div class="header pb-6">
            {/* Card stats */}
            <div class="row">
              <div class="col-xl-3 col-md-6">
                <div class="card card-stats">
                  {/* Card body */}
                  <div class="card-body">
                    <div class="row">
                      <div class="col">
                        <h5 class="card-title text-uppercase text-muted mb-0">
                          Total User
                        </h5>
                        <span class="h2 font-weight-bold mb-0">350,897</span>
                      </div>
                      <div class="col-auto">
                        <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                          <i class="ni ni-active-40"></i>
                        </div>
                      </div>
                    </div>
                    <p class="mt-3 mb-0 text-sm">
                      <span class="text-success mr-2">
                        <i class="fa fa-arrow-up"></i> 3.48%
                      </span>
                      <span class="text-nowrap">Since last month</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-md-6">
                <div class="card card-stats">
                  {/* Card body */}
                  <div class="card-body">
                    <div class="row">
                      <div class="col">
                        <h5 class="card-title text-uppercase text-muted mb-0">
                          Hadir
                        </h5>
                        <span class="h2 font-weight-bold mb-0">2,356</span>
                      </div>
                      <div class="col-auto">
                        <div class="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                          <i class="ni ni-chart-pie-35"></i>
                        </div>
                      </div>
                    </div>
                    <p class="mt-3 mb-0 text-sm">
                      <span class="text-success mr-2">
                        <i class="fa fa-arrow-up"></i> 3.48%
                      </span>
                      <span class="text-nowrap">Since last month</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-md-6">
                <div class="card card-stats">
                  {/* Card body */}
                  <div class="card-body">
                    <div class="row">
                      <div class="col">
                        <h5 class="card-title text-uppercase text-muted mb-0">
                          Tidak Hadir
                        </h5>
                        <span class="h2 font-weight-bold mb-0">924</span>
                      </div>
                      <div class="col-auto">
                        <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                          <i class="ni ni-money-coins"></i>
                        </div>
                      </div>
                    </div>
                    <p class="mt-3 mb-0 text-sm">
                      <span class="text-success mr-2">
                        <i class="fa fa-arrow-up"></i> 3.48%
                      </span>
                      <span class="text-nowrap">Since last month</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-md-6">
                <div class="card card-stats">
                  {/* Card body */}
                  <div class="card-body">
                    <div class="row">
                      <div class="col">
                        <h5 class="card-title text-uppercase text-muted mb-0">
                          Ketepatan
                        </h5>
                        <span class="h2 font-weight-bold mb-0">49,65%</span>
                      </div>
                      <div class="col-auto">
                        <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i class="ni ni-chart-bar-32"></i>
                        </div>
                      </div>
                    </div>
                    <p class="mt-3 mb-0 text-sm">
                      <span class="text-success mr-2">
                        <i class="fa fa-arrow-up"></i> 3.48%
                      </span>
                      <span class="text-nowrap">Since last month</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}

          <div className="container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
            <div className="p-4">
              <h1 className="h4 fw-bold">Selamat Datang, {user.name}</h1>
              <hr className="my-4" />

              <div className="d-flex flex-column flex-md-row align-items-center bg-light border rounded shadow-sm p-4 mb-4">
                <img
                  className="img-fluid rounded mb-3 mb-md-0 me-md-4"
                  src="/assets/images/windah.jpg"
                  alt="User"
                  style={{ width: "150px", height: "auto" }}
                />
                <div className="flex-grow-1">
                  <h5 className="h5 fw-bold text-dark">{user.name}</h5>
                  <p className="text-muted mb-1">Jam Masuk :</p>
                  <p className="text-muted mb-1">Jam Pulang :</p>
                  <p className="text-muted mb-1">Estimasi Denda :</p>
                  <a href="geolocation">
                    <button type="button" className="btn btn-danger mt-3">
                      Total Denda Keterlambatan
                    </button>
                  </a>
                </div>
              </div>

              <hr className="my-4" />
              <div className="d-grid gap-2 d-md-block">
                <a
                  href="pages/absen/geolocation"
                  className="btn btn-danger me-2 mb-2"
                >
                  Geolocation
                </a>
                <a
                  href="pages/absen/"
                  className="btn btn-success me-2 mb-2"
                >
                  Absen Hari Ini
                </a>
                <a
                  href="pages/absen/absen-pulang"
                  className="btn btn-info text-light me-2 mb-2"
                >
                  Absen Pulang
                </a>
              </div>
            </div>
          </div>
        </Row>
      </Container>
           
    </Fragment>
  );
};

export default HomePage;
