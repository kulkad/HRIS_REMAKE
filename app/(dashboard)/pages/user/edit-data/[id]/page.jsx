"use client";

import Link from "next/link";
import React from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
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
    // setConfpassword(response.data.confpassword);
    setFile(response.data.image);
    setpreview(response.data.url);
    console.log("coba", response);
  };

  const saveData = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("role", role);
    formdata.append("confPassword", confpassword);
    // console.log("coba", password);
    // console.log("coba lama", confpassword);

    // if (password == null && confpassword == null)
    //   alert("Anda Yakin Tidak Mengubah Password anda?");

    if (password == passwordLama) {
      formdata.append("password", passwordLama);
    } else {
      formdata.append("password", password);
    }

    // if (password !== confpassword)
    //   alert("Password dan Confirmasi Password Tidak Cocok");

    try {
      await axios.patch(`http://localhost:5001/updateuser/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Behasil Edit Data");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  if (!user)
    return (
      <div className="w-full bg-white dark:bg-slate-900 dark:text-white max-w-md mx-auto rounded-lg shadow-md overflow-hidden md:max-w-2xl p-4">
        <Skeleton height={40} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
      </div>
    );
  return (
    <div className="bg-white rounded-lg mx-4 p-4 text-xl">
      <h1 className="mt-1 mb-4 font-semibold">Form Tambah User</h1>

      <form className="max-w" onSubmit={saveData}>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Nama
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <FaUser />
          </div>
          <input
            type="text"
            id="nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="your name"
          />
        </div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <MdEmail />
          </div>
          <input
            type="text"
            id="email-address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="your@gmail.com"
          />
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <FaLock />
          </div>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="***********"
          />
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Confirmasi Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <FaLock />
          </div>
          <input
            type="password"
            id="password"
            onChange={(e) => setConfpassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="***********"
          />
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Image
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <IoMdImage className="mr-5" size={24} />
          </div>
          <input
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            onChange={loadImage}
            type="file"
          />
        </div>

        {preview ? (
          <figure className="image is-128x128">
            <img src={preview} alt="Preview Image" />
          </figure>
        ) : (
          ""
        )}

        <input
          type="submit"
          className="inline-block border-rounded w-18 h-15 mt-4 bg-green-400 hover:bg-green-500 hover:text-white"
        />
      </form>
    </div>
  );
};

export default EditData;
