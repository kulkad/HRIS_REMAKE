"use client";

// Import modul node
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Gunakan usePathname dari next/navigation
import axios from "axios"; // Jangan lupa import axios jika belum
import { API_Frontend, API_Backend } from "../api/hello.js";

// Import file scss tema
import "styles/theme.scss";

// Import sub komponen
import NavbarVertical from "/layouts/navbars/NavbarVertical";
import NavbarTop from "/layouts/navbars/NavbarTop";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export default function DashboardLayout({ children }) {
    const pathname = usePathname(); // Dapatkan path saat ini
    const [data, setData] = useState({});
    const [user, setUser] = useState(null); // Ubah ke `null` agar lebih mudah dalam pengecekan login
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(true);
    const [isPageExcluded, setIsPageExcluded] = useState(false); // State untuk mengelola halaman yang dikecualikan

    const ToggleMenu = () => {
        setShowMenu(!showMenu);
    };

    // Fetch settings dari API
    const fetchSettings = async() => {
        try {
            const response = await axios.get(`${API_Backend}/settings/1`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching Settings:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cek apakah halaman saat ini termasuk dalam halaman yang dikecualikan
    useEffect(() => {
        const userData = localStorage.getItem("user");

        if (!userData) {
            // Jika tidak ada data pengguna, arahkan ke halaman login
            window.location.href = `${API_Frontend}/authentication/login`;
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
                    `${API_Frontend}/dashboard_rumah/geolocation`;
            } else {
                setUser(parsedUserData);
                // console.log(parsedUserData);
            }
        }
        
        const excludedPaths = [
            "/pages/absen/geolocation",
            "/pages/settings",
            "/pages/surat",
            "/pages/user/detailuser",
            "/pages/user/register",
        ];

        const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));
        setIsPageExcluded(isExcluded);

        // Hanya fetch settings jika user terautentikasi
        if (userData) {
            fetchSettings();
        }
    }, [pathname]);

    // Jika loading atau tidak ada user yang terautentikasi, hanya render children tanpa sidebar atau bagian berwarna
    if (loading || !user) {
        return (
            <div className="container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
                <Skeleton height={40} count={1} className="mb-4" />
                <Skeleton height={20} count={1} className="mb-4" />
                <Skeleton height={20} count={1} className="mb-4" />
                <Skeleton height={50} width={150} className="mb-4" />
                <Skeleton height={50} width={150} className="mb-4" />
            </div>
        );
    }

    return (
        <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
            {/* Sidebar hanya ditampilkan jika user terautentikasi */}
            {user && (
                <div className="navbar-vertical navbar" style={{ backgroundColor: data.warna_sidebar }}>
                    <NavbarVertical showMenu={showMenu} onClick={(value) => setShowMenu(value)} />
                </div>
            )}
            <div id="page-content">
                <div className="header">
                    <NavbarTop data={{ showMenu: showMenu, SidebarToggleMenu: ToggleMenu }} />
                </div>
                
                {/* Bagian yang diberi warna dari data hanya ditampilkan jika user terautentikasi */}
                <div
                    className="pt-10 pb-21"
                    style={{ backgroundColor: data.warna_secondary }}
                    hidden={isPageExcluded}
                />
                
                {children}
            </div>
        </div>
    );
}
