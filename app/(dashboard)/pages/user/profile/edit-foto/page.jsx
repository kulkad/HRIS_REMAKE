"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoMdImage } from "react-icons/io";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from 'next/image';

const EditFotoProfile = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [userId, setUserId] = useState(null); // Menggunakan state untuk menyimpan user ID

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login";
    } else {
      const user = JSON.parse(userData);
      setUser(user);
      setUserId(user.id); // Set user ID dari data pengguna yang login
      setPreview(user.profilePicture); // Set preview ke foto profil saat ini
    }
  }, []);

  useEffect(() => {
    console.log("User ID:", userId);
  }, [userId]);

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const saveFotoProfile = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Debugging log
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.patch(
        `http://localhost:5001/updateuser/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data); // Debugging log
      alert("Foto profil berhasil diperbarui");
      // Update preview dengan path gambar baru dari respons backend
      setPreview(response.data.profilePicture);
    } catch (error) {
      console.error("Error details:", error); // Detailed error log
      if (error.response) {
        console.error("Server responded with a status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      alert("Gagal memperbarui foto profil. Silakan coba lagi.");
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="card shadow-lg p-4">
          <Skeleton height={40} count={1} className="mb-4" />
          <Skeleton height={20} count={1} className="mb-4" />
          <Skeleton height={20} count={1} className="mb-4" />
          <Skeleton height={50} width={150} className="mb-4" />
          <Skeleton height={50} width={150} className="mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <div className="card-header d-flex align-items-center">
          <h1 className="h5">Edit Foto Profil</h1>
        </div>
        <div className="card-body">
          <form onSubmit={saveFotoProfile}>
            <div className="mb-3">
              <label className="form-label">Foto Profil</label>
              <div className="input-group">
                <span className="input-group-text">
                  <IoMdImage />
                </span>
                <input
                  className="form-control"
                  id="user_avatar"
                  onChange={loadImage}
                  type="file"
                />
              </div>
            </div>

            {preview && (
              <div className="text-center my-3">
                <Image
                  src={preview}
                  alt="Preview Image"
                  className="img-thumbnail rounded-circle"
                  width={150}
                  height={150}
                />
              </div>
            )}

            <div className="text-center">
              <button type="submit" className="btn btn-success">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFotoProfile;