"use client";

import React from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { IoMdImage } from "react-icons/io";
import axios from "axios";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

const TambahData = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfpassword] = useState("");
  const [file, setFile] = useState("");
  const [preview, setpreview] = useState("");
  

  useEffect(() => {
    // Mengambil parameter query 'role' dari URL
    const queryParams = new URLSearchParams(window.location.search);
    const roleFromUrl = queryParams.get("role");
    setRole(roleFromUrl);
  }, []);

  // Pengecekan Route Apakah User Sudah Login Atau belum
  const [user, setUser] = useState(null);
  // const router = useRouter();

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

  const saveData = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("role", role);
    formdata.append("password", password);
    formdata.append("confPassword", confpassword);

    if (password !== confpassword)
      alert("Password dan Confirmasi Password Tidak Cocok");

    try {
      await axios.post("http://localhost:5001/users", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Behasil Tambah Data");
      window.location.reload();
    } catch (error) {
      console.log(error);
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

  return (
    <div className="bg-white rounded-lg mx-4 p-4 text-xl dark:bg-slate-900 container">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-white">Form Tambah User</h3>
      </div>


      <form className="max-w" onSubmit={saveData}>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Nama
        </label>
        <div className="relative d-flex">
          <div className="p-2">
            <FaUser />
          </div>
          <input
            type="text"
            id="nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            placeholder="your name"
          />
        </div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <div className="relative d-flex">
          <div className="p-2">
            <MdEmail />
          </div>
          <input
            type="text"
            id="email-address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="your@gmail.com"
          />
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <div className="relative d-flex">
          <div className="p-2">
            <FaLock />
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="***********"
          />
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Konfirmasi Password
        </label>
        <div className="relative d-flex">
          <div className="p-2">
            <FaLock />
          </div>
          <input
            type="password"
            id="password"
            value={confpassword}
            onChange={(e) => setConfpassword(e.target.value)}
            className="form-control"
            placeholder="***********"
          />
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Image
        </label>
        <div className="relative d-flex">
          <div className="p-2">
            <IoMdImage className="mr-5" size={24} />
          </div>
          <input
            class="form-control"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            onChange={loadImage}
            type="file"
          />
        </div>

        {preview && (
          <figure className="mt-4">
            <img
              src={preview}
              alt="Preview Image"
              className="w-32 h-32 object-cover rounded-full"
            />
          </figure>
        )}

        <input
          type="submit"
          className="mt-4 btn btn-success"
        />
      </form>
    </div>
  );
};

export default TambahData;
