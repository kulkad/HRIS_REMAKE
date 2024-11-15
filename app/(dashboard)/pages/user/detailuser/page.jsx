'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { API_Frontend } from "../../../../api/hello.js";
import Skeleton from 'react-loading-skeleton';

const DetailUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = `${API_Frontend}/authentication/login`; // Ganti URL
    } else {
      const parsedUserData = JSON.parse(userData);
      if (Array.isArray(parsedUserData)) {
        setUsers(parsedUserData);
      } else {
        setUsers([parsedUserData]);
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
        <Skeleton height={40} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Tampilan Untuk Laptop */}
      <div className="card shadow-lg mb-5 d-none d-sm-block">
        <div className="card-header d-flex align-items-center">
          <h1 className="h5 mb-0">DETAIL USER</h1>
        </div>
        <div className="card-body">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th scope="col">Foto</th>
                <th scope="col">Nama</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link href="/pages/user/profile/edit-foto">
                      <div>
                        <img
                          className="img-fluid rounded-circle"
                          style={{ width: '80px', height: '80px' }}
                          src={user.url}
                          alt="user photo"
                        />
                      </div>
                    </Link>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.nama_role}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilan Untuk Hp */}
      {users.map((user) => (
        <div key={user.id} className="card shadow-lg mb-5 d-block d-sm-none">
          <div className="card-header">
            <Link href="/">
              <div className="d-flex align-items-center text-decoration-none">
                <IoIosArrowBack className="me-2" />
                <span>DETAIL USER</span>
              </div>
            </Link>
          </div>
          <div className="card-body text-center">
            <Link href="/edit-potoprofile">
              <div>
                <img
                  className="img-fluid rounded-circle mb-3"
                  style={{ width: '100px', height: '100px' }}
                  src={user.url}
                  alt="user photo"
                />
              </div>
            </Link>
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.role}</p>
            <div className="mt-3">
              <p className="mb-1">
                <strong>Email: </strong>{user.email}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailUser;
