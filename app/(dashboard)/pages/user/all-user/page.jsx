"use client";

import React, { useState, useEffect, Fragment } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import axios from "axios";
import { Container, Col, Row, Modal, Button, Form, Table, Pagination, DropdownButton, Dropdown, Card } from "react-bootstrap";
import { EmojiSmile, PersonVcard, TrashFill } from "react-bootstrap-icons";
import { FaEllipsisVertical } from "react-icons/fa6";

const Users = () => {
  const [user, setUser] = useState(null);
  const [usersByRole, setUsersByRole] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [role, setRole] = useState("Manager");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");

  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`http://localhost:5001/users/${userToDelete}`);
        const response = await axios.get(`http://localhost:5001/userbyrole/${role}`, {
          withCredentials: true,
        });
        setUsersByRole(response.data);
        setSuccessMessage("User berhasil dihapus.");
      } catch (error) {
        console.error("Error deleting user:", error.message);
      }
      closeDeleteModal();
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfPassword("");
    setFile("");
    setPreview("");
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const saveData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("password", password);
    formData.append("confPassword", confPassword);

    if (password !== confPassword) {
      alert("Password dan Konfirmasi Password Tidak Cocok");
      return;
    }

    try {
      await axios.post("http://localhost:5001/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Berhasil Tambah Data");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchUsersByRole = async () => {
      try {
        const endpoint = role === "All" ? "http://localhost:5001/users" : `http://localhost:5001/userbyrole/${role}`;
        const response = await axios.get(endpoint, {
          withCredentials: true,
        });
        setUsersByRole(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsersByRole();
  }, [role]);

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
  const currentUsers = usersByRole.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center mx-5">
              <div className="mb-2 mb-lg-0">
                <h3 className="mb-0 text-white">Data Pengguna</h3>
              </div>
              <div>
                <Button onClick={openCreateModal} className="btn btn-white">
                  Tambah Data
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={12} md={12} xs={12}>
            <Form className="d-flex justify-content-end my-3">
              <DropdownButton
                id="dropdown-role-selector"
                title={role === "All" ? "Semua" : role}
                onSelect={(e) => setRole(e)}
              >
                <Dropdown.Item eventKey="All">Semua</Dropdown.Item>
                <Dropdown.Item eventKey="Manager">Manager</Dropdown.Item>
                <Dropdown.Item eventKey="Karyawan">Karyawan</Dropdown.Item>
                <Dropdown.Item eventKey="Magang">Magang</Dropdown.Item>
                <Dropdown.Item eventKey="Pkl">Pkl</Dropdown.Item>
              </DropdownButton>
            </Form>
            <div className="bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
              {usersByRole.length === 0 ? (
                <p className="text-center py-4">Tidak ada data</p>
              ) : (
                <div className="d-none d-lg-block table-responsive">
                  <Table hover className="table text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td className="d-flex justify-content-center">
                            <Link
                              href={`/pages/user/detailuser/${user.id}`}
                              className="btn btn-info me-2">
                              <p className="text-white font-white">
                                <PersonVcard /> Detail
                              </p>
                            </Link>
                            {role !== "All" && (
                              <Link
                                href={`/pages/user/register/${user.id}?role=${user.role}`}
                                className="btn btn-primary me-2"
                              >
                                {user.url_foto_absen == null ? (
                                  <>
                                    <EmojiSmile /> Daftar Wajah
                                  </>
                                ) : (
                                  <span>Wajah Sudah Terdaftar</span>
                                )}
                              </Link>
                            )}
                            <Button
                              variant="danger"
                              onClick={() => openDeleteModal(user.id)}
                            >
                              <TrashFill /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {usersByRole.length > 0 && (
                <div className="d-lg-none">
                  {currentUsers.map((user) => (
                    <Card key={user.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Card.Title>{user.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
                            <Card.Text>
                              Role: {user.role}
                            </Card.Text>
                          </div>
                          <Dropdown align="end">
                            <Dropdown.Toggle 
                              variant="link" 
                              id={`dropdown-custom-components-${user.id}`} 
                              className="p-0 bg-transparent border-0"
                            >
                              <FaEllipsisVertical />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item href={`/pages/user/detailuser/${user.id}`}>
                                <PersonVcard className="text-white" /> Detail
                              </Dropdown.Item>
                              {role !== "All" && (
                                <Dropdown.Item href={`/pages/user/register/${user.id}?role=${user.role}`}>
                                  {user.url_foto_absen == null ? (
                                    <>
                                      <EmojiSmile /> Daftar Muka
                                    </>
                                  ) : (
                                    <span>Muka Sudah Terdaftar</span>
                                  )}
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item onClick={() => openDeleteModal(user.id)}>
                                <TrashFill /> Delete
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
                  length: Math.ceil(usersByRole.length / usersPerPage),
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
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>Anda yakin ingin menghapus user ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showCreateModal} onHide={closeCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveData}>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Konfirmasi Password</Form.Label>
              <Form.Control
                type="password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto</Form.Label>
              <Form.Control type="file" onChange={loadImage} />
              {preview && (
                <img src={preview} alt="Preview" className="img-thumbnail mt-3" />
              )}
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