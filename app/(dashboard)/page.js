"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login";
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
              <button
                type="button"
                className="btn btn-danger mt-3"
              >
                Total Denda Keterlambatan
              </button>
            </a>
          </div>
        </div>

        <hr className="my-4" />
        <div className="d-grid gap-2 d-md-block">
          <a href="geolocation" className="btn btn-danger me-2 mb-2">
            Geolocation
          </a>
          <a href="halaman-absen" className="btn btn-success me-2 mb-2">
            Absen Hari Ini
          </a>
          <a href="absen-pulang" className="btn btn-info me-2 mb-2">
            Absen Pulang
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
