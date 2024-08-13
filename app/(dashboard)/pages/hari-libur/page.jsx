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
import { TrashFill } from "react-bootstrap-icons";
import { FaEllipsisVertical } from "react-icons/fa6";
import Swal from "sweetalert2";

const HariLibur = () => {
  const [user, setUser] = useState(null);
  const [hariLibur, setHariLibur] = useState([]);
  const [filteredHariLibur, setFilteredHariLibur] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hariLiburPerPage] = useState(5);
  const [namaLibur, setNamaLibur] = useState("");
  const [tanggalLibur, setTanggalLibur] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [liburId, setLiburId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchHariLibur = async () => {
      try {
        const response = await axios.get("http://localhost:5001/hari-libur");
        setHariLibur(response.data);
      } catch (error) {
        console.error("Error fetching Hari Libur:", error);
      }
    };

    fetchHariLibur();
  }, []);

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNamaLibur("");
    setTanggalLibur("");
    setDeskripsi("");
  };

  const openEditModal = (libur) => {
    setNamaLibur(libur.namaLibur);
    setTanggalLibur(libur.tanggalLibur);
    setDeskripsi(libur.deskripsi);
    setLiburId(libur.id);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setNamaLibur("");
    setTanggalLibur("");
    setDeskripsi("");
    setLiburId(null);
  };

  const saveData = async (e) => {
    e.preventDefault();
    const formData = {
      namaLibur,
      tanggalLibur,
      deskripsi,
    };

    try {
      await axios.post("http://localhost:5001/hari-libur", formData);
      Swal.fire({
        title: "Berhasil!",
        text: "Hari libur berhasil ditambahkan!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateData = async (e) => {
    e.preventDefault();
    const formData = {
      namaLibur,
      tanggalLibur,
      deskripsi,
    };

    try {
      await axios.patch(`http://localhost:5001/hari-libur/${liburId}`, formData);
      Swal.fire({
        title: "Berhasil!",
        text: "Hari libur berhasil diupdate!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = async (id) => {
    Swal.fire({
      title: "Apakah kamu yakin ingin menghapus?",
      text: "Hari libur yang dihapus tidak akan bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Lanjutkan!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/hari-libur/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Hari libur telah berhasil dihapus!",
            icon: "success",
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error deleting hari libur:", error.message);
        }
      }
    });
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

  const indexOfLastLibur = currentPage * hariLiburPerPage;
  const indexOfFirstLibur = indexOfLastLibur - hariLiburPerPage;
  const currentLibur = filteredHariLibur.slice(indexOfFirstLibur, indexOfLastLibur);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <Container fluid className="mt-4 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center mx-5">
              <div className="mb-2 mb-lg-0">
                <h3 className="mb-0 text-white">Hari Libur</h3>
              </div>
              <div>
                <Button onClick={openCreateModal} className="btn btn-white">
                  Tambah Hari Libur
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={12} md={12} xs={12}>
            <div className="bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
              {successMessage && <p className="text-green-600">{successMessage}</p>}
              {hariLibur.length === 0 ? (
                <p className="text-center py-4">Tidak ada data</p>
              ) : (
                <div className="d-none d-lg-block table-responsive">
                  <Table hover className="table text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Nama Libur</th>
                        <th>Tanggal Libur</th>
                        <th>Deskripsi</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hariLibur.map((libur) => (
                        <tr key={libur.id}>
                          <td>{libur.namaLibur}</td>
                          <td>{libur.tanggalLibur}</td>
                          <td>{libur.deskripsi}</td>
                          <td className="d-flex justify-content-center">
                            <Button
                              variant="warning"
                              onClick={() => openEditModal(libur)}
                              className="d-flex align-items-center justify-content-center me-2"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => confirmDelete(libur.id)}
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
              {hariLibur.length > 0 && (
                <div className="d-lg-none">
                  {hariLibur.map((libur) => (
                    <Card key={libur.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Card.Title>{libur.namaLibur}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {libur.tanggalLibur}
                            </Card.Subtitle>
                            <Card.Text>{libur.deskripsi}</Card.Text>
                          </div>
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              variant="link"
                              id={`dropdown-custom-components-${libur.id}`}
                              className="p-0 bg-transparent border-0"
                            >
                              <FaEllipsisVertical />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => confirmDelete(libur.id)}>
                                <TrashFill className="me-2" /> Delete
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => openEditModal(libur)}>
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
              {hariLibur.length > hariLiburPerPage && (
                <Pagination className="justify-content-center mt-3">
                  {Array.from({
                    length: Math.ceil(filteredHariLibur.length / hariLiburPerPage),
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
              )}
            </div>
          </Col>
        </Row>
      </Container>
      {/* Modal for Creating Data */}
      <Modal show={showCreateModal} onHide={closeCreateModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Hari Libur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveData}>
            <Form.Group controlId="formNamaLibur">
              <Form.Label>Nama Libur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Nama Libur"
                value={namaLibur}
                onChange={(e) => setNamaLibur(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formTanggalLibur" className="mt-3">
              <Form.Label>Tanggal Libur</Form.Label>
              <Form.Control
                type="date"
                placeholder="Masukkan Tanggal Libur"
                value={tanggalLibur}
                onChange={(e) => setTanggalLibur(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDeskripsi" className="mt-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Masukkan Deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Editing Data */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Hari Libur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateData}>
            <Form.Group controlId="formNamaLiburEdit">
              <Form.Label>Nama Libur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Nama Libur"
                value={namaLibur}
                onChange={(e) => setNamaLibur(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formTanggalLiburEdit" className="mt-3">
              <Form.Label>Tanggal Libur</Form.Label>
              <Form.Control
                type="date"
                placeholder="Masukkan Tanggal Libur"
                value={tanggalLibur}
                onChange={(e) => setTanggalLibur(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDeskripsiEdit" className="mt-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Masukkan Deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default HariLibur;
