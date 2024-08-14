"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';

const DetailUser = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/users/${id}`);
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      {/* Desktop View */}
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
                <th scope="col">Role</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
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
                <td>{user.role.nama_role}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="card shadow-lg mb-5 d-block d-sm-none">
        <div className="card-header">
          <Link href="/profile">
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
          <p className="card-text">{user.role.nama_role}</p>
          <div className="mt-3">
            <p className="mb-1">
              <strong>Email: </strong>{user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
