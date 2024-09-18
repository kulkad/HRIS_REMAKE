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
  const [alamat_lengkap, setAlamat_lengkap] = useState("");
  const [kota, setKota] = useState("");
  const [direktur, setDirektur] = useState("");
  const [user, setUser] = useState([]);
  const [suratPreview, setSuratPreview] = useState(""); // State to store the letter preview
  const [currentDate, setCurrentDate] = useState("");

  const [warna, setWarna] = useState({});
  const [loading, setLoading] = useState(false);
  const [textColor, setTextColor] = useState("#FFFFFF");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://89.116.187.91:3000/authentication/login";
    } else {
      setUser(JSON.parse(userData));
    }
    fetchSettings();
    setCurrentDate(getCurrentDate());
    loadSuratPreview();
  }, []);

    const fetchSettings = async () => {
      try {
        const response = await axios.get("http://89.116.187.91:5001/settings/1");
        setWarna(response.data);

        const backgroundColor = response.data.warna_secondary;

        const luminance = getLuminance(backgroundColor);
        setTextColor(luminance > 0.5 ? "#000000" : "#FFFFFF");
      } catch (error) {
        console.error("Error fetching Settings:", error);
      } finally {
        setLoading(false);
      }
    };

  // Fungsi untuk mendapatkan tanggal sekarang
  const getCurrentDate = () => {
    const now = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return now.toLocaleDateString("id-ID", options);
  };

  const updateLetterSetting = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama_perusahaan", nama_perusahaan);
    formData.append("logo", logo);
    formData.append("signature", signature);
    formData.append("kop_surat", kop_surat);
    formData.append("alamat_lengkap", alamat_lengkap);
    formData.append("kota", kota);
    formData.append("direktur", direktur);
    try {
      await axios.patch(`http://89.116.187.91:5001/surats/1`, formData, {
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
      const response = await axios.get("http://89.116.187.91:5001/surats/1");
      setSuratPreview(response.data);
    } catch (error) {
      console.error("Error fetching Surat Preview:", error);
    }
  };

  return (
    <div className="settings-container mt-5">
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
          <label>Alamat Lengkap :</label>
          <input
            type="text"
            name="alamat_lengkap"
            value={alamat_lengkap}
            onChange={(e) => setAlamat_lengkap(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Kota :</label>
          <input
            type="text"
            name="kota"
            value={kota}
            onChange={(e) => setKota(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Direktur :</label>
          <input
            type="text"
            name="direktur"
            value={direktur}
            onChange={(e) => setDirektur(e.target.value)}
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
              <h5>{suratPreview.alamat_lengkap}</h5>
            </div>
          </div>
        </div>
        <div className="body-surat flex flex-col">
          <p className="mb-4 text-right">
            {suratPreview.kota}, {currentDate}
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
            laudantium dignissimos corrupti quis adipisci dolores cupiditate qui
            at reprehenderit a laboriosam enim itaque quo nam debitis? Fugit
            dolores commodi fuga. Hic at eveniet autem ea alias dolores aliquam
            totam iure magnam repellat. Maxime animi voluptate ad nulla
            asperiores consequuntur deserunt sunt suscipit nobis reiciendis, et
            corrupti, impedit molestiae libero aperiam!
          </p>
        </div>
        <div className="footer-surat">
          <div className="sign-left">
            <p>Direktur,</p>
            <img
              src={suratPreview.url_signature}
              alt="Signature"
              className="signature"
            />
            <p>{suratPreview.direktur}</p>
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
          margin-top: 3rem;
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

        /* Gaya untuk logo dan signature */
        .logo {
          width: 80px; /* Ukuran logo */
          margin-right: 15px;
        }

        .signature {
          width: 80px; /* Ukuran signature yang sama dengan logo */
          height: auto; /* Mempertahankan rasio aspek */
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

        .body-surat p:first-child {
          font-weight: bold;
        }

        .text-right {
          text-align: right; /* Mengatur teks menjadi rata kanan */
        }
      `}</style>
    </div>
  );
};

export default Settings;
