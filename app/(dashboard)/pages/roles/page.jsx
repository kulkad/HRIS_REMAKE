"use client";

import React, { useState, useEffect, Fragment } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import {
  Container,
  Col,
  Row,
  Form,
  Table,
  Pagination,
  Dropdown,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import { FaEllipsisVertical } from "react-icons/fa6";
import Swal from "sweetalert2";
import { API_Frontend, API_Backend } from "../../../api/hello.js";

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

const Roles = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [roleId, setRoleId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [nama_role, setNama_role] = useState("");
  const [jam_pulang, setJam_pulang] = useState("");
  const [denda, setDenda] = useState("");

  // Untuk mengganti warna dari database
  const [warna, setWarna] = useState({});
  const [loading, setLoading] = useState({});
  const [textColor, setTextColor] = useState("#FFFFFF");

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_Backend}/settings/1`);
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

  const [searchQuery, setSearchQuery] = useState("");

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_Backend}/roles`);
      setRoles(response.data);

      // Filter dan urutkan data setelah diambil
      const filtered = response.data
        .filter((role) =>
          role.nama_role.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) =>
          a.nama_role.toLowerCase().localeCompare(b.nama_role.toLowerCase())
        );

      setFilteredUsers(filtered);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = `${API_Frontend}/authentication/login`;
    } else {
      setUser(JSON.parse(userData));
    }
    fetchRoles();
    fetchSettings();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);

    // Update filteredUsers saat searchQuery berubah
    const filtered = roles
      .filter((role) =>
        role.nama_role.toLowerCase().includes(e.target.value.toLowerCase())
      )
      .sort((a, b) =>
        a.nama_role.toLowerCase().localeCompare(b.nama_role.toLowerCase())
      );

    setFilteredUsers(filtered);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNama_role("");
    setJam_pulang("");
    setDenda("");
  };

  const openEditModal = (role) => {
    setNama_role(role.nama_role);
    setJam_pulang(role.jam_pulang.substring(0, 8));
    setDenda(role.denda_telat);
    setRoleId(role.id);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setNama_role("");
    setJam_pulang("");
    setDenda("");
    setRoleId(null);
  };

  const saveData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_role", nama_role);
    formData.append("jam_pulang", jam_pulang);
    formData.append("denda_telat", denda);

    try {
      const response = await axios.post(
        `${API_Backend}/roles`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const newRole = response.data;

      // Tambahkan role baru ke dalam state `roles` dan `filteredUsers`
      const updatedRoles = [...roles, newRole];

      // Urutkan ulang data berdasarkan nama_role secara alfabetis
      const sortedRoles = updatedRoles.sort((a, b) => {
        const nameA = a.nama_role ? a.nama_role.toLowerCase() : ""; // Cek apakah a.nama_role ada
        const nameB = b.nama_role ? b.nama_role.toLowerCase() : ""; // Cek apakah b.nama_role ada
        return nameA.localeCompare(nameB);
      });

      // Update state dengan data yang telah diurutkan
      setRoles(sortedRoles);
      setFilteredUsers(sortedRoles);

      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil menambahkan!",
        icon: "success",
      });

      closeCreateModal();
      fetchRoles();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const updateData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_role", nama_role);
    formData.append("jam_pulang", jam_pulang);
    formData.append("denda_telat", denda);

    try {
      await axios.patch(`${API_Backend}/roles/${roleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedRoles = roles.map((role) =>
        role.id === roleId
          ? { ...role, nama_role, jam_pulang, denda_telat: denda }
          : role
      );

      // Urutkan ulang data setelah mengedit data, dengan pengecekan nama_role
      const sortedRoles = updatedRoles.sort((a, b) => {
        const nameA = a.nama_role ? a.nama_role.toLowerCase() : "";
        const nameB = b.nama_role ? b.nama_role.toLowerCase() : "";
        return nameA.localeCompare(nameB);
      });

      setRoles(sortedRoles);
      setFilteredUsers(sortedRoles);

      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil mengupdate!",
        icon: "success",
      });
      closeEditModal();
    } catch (error) {
      console.log(error);
    }
  };

  if (!user || loading) {
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
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const confirmDelete = async (id) => {
    Swal.fire({
      title: "Apakah kamu yakin ingin menghapus ?",
      text: "Role yang dihapus tidak akan bisa dikembalikan !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Lanjutkan !",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_Backend}/roles/${id}`);
          setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
          setFilteredUsers((prevUsers) =>
            prevUsers.filter((role) => role.id !== id)
          ); // Update filteredUsers
          Swal.fire({
            title: "Deleted!",
            text: "Role berhasil dihapus!.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting role:", error.message);
        }
      }
    });
  };

  return (
    <Fragment>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center mx-5">
              <div className="mb-2 mb-lg-0">
                <h3 className="mb-0" style={{ color: textColor }}>
                  Role
                </h3>
              </div>
              <div>
                <Button onClick={openCreateModal} className="btn btn-white">
                  Tambah Role
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={12} md={12} xs={12}>
            <div className="bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
              <input
                type="text"
                placeholder="Cari Role"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control w-50"
              />{" "}
              <br />
              {filteredUsers.length === 0 ? (
                <p className="text-center py-4">Tidak ada data</p>
              ) : (
                <div className="d-none d-lg-block table-responsive">
                  <Table hover className="table text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Nama role</th>
                        <th>Jam pulang</th>
                        <th>Denda</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((role) => (
                        <tr key={role.id}>
                          <td>{role.nama_role}</td>
                          <td>{role.jam_pulang}</td>
                          <td>{role.denda_telat}</td>
                          <td className="d-flex justify-content-center">
                            <Button
                              variant="warning"
                              onClick={() => openEditModal(role)}
                              className="d-flex align-items-center justify-content-center me-2"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => confirmDelete(role.id)}
                              className="d-flex align-items-center justify-content-center"
                            >
                              <TrashFill className="me-2" /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {roles.length > 0 && (
                <div className="d-lg-none">
                  {roles.map((role) => (
                    <Card key={role.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Card.Title>{role.nama_role}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {role.jam_pulang}
                            </Card.Subtitle>
                            <Card.Text>{role.denda}</Card.Text>
                          </div>
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              variant="link"
                              id={`dropdown-custom-components-${role.id}`}
                              className="p-0 bg-transparent border-0"
                            >
                              <FaEllipsisVertical />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => confirmDelete(role.id)}
                              >
                                <TrashFill className="me-2" /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
              <Pagination className="d-flex justify-content-center mt-4 flex-wrap">
                {Array.from({
                  length: Math.ceil(filteredUsers.length / usersPerPage),
                }).map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showCreateModal} onHide={closeCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveData}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Role</Form.Label>
              <Form.Control
                type="text"
                value={nama_role}
                onChange={(e) => setNama_role(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jam Pulang</Form.Label>
              <Form.Control
                type="time"
                step="1"
                value={jam_pulang}
                onChange={(e) => setJam_pulang(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Denda</Form.Label>
              <Form.Control
                type="text"
                value={denda}
                onChange={(e) => setDenda(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateData}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Role</Form.Label>
              <Form.Control
                type="text"
                value={nama_role}
                onChange={(e) => setNama_role(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jam Pulang</Form.Label>
              <Form.Control
                type="time"
                step="1"
                value={jam_pulang}
                onChange={(e) => setJam_pulang(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Denda</Form.Label>
              <Form.Control
                type="text"
                value={denda}
                onChange={(e) => setDenda(e.target.value)}
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

export default Roles;