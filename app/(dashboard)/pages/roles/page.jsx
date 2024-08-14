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
  Pagination,
  DropdownButton,
  Dropdown,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import { EmojiSmile, TrashFill } from "react-bootstrap-icons";
import { FaEllipsisVertical } from "react-icons/fa6";
import Swal from "sweetalert2";

const Roles = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [role, setRole] = useState("All");
  const [roleId, setRoleId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [nama_role, setNama_role] = useState("");
  const [jam_pulang, setJam_pulang] = useState("");
  const [denda, setDenda] = useState("");
  
  const [data, setData] = useState({});
  const [loading, setLoading] = useState("");

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

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
    setJam_pulang(role.jam_pulang);
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
      const response = await axios.post("http://localhost:5001/roles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setRoles(prevRoles => [...prevRoles, response.data]);
      setFilteredUsers(prevUsers => [...prevUsers, response.data]); // Update filteredUsers
      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil menambahkan!",
        icon: "success",
      });
      closeCreateModal();
      fetchRoles();
    } catch (error) {
      console.log(error);
    }
  };
  
  const updateData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_role", nama_role);
    formData.append("jam_pulang", jam_pulang);
    formData.append("denda_telat", denda);
  
    try {
      await axios.patch(`http://localhost:5001/roles/${roleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setRoles(prevRoles => prevRoles.map(role =>
        role.id === roleId ? { ...role, nama_role, jam_pulang, denda_telat: denda } : role
      ));
      setFilteredUsers(prevUsers => prevUsers.map(role =>
        role.id === roleId ? { ...role, nama_role, jam_pulang, denda_telat: denda } : role
      )); // Update filteredUsers
      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil mengupdate!",
        icon: "success",
      });
      closeEditModal();
      fetchRoles();
    } catch (error) {
      console.log(error);
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

    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5001/roles", {
          withCredentials: true,
        });
        setRoles(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        Swal.fire({
          title: "Error!",
          text: `Error fetching users: ${error.message}`,
          icon: "error",
        });
      }
    };

    useEffect(() => {
      fetchRoles();
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
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const confirmDelete = async (id) => {
    Swal.fire({
      title: "Apakah kamu yakin ingin menghapus ?",
      text: "User yang dihapus tidak akan bisa dikembalikan !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Lanjutkan !",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/roles/${id}`);
          setRoles(prevRoles => prevRoles.filter(role => role.id !== id));
          setFilteredUsers(prevUsers => prevUsers.filter(role => role.id !== id)); // Update filteredUsers
          Swal.fire({
            title: "Deleted!",
            text: "User telah berhasil dihapus!.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting user:", error.message);
        }
      }
    });
  };

  return (
    <Fragment>
      <div className="pt-10 pb-21" style={{ backgroundColor: data.warna_secondary}}></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center mx-5">
              <div className="mb-2 mb-lg-0">
                <h3 className="mb-0 text-white">Role</h3>
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
              {roles.length === 0 ? (
                <p className="text-center py-4">Tidak ada data</p>
              ) : (
                <div className="d-none d-lg-block table-responsive">
                  <Table hover className="table text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Nama role </th>
                        <th>Jam pulang </th>
                        <th>Denda </th>
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

              <Pagination className="d-flex justify-content-center mt-4">
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
