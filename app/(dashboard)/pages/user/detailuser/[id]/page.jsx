"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';

const DetailUser = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [absenBulanIni, setAbsenBulanIni] = useState({
    hadir: 0,
    tidakHadir: 0,
    persentaseKehadiran: 0
  });

  useEffect(() => {
    const fetchAbsenForDetail = async () => {
      try {
        const response = await axios.get("http://localhost:5001/absens");
        const allAttendanceData = response.data;

        // Filter data absensi untuk user tertentu
        const userAttendance = allAttendanceData.filter(absen => absen.userId === id);
        setData(userAttendance);

        // Hitung absensi bulan ini
        hitungAbsenBulanIni(userAttendance);
      } catch (error) {
        console.error("Error fetching absens:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchAbsenForDetail();
    fetchUserData();
  }, [id]);

  const hitungAbsenBulanIni = (dataAbsen) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    // Filter absensi berdasarkan bulan dan tahun ini
    const absenBulanIni = dataAbsen.filter((absen) => {
      const [year, month] = absen.tanggal.split("-");
      return parseInt(month) === currentMonth && parseInt(year) === currentYear;
    });

    let poin = 0;
    let totalAbsen = absenBulanIni.length;

    absenBulanIni.forEach((absen) => {
      if (absen.keterangan === "Hadir") {
        poin += 1;
      } else if (["Alpha", "Sakit", "Izin"].includes(absen.keterangan)) {
        poin -= 1;
      }
    });

    const persentaseKehadiran = totalAbsen > 0 ? ((poin / totalAbsen) * 100).toFixed(2) : 0;

    setAbsenBulanIni({
      hadir: absenBulanIni.filter(absen => absen.keterangan === "Hadir").length,
      tidakHadir: absenBulanIni.filter(absen => ["Alpha", "Sakit", "Izin"].includes(absen.keterangan)).length,
      persentaseKehadiran
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

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
                    style={{ width: '80px', height: '80px' }}
                    src={user.url}
                    alt="user photo"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.role.nama_role}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>
                <td>{absenBulanIni.persentaseKehadiran}%</td>
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
            style={{ width: '100px', height: '100px' }}
            src={user.url}
            alt="user photo"
          />
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">{user.role.nama_role}</p>
          <div className="mt-3">
            <p className="mb-1">
              <strong>Email: </strong>{user.email}
            </p>
            <p className="mb-1">
              <strong>Kehadiran Bulan Ini: </strong>{absenBulanIni.persentaseKehadiran}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;