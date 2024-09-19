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
  Dropdown,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import { EmojiSmile, PersonVcard, TrashFill } from "react-bootstrap-icons";
import { FaEllipsisVertical } from "react-icons/fa6";
import Swal from "sweetalert2";
import { API_Frontend, API_Backend } from "../../../../api/hello.js";

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
  const [usersByRole, setUsersByRole] = useState([]); // Pastikan diinisialisasi sebagai array
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [role, setRole] = useState("All");
  const [roleId, setRoleId] = useState(null); // Tambahkan state untuk roleId
  const [roles, setRoles] = useState([]); // Tambahkan state untuk daftar peran
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Untuk mengganti warna dari database
  const [warna, setWarna] = useState({});
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = (e) => {
    const selectedRoleName = e.target.value;

    if (selectedRoleName === "") {
      setRole("All");
      setRoleId(null);
    } else {
      const selectedRoleId = roles.find(
        (role) => role.nama_role === selectedRoleName
      )?.id;
      setRole(selectedRoleName);
      setRoleId(selectedRoleId);
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
    setRoleId(null); // Reset roleId setelah modal ditutup
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
    formData.append("roleId", roleId);
    formData.append("password", password);
    formData.append("confPassword", confPassword);

    if (password !== confPassword) {
      Swal.fire({
        title: "Error!",
        text: "Password dan Konfirmasi Password Tidak Cocok",
        icon: "error",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${API_Backend}/users`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Menambahkan user baru ke state usersByRole dan filteredUsers
      const newUser = response.data;
      setUsersByRole((prevUsers) => [...prevUsers, newUser]);
      setFilteredUsers((prevUsers) => [...prevUsers, newUser]);

      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil menambahkan user baru!",
        icon: "success",
      });

      closeCreateModal();
      fetchUsersByRole();
      fetchRoles();
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire({
        title: "Error!",
        text: `Error creating user: ${error.message}`,
        icon: "error",
      });
    }
  };

  const fetchUsersByRole = async () => {
    try {
      const endpoint =
        role === "All"
          ? `${API_Backend}/users`
          : `${API_Backend}/userbyrole/${roleId}`; // Ganti dengan roleId
      const response = await axios.get(endpoint, {
        withCredentials: true,
      });
      setUsersByRole(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = `${API_Frontend}/authentication/login`;
    } else {
      setUser(JSON.parse(userData));
    }
    fetchSettings();
    fetchUsersByRole();
    fetchRoles();

    const filtered = usersByRole
      .filter((user) => {
        const matchesName = user?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesEmail = user?.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesRole = user?.role?.nama_role
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesStatus = user?.status
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()); // Tambahkan pencarian status

        return matchesName || matchesEmail || matchesRole || matchesStatus; // Filter berdasarkan nama, email, role, atau status
      })
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB); // Mengurutkan berdasarkan nama
      });
    setFilteredUsers(filtered);
  }, [role, roleId, searchQuery, usersByRole]); // Tambahkan roleId ke dependencies

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_Backend}/roles`, {
        withCredentials: true,
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
      Swal.fire({
        title: "Error!",
        text: `Error fetching roles: ${error.message}`,
        icon: "error",
      });
    }
  };

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

  const confirmDelete = async (userId) => {
    Swal.fire({
      title: "Apakah kamu yakin ingin menghapus?",
      text: "User yang dihapus tidak akan bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Lanjutkan!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_Backend}/users/${userId}`);

          // Hapus user dari state usersByRole
          const updatedUsers = usersByRole.filter((user) => user.id !== userId);
          setUsersByRole(updatedUsers);

          // Hapus user dari state filteredUsers juga
          const updatedFilteredUsers = filteredUsers.filter(
            (user) => user.id !== userId
          );
          setFilteredUsers(updatedFilteredUsers);
          fetchUsersByRole();
          fetchRoles();

          Swal.fire({
            title: "Deleted!",
            text: "User telah berhasil dihapus!.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting user:", error.message);
          Swal.fire({
            title: "Error!",
            text: `Error deleting user: ${error.message}`,
            icon: "error",
          });
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
                  Data Pengguna
                </h3>
              </div>
              <div>
                {role !== "All" && (
                  <Button onClick={openCreateModal} className="btn btn-white">
                    Tambah Data
                  </Button>
                )}
              </div>
            </div>
          </Col>
          <Col lg={12} md={12} xs={12}>
            <div className="bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
              {/* Search and Filter Inputs */}
              <div className="d-flex justify-content-between mb-3">
                <input
                  type="text"
                  placeholder="Cari"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="form-control w-50"
                />
                <Form.Select
                  value={role === "All" ? "" : role}
                  onChange={handleRoleChange}
                  className="form-control w-auto"
                >
                  <option value="">Semua Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.nama_role}>
                      {role.nama_role}
                    </option>
                  ))}
                </Form.Select>
              </div>
              {filteredUsers.length === 0 ? (
                <p className="text-center py-4">
                  Belum ada data, silahkan tambahkan data
                </p>
              ) : (
                <div className="d-none d-lg-block table-responsive">
                  <Table hover className="table text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            {user.role
                              ? user.role.nama_role
                              : "Role tidak tersedia"}
                          </td>

                          <td>{user.status}</td>
                          <td className="d-flex justify-content-center">
                            <Link
                              href={`/pages/user/detailuser/${user.id}`}
                              className="btn btn-success me-2 d-flex align-items-center justify-content-center text-white"
                            >
                              <PersonVcard className="me-2 text-white" />
                              Detail
                            </Link>
                            {role !== "All" && (
                              <Link
                                href={`/pages/user/register/${user.id}?role=${
                                  user.role ? user.role.nama_role : ""
                                }`}
                                className="btn btn-info me-2 d-flex align-items-center justify-content-center text-white"
                              >
                                {user.url_foto_absen == null ? (
                                  <>
                                    <EmojiSmile className="me-2" /> Daftar Wajah
                                  </>
                                ) : (
                                  <span>Wajah Sudah Terdaftar</span>
                                )}
                              </Link>
                            )}
                            <Button
                              variant="danger"
                              onClick={() => confirmDelete(user.id)}
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
              {filteredUsers.length > 0 && (
                <div className="d-lg-none">
                  {currentUsers.map((user) => (
                    <Card key={user.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Card.Title>{user.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {user.email}
                            </Card.Subtitle>
                            <Card.Text>
                              Role:{" "}
                              {user.role
                                ? user.role.nama_role
                                : "Role tidak tersedia"}
                            </Card.Text>
                            <Card.Text>Status: {user.status}</Card.Text>
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
                              <Dropdown.Item
                                className="text-dark"
                                href={`/pages/user/detailuser/${user.id}`}
                              >
                                <PersonVcard className="me-2" /> Detail
                              </Dropdown.Item>
                              {role !== "All" && (
                                <Dropdown.Item
                                  href={`/pages/user/register/${user.id}?role=${
                                    user.role ? user.role.nama_role : ""
                                  }`}
                                >
                                  {user.url_foto_absen == null ? (
                                    <>
                                      <EmojiSmile className="me-2" /> Daftar
                                      Wajah
                                    </>
                                  ) : (
                                    <span>Wajah Sudah Terdaftar</span>
                                  )}
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item
                                onClick={() => confirmDelete(user.id)}
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
                <img
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail mt-3"
                />
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
