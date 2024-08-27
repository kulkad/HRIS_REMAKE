"use client";

// Import modul node
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Gunakan usePathname dari next/navigation
import axios from "axios"; // Jangan lupa import axios jika belum

// Import file scss tema
import "styles/theme.scss";

// Import sub komponen
import NavbarVertical from "/layouts/navbars/NavbarVertical";
import NavbarTop from "/layouts/navbars/NavbarTop";

export default function DashboardLayout({ children }) {
  const pathname = usePathname(); // Dapatkan path saat ini
  const [data, setData] = useState({});
  const [user, setUser] = useState([]); // State untuk menyimpan data pengguna
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [isPageExcluded, setIsPageExcluded] = useState(false); // State untuk mengelola halaman yang dikecualikan

  const ToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Fetch settings dari API
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

  // Cek apakah halaman saat ini termasuk dalam halaman yang dikecualikan
  useEffect(() => {
    const excludedPaths = [
      "/pages/absen/geolocation",
      "/pages/settings",
      "/pages/surat",
      "/pages/user/detailuser"
    ];

    const isExcluded = excludedPaths.some((path) =>
      pathname.startsWith(path)
    );
    setIsPageExcluded(isExcluded);
  }, [pathname]);

  // Cek data pengguna dari localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      // Jika tidak ada data pengguna, arahkan ke halaman login
      window.location.href = "http://localhost:3000/authentication/login";
    } else {
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
        setUser(parsedUserData);
        console.log(parsedUserData);
      }
    }
  }, []);

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
          hidden={isPageExcluded} // Sembunyikan div berdasarkan pengecualian halaman
        ></div>
        {children}
      </div>
    </div>
  );
}
