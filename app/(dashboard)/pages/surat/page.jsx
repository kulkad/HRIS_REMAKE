"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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
  const [logo, setLogo] = useState("");
  const [signature, setSignature] = useState("");
  const [nama_perusahaan, setNama_perusahaan] = useState("");
  const [kop_surat, setKop_surat] = useState("");
  const [alamat, setAlamat] = useState("");
  const [alamat_lengkap, setAlamat_lengkap] = useState("");
  const [user, setUser] = useState([]);
  const [suratPreview, setSuratPreview] = useState(""); // State to store the letter preview

  const [warna, setWarna] = useState({});
  const [loading, setLoading] = useState(false);
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

        const backgroundColor = response.data.warna_sidebar;
        const luminance = getLuminance(backgroundColor);
        setTextColor(luminance > 0.5 ? "#000000" : "#FFFFFF");
      } catch (error) {
        console.error("Error fetching Settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateLetterSetting = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama_perusahaan", nama_perusahaan);
    formData.append("logo", logo);
    formData.append("signature", signature);
    formData.append("kop_surat", kop_surat);
    formData.append("alamat", alamat);
    formData.append("alamat_lengkap", alamat_lengkap);
    try {
      await axios.patch(`http://localhost:5001/surats/1`, formData, {
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
    setLogo(e.target.files[0]);
  };

  const handleSignatureChange = (e) => {
    setSignature(e.target.files[0]);
  };

  // Function to load the letter preview
  const loadSuratPreview = async () => {
    try {
      const response = await axios.get("http://localhost:5001/surats/1");
      setSuratPreview(response.data); // Set the entire response object to suratPreview
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching Surat Preview:", error);
    }
  };

  useEffect(() => {
    loadSuratPreview();
  }, []);

  return (
    <div className="settings-container">
      <form className="settings-form" onSubmit={updateLetterSetting}>
        <h2>Surat</h2>
        <div className="form-group">
          <label>Logo :</label>
          <input type="file" name="logo" onChange={handleLogoChange} />
        </div>
        <div className="form-group">
          <label>Signature :</label>
          <input
            type="file"
            name="signature"
            onChange={handleSignatureChange}
          />
        </div>
        <div className="form-group">
          <label>Nama Perusahaan :</label>
          <input
            type="text"
            name="nama_perusahaan"
            value={nama_perusahaan}
            onChange={(e) => setNama_perusahaan(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Kop Surat :</label>
          <input
            type="text"
            name="kop_surat"
            value={kop_surat}
            onChange={(e) => setKop_surat(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Alamat :</label>
          <input
            type="text"
            name="alamat"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Alamat Lengkap :</label>
          <input
            type="text"
            name="alamat_lengkap"
            value={alamat_lengkap}
            onChange={(e) => setAlamat_lengkap(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn-save"
          style={{ backgroundColor: warna.warna_secondary, color: textColor }}
        >
          Save Letter Changes
        </button>
      </form>

      {/* Add Letter Preview Below */}
      <div className="surat-preview-container">
        <div className="kop-surat">
          <div className="header-left">
            <img src={suratPreview.url} alt="Logo" className="logo" />
            <div>
              <h3>{suratPreview.kop_surat}</h3>
              <h5>{suratPreview.alamat}</h5>  
              <p>{suratPreview.alamat_lengkap}</p>  
            </div>
          </div>
        </div>
        <div className="body-surat flex justify-center">
          <p>Contoh isi</p> {/* Accessing the content field */}
        </div>
        <div className="footer-surat">
          <div className="sign-left">
            <p>Ketua Panitia,</p>
            <img src={suratPreview.url_signature} alt="Signature" />
            <p>{suratPreview.ketua}</p>
          </div>
          <div className="sign-right">
            <p>Sekretaris,</p>
            <img src={suratPreview.signature_sekretaris} alt="Signature" />
            <p>{suratPreview.sekretaris}</p>
          </div>
        </div>
      </div>

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

        /* Surat Preview Styling */
        .surat-preview-container {
          margin-top: 30px;
          padding: 20px;
          background-color: #ffffff;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .kop-surat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .logo {
          width: 80px;
          margin-right: 15px;
        }

        .flag {
          width: 80px;
        }

        .body-surat {
          margin-bottom: 20px;
        }

        .footer-surat {
          display: flex;
          justify-content: space-between;
        }

        .sign-left,
        .sign-right {
          text-align: center;
        }

        .sign-left img,
        .sign-right img {
          width: 150px;
          height: auto;
          display: block;
          margin: 10px auto;
        }
      `}</style>
    </div>
  );
};

export default Settings;
