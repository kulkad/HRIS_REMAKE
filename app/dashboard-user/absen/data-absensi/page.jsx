"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiSolidUserDetail } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
// import node module libraries

import { Fragment } from "react";
import { Container, Col, Row } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";

const DataAbsen = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const filteredData = data.filter((item) => {
    return (
      item.user &&
      item.user.name &&
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedRole === "" || item.user.role === selectedRole)
    );
  });

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
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            {/* Page header */}
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0  text-white">Data Absensi</h3>
                </div>
              </div>
            </div>
          </Col>
          
          <div className="card container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
            {/* Tabel Data Absensi */}
            <div class="table-responsive">
              <table class="table align-items-center table-flush">
                <thead class="thead-light">
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Role</th>
                    <th>Waktu</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span>1</span>
                    </td>
                    <td class="table-user">
                      <b>John Michael</b>
                    </td>
                    <td>
                      <span class="text-muted">PKL</span>
                    </td>
                    <td>
                        08.00
                    </td>
                    <td class="table-actions">
                      <a
                        href="#!"
                        class="table-action"
                        data-toggle="tooltip"
                        data-original-title="Edit product"
                      >
                        <i class="fas fa-user-edit"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Row>
      </Container>
           
    </Fragment>
  );
};

export default DataAbsen;
