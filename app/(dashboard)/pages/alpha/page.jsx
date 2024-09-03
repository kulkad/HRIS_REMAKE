"use client";

import React, { useState, useEffect, Fragment } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import axios from "axios";
import {
  Container,
  Col,
  Row,
  Form,
  Table,
  DropdownButton,
  Dropdown,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import { EmojiSmile, TrashFill } from "react-bootstrap-icons";
import { FaEllipsisVertical } from "react-icons/fa6";
import Swal from "sweetalert2";

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

const Users = () => {
  const [user, setUser] = useState(null);
  const [alpha, setAlpha] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [jam_alpha, setjam_alpha] = useState("");

   // Untuk mengganti warna dari database
  const [warna, setWarna] = useState({});
  const [loading, setLoading] = useState({});
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

  const openEditModal = (alpha) => {
    setjam_alpha(alpha.jam_alpha);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setjam_alpha("");
  };

  const updateData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("jam_alpha", jam_alpha);

    try {
      const response = await axios.patch(`http://localhost:5001/alpha/1`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Perbarui state alpha dengan data yang baru
      setAlpha(prevAlpha => prevAlpha.map(item => 
        item.id === 1 ? {...item, jam_alpha: jam_alpha} : item
      ));

      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil mengupdate!",
        icon: "success",
      });
      
      closeEditModal();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Gagal mengupdate data.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/authentication/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchJam_Alpha = async () => {
      try {
        const response = await axios.get("http://localhost:5001/alpha", {
          withCredentials: true,
        });
        setAlpha(response.data);
      } catch (error) {
        console.error("Error fetching alpha:", error.message);
        Swal.fire({
          title: "Error!",
          text: `Error fetching alpha: ${error.message}`,
          icon: "error",
        });
      }
    };

    fetchJam_Alpha();
  }, []);

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = alpha.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center mx-5">
              <div className="mb-2 mb-lg-0">
                <h3 className="mb-0" style={{ color: textColor }}>Alpha</h3>
              </div>
            </div>
          </Col>
          <Col lg={12} md={12} xs={12}>
            <div className="bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
              {alpha.length === 0 ? (
                <p className="text-center py-4">Tidak ada data</p>
              ) : (
                <div className="d-none d-lg-block table-responsive">
                  <Table hover className="table text-center">
                    <thead className="table-light">
                      <tr>  
                        <th>Jam Alpha</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((alpha) => (
                        <tr key={alpha.id}>
                          <td>{alpha.jam_alpha}</td>
                          <td className="d-flex justify-content-center">
                            <Button
                              variant="warning"
                              onClick={() => openEditModal(alpha)}
                              className="d-flex align-items-center justify-content-center me-2"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {alpha.length > 0 && (
                <div className="d-lg-none">
                  {alpha.map((alpha) => (
                    <Card key={alpha.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Card.Title>{alpha.jam_alpha}</Card.Title>
                          </div>
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              variant="link"
                              id={`dropdown-custom-components-${alpha.id}`}
                              className="p-0 bg-transparent border-0"
                            >
                              <FaEllipsisVertical />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => openEditModal(alpha)}
                              >
                                Edit
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Jam Alpha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateData}>
            <Form.Group className="mb-3">
              <Form.Label>Jam Alpha</Form.Label>
              <Form.Control
                type="time"
                step="1"
                value={jam_alpha}
                onChange={(e) => setjam_alpha(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default Users;
