"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoMdImage } from "react-icons/io";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from 'next/image';
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";

const EditFotoProfile = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login";
    } else {
      const user = JSON.parse(userData);
      setUser(user);
      setUserId(user.id);
      setPreview(user.profilePicture);
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

      setPreview(response.data.profilePicture);

      Swal.fire({
        title: "Berhasil!",
        text: "Foto profil berhasil diperbarui!",
        icon: "success"
      }).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      console.error("Error details:", error);
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

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFile("");
    setPreview(user.profilePicture);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <div className="card-header d-flex align-items-center">
          <h1 className="h5">Edit Foto Profil</h1>
        </div>
        <div className="card-body text-center">
          <button className="btn btn-primary" onClick={handleModalOpen}>
            Edit Foto Profil
          </button>
        </div>
      </div>

      <Modal show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Foto Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveFotoProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Foto Profil</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <IoMdImage />
                </span>
                <Form.Control
                  id="user_avatar"
                  onChange={loadImage}
                  type="file"
                />
              </div>
            </Form.Group>

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
              <Button type="submit" variant="success">
                Simpan
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditFotoProfile;
