"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import {
  Navbar,
  Nav,
} from "react-bootstrap";
import "react-loading-skeleton/dist/skeleton.css";
import { Container } from "react-bootstrap";
import { API_Frontend } from "../api/hello.js";

const DashboardUser = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = `${API_Frontend}/authentication/login`;
    } else {
      setUser(JSON.parse(userData));
      // Redirect to absen hadir page on loading dashboard user
      window.location.href = "/dashboard-user/absen";
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
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="justify-content-between"
    >
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/dashboard-user/absen">Absen Hadir</Nav.Link>
            <Nav.Link href="/dashboard-user/absen/absen-pulang">
              Absen Pulang
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DashboardUser;
