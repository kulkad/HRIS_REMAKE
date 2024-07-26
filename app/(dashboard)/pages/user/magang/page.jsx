"use client";
import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { SlOptionsVertical } from "react-icons/sl";
import { MdInsertEmoticon } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import axios from "axios";
import { Fragment } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { EmojiSmile, PersonVcard, TrashFill } from "react-bootstrap-icons";

const DataMagang = () => {
  const [user, setUser] = useState(null);
  const [usersByRole, setUsersByRole] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const role = "Magang";
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`http://localhost:5001/users/${userToDelete}`);
        const response = await axios.get(
          `http://localhost:5001/userbyrole/${role}`,
          {
            withCredentials: true,
          }
        );
        setUsersByRole(response.data);
        setSuccessMessage("User berhasil dihapus.");
      } catch (error) {
        console.error("Error deleting user:", error.message);
      }
      closeDeleteModal();
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
        const response = await axios.get(
          `http://localhost:5001/userbyrole/${role}`,
          {
            withCredentials: true,
          }
        );
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
                <h3 className="mb-0 text-white">Data Magang</h3>
              </div>
              <div>
                <Link
                  href="/pages/user/tambah/?role=Magang"
                  className="btn btn-white"
                >
                  Tambah Data
                </Link>
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
                  {[
                    ...Array(
                      Math.ceil(usersByRole.length / usersPerPage)
                    ).keys(),
                  ].map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number + 1)}
                      className={`px-3 py-2 leading-tight text-gray-500 bg-gray-100 border border-gray-300 hover:bg-sky-100 rounded-2 dark:hover:bg-sky-200 dark:bg-gray-50 ${
                        currentPage === number + 1 ? "bg-gray-300" : ""
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </ul>
              </div>
              {showModal && (
                <div
                  className="modal show d-block"
                  tabIndex="-1"
                  style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Konfirmasi Hapus</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={closeDeleteModal}
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <p>Apakah Anda Yakin Ingin Menghapus Data Ini?</p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={closeDeleteModal}
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={confirmDelete}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default DataMagang;
