"use client";
import React, { useEffect, useState, useRef } from "react";

import { Modal, Button, Table } from "react-bootstrap";
import { useParams } from "next/navigation";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import html2canvas from "html2canvas";
import jsPDF from "jspdf"; // Pastikan jsPDF diimpor
import moment from "moment";
import "moment/locale/id"; // Impor locale bahasa Indonesia

const DetailUser = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [absenBulanIni, setAbsenBulanIni] = useState({
    hadir: 0,
    tidakHadir: 0,
    persentaseKehadiran: 0,
    history: [], // Tambahkan history untuk menyimpan data kehadiran
  });
  const [surat, setSurat] = useState({});
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const response = await axios.get("http://localhost:5001/surats/1");
        setSurat(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Surat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurat();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetching user details
        const userResponse = await axios.get(
          `http://localhost:5001/users/${id}`
        );
        setUser(userResponse.data);

        // Fetching user's attendance records
        const absenResponse = await axios.get(
          `http://localhost:5001/detailuser/${id}`
        );
        const allAttendanceData = absenResponse.data;

        // Calculate attendance for this month
        hitungAbsenBulanIni(allAttendanceData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const hitungAbsenBulanIni = (dataAbsen) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const absenBulanIni = dataAbsen.filter((absen) => {
      const [year, month] = absen.tanggal.split("-");
      return parseInt(month) === currentMonth && parseInt(year) === currentYear;
    });
    const totalAbsen = absenBulanIni.length;
    const hadir = absenBulanIni.filter(
      (absen) => absen.keterangan === "Hadir"
    ).length;
    const persentaseKehadiran =
      totalAbsen > 0 ? ((hadir / totalAbsen) * 100).toFixed(2) : 0;
    const history = Array.from({ length: 31 }, (_, i) => {
      const date = moment(
        `${currentYear}-${currentMonth}-${i + 1}`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD");
      const absen = absenBulanIni.find((a) => a.tanggal === date);
      return {
        tanggal: i + 1,
        keterangan: absen ? absen.keterangan : "Tidak Ada Data",
      };
    });

    setAbsenBulanIni({
      hadir,
      tidakHadir: totalAbsen - hadir,
      persentaseKehadiran,
      history,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Function to download PDF with multi-page support
  const handleDownloadPDF = async () => {
    if (componentRef.current) {
      const canvas = await html2canvas(componentRef.current);
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const doc = new jsPDF("p", "mm", "a4");
      const pageHeight = doc.internal.pageSize.height;
      let heightLeft = imgHeight;
      let position = 0;
  
      // Logo surat
      if (surat.url) {
        doc.addImage(surat.url, "PNG", 15, 10, 24, 24);
      }
  
      // Teks kop surat, alamat, dan tanggal
      doc.setFontSize(24); // Ukuran font setara dengan h3
      doc.text(surat.kop_surat, 45, 20); // Posisi teks kop surat
  
      doc.setFontSize(12);
      doc.text(surat.alamat_lengkap, 45, 30);
  
      // Garis di bawah kop surat dan alamat
      doc.setLineWidth(0.5); 
      doc.line(15, 45, 195, 45); 
  
      // Tanggal
      doc.setFontSize(12);
      doc.text(
        `${surat.kota}, ${moment().locale("id").format("DD MMMM YYYY")}`,
        150, // Menyesuaikan posisi tanggal ke kanan
        55
      );
  
      // Menambahkan laporan absen dari canvas
      while (heightLeft >= 0) {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 15, position + 70, imgWidth, imgHeight);
        heightLeft -= pageHeight - 50;
        position = heightLeft - imgHeight;
        if (heightLeft > 0) {
          doc.addPage();
        }
      }
  
      // Signature dan nama direktur
      if (surat.url_signature) {
        doc.addImage(surat.url_signature, "PNG", 15, pageHeight - 40, 24, 24);
      }
      doc.text("Direktur,", 15, pageHeight - 45); // Menambahkan teks "Direktur"
      doc.text(surat.direktur, 15, pageHeight - 20); // Nama direktur di bawah signature
  
      // Save the PDF
      doc.save(`Attendance_Report_${moment().format("MMMM_YYYY")}.pdf`);
    } else {
      console.error("Referensi elemen tidak valid");
    }
  };
  

  return (
    <div className="container mt-5">
      {/* Desktop View */}
      <div className="card shadow-lg mb-5 d-none d-sm-block">
        <div className="card-header d-flex align-items-center">
          <h1 className="h5 mb-0">DETAIL USER</h1>
        </div>
        <div className="card-body">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th scope="col">Foto</th>
                <th scope="col">Nama</th>
                <th scope="col">Role</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col">Kehadiran Bulan Ini</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    className="img-fluid rounded-circle"
                    style={{ width: "80px", height: "80px" }}
                    src={user.url}
                    alt="user photo"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.role.nama_role}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>
                <td>
                  {absenBulanIni.persentaseKehadiran}%
                  <Button
                    onClick={handleShowModal}
                    variant="primary"
                    size="sm"
                    style={{ marginLeft: "10px" }}
                  >
                    Detail
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="card shadow-lg mb-5 d-block d-sm-none">
        <div className="card-header">
          <div className="d-flex align-items-center text-decoration-none">
            <IoIosArrowBack className="me-2" />
            <span>DETAIL USER</span>
          </div>
        </div>
        <div className="card-body text-center">
          <img
            className="img-fluid rounded-circle mb-3"
            style={{ width: "100px", height: "100px" }}
            src={user.url}
            alt="user photo"
          />
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">{user.role.nama_role}</p>
          <div className="mt-3">
            <p className="mb-1">
              <strong>Email: </strong>
              {user.email}
            </p>
            <p className="mb-1">
              <strong>Kehadiran Bulan Ini: </strong>
              {absenBulanIni.persentaseKehadiran}%
            </p>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Kehadiran Bulan Ini</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={componentRef}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {absenBulanIni.history.map((absen, index) => (
                  <tr key={index}>
                    <td>{absen.tanggal}</td>
                    <td>{absen.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailUser;
