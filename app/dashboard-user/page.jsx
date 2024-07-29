"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import {
  Card,
  Table,
  Dropdown,
  Image,
  Navbar,
  Nav,
  Button,
} from "react-bootstrap";
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

const DashboardUser = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/authentication/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // Geolocation obtained successfully
        },
        (error) => {
          console.error("Error obtaining geolocation: ", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleCheckIn = () => {
    // Implement check-in logic here
    alert("Checked in successfully!");
  };

  const handleCheckOut = () => {
    // Implement check-out logic here
    alert("Checked out successfully!");
  };

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
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/dashboard-user/absen/geolocation">
                Geolocation
              </Nav.Link>
              <Nav.Link href="/dashboard-user/absen">Absen Hadir</Nav.Link>
              <Nav.Link href="/dashboard-user/absen/absen-pulang">
                Absen Pulang
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            {/* Page header */}
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0 text-white">Dashboard</h3>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {location && (
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Geolocation</Card.Title>
                  <Card.Text>Latitude: {location.latitude}</Card.Text>
                  <Card.Text>Longitude: {location.longitude}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </Fragment>
  );
};

export default DashboardUser;
