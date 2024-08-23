"use client";

// import node module libraries
import { useState, useEffect } from "react";
import axios from "axios"; // Jangan lupa import axios jika belum

// import theme style scss file
import "styles/theme.scss";

// import sub components
import NavbarVertical from "/layouts/navbars/NavbarVertical";
import NavbarTop from "/layouts/navbars/NavbarTop";

export default function DashboardLayout({ children }) {
  useEffect(() => {
    // Mengambil data pengguna dari localStorage
    const userData = localStorage.getItem("user");

    // Periksa apakah userData ada
    if (!userData) {
      // Jika tidak ada data pengguna, arahkan ke halaman login
      window.location.href = "http://localhost:3000/authentication/login";
    } else {
      // Parse data pengguna dari JSON string menjadi objek
      const parsedUserData = JSON.parse(userData);

      // Periksa nilai nama_role
      if (
        parsedUserData.nama_role !== "Admin" &&
        parsedUserData.nama_role !== "Manager" &&
        parsedUserData.nama_role !== "Karyawan"
      ) {
        // Jika nama_role tidak sesuai, arahkan ke halaman geolocation
        window.location.href =
          "http://localhost:3000/dashboard_rumah/geolocation";
      } else {
        // Jika nama_role sesuai, set user ke dalam state dan log data pengguna
        setUser(parsedUserData);
        console.log(parsedUserData);
      }
    }
  }, []);

  // Untuk mengganti warna dari database
  const [data, setData] = useState({});
  const [user, setUser] = useState([]); // State to store all users
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("http://localhost:5001/settings/1");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching Settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const [showMenu, setShowMenu] = useState(true);
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  return (
    <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
      <div
        className="navbar-vertical navbar"
        style={{ backgroundColor: data.warna_sidebar }}
      >
        <NavbarVertical
          showMenu={showMenu}
          onClick={(value) => setShowMenu(value)}
        />
      </div>
      <div id="page-content">
        <div className="header">
          <NavbarTop
            data={{
              showMenu: showMenu,
              SidebarToggleMenu: ToggleMenu,
            }}
          />
        </div>
        <div
        className="pt-10 pb-21"
        style={{ backgroundColor: data.warna_secondary }}
      >
      </div>
        {children}
      </div>
    </div>
  );
}
