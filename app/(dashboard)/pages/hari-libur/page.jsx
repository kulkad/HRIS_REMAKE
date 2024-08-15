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
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";

const HariLibur = () => {
  const [hariLibur, setHariLibur] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [nama_libur, setNamaLibur] = useState("");
  const [tanggal_hari_libur, setTanggalHariLibur] = useState("");
  const [selectedLiburId, setSelectedLiburId] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState("");

  const [user, setUser] = useState([]); // untuk keamanan agar tidak bocor datanya
  const userData = localStorage.getItem("user");
  if (!userData) {
    window.location.href = "http://localhost:3000/authentication/login";
  } else {
    setUser(JSON.parse(userData));
  }

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/hari-libur");
      setHariLibur(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching Hari Libur:", error);
    }
  };

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

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNamaLibur("");
    setTanggalHariLibur("");
  };

  const openEditModal = (libur) => {
    setNamaLibur(libur.nama_libur);
    setTanggalHariLibur(libur.tanggal_hari_libur);
    setSelectedLiburId(libur.id);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setNamaLibur("");
    setTanggalHariLibur("");
    setSelectedLiburId(null);
  };

  const saveData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/hari-libur", {
        nama_libur,
        tanggal_hari_libur,
      });
      Swal.fire("Berhasil!", "Hari Libur baru berhasil ditambahkan!", "success");
      closeCreateModal();
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const updateData = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5001/hari-libur/${selectedLiburId}`, {
        nama_libur,
        tanggal_hari_libur,
      });
      setHariLibur(
        hariLibur.map((libur) =>
          libur.id === selectedLiburId
            ? { ...libur, nama_libur, tanggal_hari_libur }
            : libur
        )
      );
      Swal.fire("Berhasil!", "Hari Libur berhasil diupdate!", "success");
      closeEditModal();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = async (id) => {
    Swal.fire({
      title: "Apakah kamu yakin ingin menghapus?",
      text: "Hari Libur yang dihapus tidak akan bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Lanjutkan!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/hari-libur/${id}`);
          setHariLibur(hariLibur.filter((libur) => libur.id !== id));
          Swal.fire("Deleted!", "Hari Libur telah berhasil dihapus!.", "success");
        } catch (error) {
          console.error("Error deleting Hari Libur:", error.message);
        }
      }
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLibur = hariLibur.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <div className="pt-10 pb-21" style={{ backgroundColor: data.warna_secondary}}></div>
      <Container fluid className="mt-n22 px-6">
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
            <div className="bg-white my-5 p-4 rounded shadow">
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
              {hariLibur.length === 0 ? (
                <p className="text-center py-4">Tidak ada data</p>
              ) : (
                <div className="table-responsive">
                  <Table hover className="table text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Nama Libur</th>
                        <th>Tanggal</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLibur.map((libur) => (
                        <tr key={libur.id}>
                          <td>{libur.nama_libur}</td>
                          <td>{libur.tanggal_hari_libur}</td>
                          <td className="d-flex justify-content-center">
                            <Button
                              variant="warning"
                              onClick={() => openEditModal(libur)}
                              className="me-2"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => confirmDelete(libur.id)}
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
              <Pagination className="d-flex justify-content-center mt-4">
                {Array.from({
                  length: Math.ceil(hariLibur.length / itemsPerPage),
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
          <Modal.Title>Tambah Hari Libur Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveData}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Libur</Form.Label>
              <Form.Control
                type="text"
                value={nama_libur}
                onChange={(e) => setNamaLibur(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal</Form.Label>
              <Form.Control
                type="date"
                value={tanggal_hari_libur}
                onChange={(e) => setTanggalHariLibur(e.target.value)}
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
          <Modal.Title>Edit Hari Libur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateData}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Libur</Form.Label>
              <Form.Control
                type="text"
                value={nama_libur}
                onChange={(e) => setNamaLibur(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal</Form.Label>
              <Form.Control
                type="date"
                value={tanggal_hari_libur}
                onChange={(e) => setTanggalHariLibur(e.target.value)}
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

export default HariLibur;
