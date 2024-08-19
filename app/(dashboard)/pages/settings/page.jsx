"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Daftar warna yang akan ditampilkan sebagai blok warna
const colors = [
  "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#FFA500",
  "#800080", "#008000", "#808000", "#800000", "#808080", "#C0C0C0", "#FFC0CB", "#ADD8E6", "#FFD700",
  "#D3D3D3", "#A52A2A", "#8B4513", "#00CED1", "#9400D3", "#FF1493", "#FF4500"
];

// Fungsi untuk menghitung luminance
const getLuminance = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

const Settings = () => {
  const [warna_primary, setWarna_primary] = useState("");
  const [warna_secondary, setWarna_secondary] = useState("");
  const [warna_sidebar, setWarna_sidebar] = useState("");
  
  // New states for letter settings
  const [logo, setLogo] = useState("");
  const [signature, setSignature] = useState("");
  const [nama_perusahaan, setNama_perusahaan] = useState("");
  const [kop_surat_1, setKop_surat_1] = useState("");
  const [kop_surat_2, setKop_surat_2] = useState("");
  const [kop_surat_3, setKop_surat_3] = useState("");
  const [user, setUser] = useState([]); // untuk keamanan agar tidak bocor datanya

     // Untuk mengganti warna dari database
     const [warna, setWarna] = useState({});
     const [loading, setLoading] = useState({});
     const [textColor, setTextColor] = useState("#FFFFFF");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/authentication/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("http://localhost:5001/settings/1");
        setWarna(response.data);

        // Mengambil warna latar belakang dari API
        const backgroundColor = response.data.warna_sidebar;

        // Menghitung luminance dari warna latar belakang
        const luminance = getLuminance(backgroundColor);

        // Jika luminance rendah, gunakan teks putih, jika tinggi, gunakan teks hitam
        setTextColor(luminance > 0.5 ? "#000000" : "#FFFFFF");
      } catch (error) {
        console.error("Error fetching Settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateColorSetting = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5001/settings/1`, {
        warna_primary,
        warna_secondary,
        warna_sidebar
      });
      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil mengupdate warna!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const updateLetterSetting = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_perusahaan", nama_perusahaan);
    formData.append("logo", logo);
    formData.append("signature", signature);
    formData.append("kop_surat_1", kop_surat_1);
    formData.append("kop_surat_2", kop_surat_2);
    formData.append("kop_surat_3", kop_surat_3);

    try {
      await axios.patch(`http://localhost:5001/settings/1`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Berhasil!",
        text: "Berhasil mengupdate surat!",
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

  const handleSignatureChange = (e) => {
    setSignature(e.target.files[0]); // Mengambil file yang dipilih
  };

  const handleColorSelect = (color, type) => {
    if (type === "primary") setWarna_primary(color);
    if (type === "secondary") setWarna_secondary(color);
    if (type === "sidebar") setWarna_sidebar(color);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={updateColorSetting}>
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
        <button type="submit" className="btn-save" style={{ backgroundColor: warna.warna_secondary, color: textColor }}>
          Save Color Changes
        </button>
      </form>
      
      <form className="settings-form" onSubmit={updateLetterSetting}>
        <div className="form-group">
          <label>Logo :</label>
          <input type="file" name="logo" onChange={handleLogoChange} />
        </div>
        <div className="form-group">
          <label>Signature :</label>
          <input type="file" name="signature" onChange={handleSignatureChange} />
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
        <div className="form-group">
          <label>Kop Surat 1 :</label>
          <input
            type="text"
            name="kop_surat_1"
            value={kop_surat_1}
            onChange={(e) => setKop_surat_1(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Kop Surat 2 :</label>
          <input
            type="text"
            name="kop_surat_2"
            value={kop_surat_2}
            onChange={(e) => setKop_surat_2(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Kop Surat 3 :</label>
          <input
            type="text"
            name="kop_surat_3"
            value={kop_surat_3}
            onChange={(e) => setKop_surat_3(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-save" style={{ backgroundColor: warna.warna_secondary, color: textColor }}>
          Save Letter Changes
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
          margin-bottom: 20px;
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
