"use client";

import Link from "next/link";
import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IoMdImage, IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { useParams } from "next/navigation";

const EditData = () => {
  // Pengecekan Route Apakah User Sudah Login Atau belum
  const [user, setUser] = useState(null);
  // const router = useRouter();
  const { id } = useParams(); // Mengambil ID dari URL
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLama, setPasswordLama] = useState("");
  const [confpassword, setConfpassword] = useState("");
  const [file, setFile] = useState("");
  const [preview, setpreview] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setpreview(URL.createObjectURL(image));
  };

  useEffect(() => {
    GetUserById();
  }, []);

  const GetUserById = async () => {
    const response = await axios.get(`http://localhost:5001/users/${id}`);
    setName(response.data.name);
    setEmail(response.data.email);
    setRole(response.data.role);
    setPassword(response.data.password);
    setPasswordLama(response.data.password);
    setFile(response.data.image);
    setpreview(response.data.url);
  };

  const saveData = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("role", role);
    formdata.append("confPassword", confpassword);

    if (password === passwordLama) {
      formdata.append("password", passwordLama);
    } else {
      formdata.append("password", password);
    }

    try {
      await axios.patch(`http://localhost:5001/updateuser/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Berhasil Edit Data");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!user)
    return (
      <div className="container mt-5">
        <Skeleton height={40} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
      </div>
    );

  return (
    <div className="container mt-5">
      <h1 className="mt-1 mb-4 font-semibold">Form Edit User</h1>

      <form onSubmit={saveData}>
        <div className="mb-3">
          <label className="form-label">Nama</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              id="nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <div className="input-group">
            <span className="input-group-text">
              <MdEmail />
            </span>
            <input
              type="text"
              id="email-address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="your@gmail.com"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="***********"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Konfirmasi Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type="password"
              id="confPassword"
              onChange={(e) => setConfpassword(e.target.value)}
              className="form-control"
              placeholder="***********"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <div className="input-group">
            <span className="input-group-text">
              <IoMdImage />
            </span>
            <input
              className="form-control"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              onChange={loadImage}
              type="file"
            />
          </div>
        </div>

        {preview ? (
          <div className="mb-3">
            <img src={preview} alt="Preview Image" className="img-thumbnail" />
          </div>
        ) : (
          ""
        )}

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditData;
