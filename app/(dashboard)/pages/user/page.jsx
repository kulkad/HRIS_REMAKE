"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import node module libraries
import { Fragment } from "react";
import Link from "next/link";
import { Container, Col, Row } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [usersByRole, setUsersByRole] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const role = "Karyawan";
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [userToDelete, setUserToDelete] = useState(null); // State for the user to delete

  const openDeleteModal = (uuid) => {
    setUserToDelete(uuid);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteProduk(userToDelete);
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

  const deleteProduk = async (uuid) => {
    try {
      await axios.delete(`http://localhost:5001/users/${uuid}`);
      const response = await axios.get(
        `http://localhost:5001/userbyrole/${role}`,
        {
          withCredentials: true,
        }
      );
      setUsersByRole(response.data);
      setSuccessMessage("User berhasil dihapus.");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = (uuid) => {
    setOpenDropdown((prevOpenDropdown) =>
      prevOpenDropdown === uuid ? null : uuid
    );
  };

  const closeDropdownHandler = () => {
    setOpenDropdown(null);
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

  // Calculating the users to be displayed on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersByRole.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                  <h3 className="mb-0  text-white">Data Karyawan</h3>
                </div>
                <div>
                  <Link href="#" className="btn btn-white">
                    Tambah Data
                  </Link>
                </div>
              </div>
            </div>
          </Col>
          <div className="container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
            {successMessage && (
              <p className="text-green-600">{successMessage}</p>
            )}
            {/* Tampilkan pesan jika ada */}
            <div className="relative overflow-x-auto hidden sm:block">
              {usersByRole.length === 0 ? (
                <p className="text-center py-4">Tidak ada data</p>
              ) : (
                <table className="w-full text-sm text-left text-gray-500 dark:bg-slate-900 dark:text-white">
                  <thead className="text-xs text-gray-900 uppercase">
                    <tr>
                      <th className="px-6 py-3">Nama</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.uuid} className="bg-white dark:bg-gray-800">
                        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {user.name}
                        </th>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/edit-data/${user.uuid}`}
                            className="flex items-center hover:bg-green-200 hover:text-gray-800 rounded-xl p-2 w-full"
                          >
                            <MdEdit className="mr-1" /> Edit
                          </Link>
                          <button
                            onClick={() => {
                              openDeleteModal(user.uuid);
                              closeDropdownHandler();
                            }}
                            className="flex items-center hover:bg-red-300 hover:text-gray-800 rounded-xl p-2 w-full"
                          >
                            <MdDelete className="mr-1" /> Delete
                          </button>
                          <Link
                            href={`/detailuser/${user.uuid}`}
                            className="flex items-center hover:bg-blue-200 hover:text-gray-800 rounded-xl p-2 w-full"
                          >
                            <BiSolidUserDetail className="mr-1" /> Detail
                          </Link>
                          <Link
                            key={user.uuid}
                            href={`/register/${user.uuid}?role=${user.role}`}
                            className="flex items-center hover:bg-blue-200 hover:text-gray-800 rounded-xl p-2 w-full"
                          >
                            {user.url_foto_absen == null ? (
                              <>
                                <MdInsertEmoticon className="mr-1" /> Daftar
                                Muka
                              </>
                            ) : (
                              <span>Muka Sudah Terdaftar</span>
                            )}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {/* Pagination Controls */}
              <div className="flex justify-center mt-4">
                <nav>
                  <ul className="inline-flex items-center -space-x-px">
                    {[
                      ...Array(
                        Math.ceil(usersByRole.length / usersPerPage)
                      ).keys(),
                    ].map((number) => (
                      <li key={number} className="px-2">
                        <button
                          onClick={() => paginate(number + 1)}
                          className={`px-3 py-2 leading-tight text-gray-500 bg-gray-100 border border-gray-300 hover:bg-sky-100 hover:text-gray-700 rounded-xl dark:hover:bg-sky-200 dark:bg-gray-50 ${
                            currentPage === number + 1 ? "bg-gray-300" : ""
                          }`}
                        >
                          {number + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </Row>
      </Container>
           
    </Fragment>
  );
};

export default HomePage;
