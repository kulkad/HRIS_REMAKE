"use client";

import React, { useState, useEffect, Fragment } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { SlOptionsVertical } from "react-icons/sl";
import { MdInsertEmoticon } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import axios from "axios";
import { Container, Col, Row, Modal, Button } from "react-bootstrap";
import { EmojiSmile, PersonVcard, TrashFill } from "react-bootstrap-icons";

const DataPkl = () => {
  const [user, setUser] = useState(null);
  const [usersByRole, setUsersByRole] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const role = "Pkl";
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
        const response = await axios.get(`http://localhost:5001/userbyrole/${role}`, {
          withCredentials: true,
        });
        setUsersByRole(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsersByRole();
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
                <h3 className="mb-0 text-white">Data Praktek Kerja Lapangan</h3>
              </div>
              <div>
                <Button onClick={openCreateModal} className="btn btn-white">
                  Tambah Data
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={12} md={12} xs={12}>
            <div className="bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
              {usersByRole.length === 0 ? (
                <p className="text-center py-4">Tidak ada data</p>
              ) : (
                <div className="table-responsive d-flex justify-content-center">
                  <table className="table w-auto text-sm text-left text-gray-500 dark:bg-slate-900 dark:text-white">
                    <thead className="text-xs text-gray-900 uppercase bg-gray-200 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-center">Nama</th>
                        <th className="px-6 py-3 text-center">Email</th>
                        <th className="px-6 py-3 text-center">Role</th>
                        <th className="px-6 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user.id} className="bg-white dark:bg-gray-800">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-center">{user.role}</td>
                          <td className="px-6 py-4 flex justify-end gap-2 text-center">
                            <Link
                              href={`/pages/user/detailuser/${user.id}`}
                              className="d-flex items-center hover:bg-blue-200 hover:text-gray-800 rounded-xl p-2"
                            >
                              <PersonVcard className="mt-1 me-2" /> Detail
                            </Link>
                            <Link
                              href={`/pages/user/register/${user.id}?role=${user.role}`}
                              className="d-flex items-center hover:bg-blue-200 hover:text-gray-800 rounded-xl p-2"
                            >
                              {user.url_foto_absen == null ? (
                                <>
                                  <EmojiSmile className="mt-1 me-2" /> Daftar
                                  Muka
                                </>
                              ) : (
                                <span>Muka Sudah Terdaftar</span>
                              )}
                            </Link>
                            <button
                              onClick={() => openDeleteModal(user.id)}
                              className="d-flex items-center hover:bg-red-300 hover:text-gray-800 rounded-xl p-2"
                            >
                              <TrashFill className="mt-1 me-2" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="d-flex justify-content-center mt-4">
                <ul className="inline-flex items-center -space-x-px">
                  {Array.from({
                    length: Math.ceil(usersByRole.length / usersPerPage),
                  }).map((_, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className={`px-3 py-2 ${
                          currentPage === index + 1
                            ? "text-blue-500 bg-blue-50"
                            : "text-gray-500 bg-white"
                        } border border-gray-300 rounded-lg mx-1`}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
          <form onSubmit={saveData}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nama
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confPassword" className="form-label">
                Konfirmasi Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confPassword"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="file" className="form-label">
                Foto
              </label>
              <input
                type="file"
                className="form-control"
                id="file"
                onChange={loadImage}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail mt-3"
                />
              )}
            </div>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default DataPkl;
