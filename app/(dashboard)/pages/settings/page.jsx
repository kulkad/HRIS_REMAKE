"use client";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Daftar warna yang akan ditampilkan sebagai blok warna
const colors = [
  "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#FFA500",
  "#800080", "#008000", "#808000", "#800000", "#808080", "#C0C0C0", "#FFC0CB", "#ADD8E6", "#FFD700",
  "#D3D3D3", "#A52A2A", "#8B4513", "#00CED1", "#9400D3", "#FF1493", "#FF4500"
];

const Settings = () => {
  const [warna_primary, setWarna_primary] = useState("");
  const [warna_secondary, setWarna_secondary] = useState("");
  const [warna_sidebar, setWarna_sidebar] = useState("");
  const [logo, setLogo] = useState("");
  const [nama_perusahaan, setNama_perusahaan] = useState("");

  const updateSetting = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_perusahaan", nama_perusahaan);
    formData.append("warna_primary", warna_primary);
    formData.append("warna_secondary", warna_secondary);
    formData.append("warna_sidebar", warna_sidebar);
    formData.append("logo", logo);

    try {
      await axios.patch(`http://localhost:5001/settings/1`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil mengupdate!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]); // Mengambil file yang dipilih
  };

  const handleColorSelect = (color, type) => {
    if (type === "primary") setWarna_primary(color);
    if (type === "secondary") setWarna_secondary(color);
    if (type === "sidebar") setWarna_sidebar(color);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={updateSetting}>
        <div className="form-group">
          <label>Primary Color:</label>
          <div className="color-grid">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-block ${warna_primary === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color, "primary")}
              />
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Secondary Color:</label>
          <div className="color-grid">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-block ${warna_secondary === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color, "secondary")}
              />
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Warna Sidebar:</label>
          <div className="color-grid">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-block ${warna_sidebar === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color, "sidebar")}
              />
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Logo :</label>
          <input type="file" name="logo" onChange={handleLogoChange} />
        </div>
        <div className="form-group">
          <label>Nama Perusahaan :</label>
          <input
            type="text"
            name="companyName"
            value={nama_perusahaan}
            onChange={(e) => setNama_perusahaan(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-save">
          Save Changes
        </button>
      </form>
      <style jsx>{`
        .settings-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .settings-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .color-block {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .color-block.selected {
          border: 2px solid #000;
        }

        .btn-save {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-save:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Settings;
