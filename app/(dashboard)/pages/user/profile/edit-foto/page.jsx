"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoMdImage } from "react-icons/io";
import axios from "axios";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EditFotoProfile = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
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
        `http://localhost:5001/updateuser/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data); // Debugging log
      alert("Foto profil berhasil diperbarui");
      window.location.reload();
    } catch (error) {
      console.log(error);
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
                <img
                  src={preview}
                  alt="Preview Image"
                  className="img-thumbnail rounded-circle"
                  style={{ width: "150px", height: "150px" }}
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
