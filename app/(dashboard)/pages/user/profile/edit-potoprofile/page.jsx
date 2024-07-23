"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoMdImage, IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EditFotoProfile = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams(); // Mengambil ID dari URL
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");

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
    setPreview(URL.createObjectURL(image));
  };

  const saveFotoProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();  
    formData.append("file", file);

    try {
      await axios.patch(
        `http://localhost:5001/userfotoprofile/${user.uuid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Foto profil berhasil diperbarui");
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
    <div className="bg-white rounded-lg mx-4 p-4 text-xl dark:bg-slate-900">
      <div className="flex items-center mb-4">
        <Link href="/profile">
          <IoIosArrowBack className="mr-2 text-xl dark:text-white" />
        </Link>
        <h1 className="text-lg font-semibold dark:text-white">
          Edit Foto Profil
        </h1>
      </div>

      <form className="max-w" onSubmit={saveFotoProfile}>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Foto Profil
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <IoMdImage className="mr-5 dark:text-white" size={24} />
          </div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

        <button
          type="submit"
          className="mt-4 bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default EditFotoProfile;
