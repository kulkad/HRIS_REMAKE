"use client";

// import node module libraries
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Menu } from 'react-feather';
import Link from 'next/link';
import { Nav, Navbar } from 'react-bootstrap';
// import sub components
import QuickMenu from 'layouts/QuickMenu';
import { API_Backend } from "../../app/api/hello";

const NavbarTop = (props) => {
	// Untuk mengganti warna dari database
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${API_Backend}/settings/1`); // Ganti URL
                setData(response.data);
            } catch (error) {
                console.error("Error fetching Settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return (
        <Navbar
            expanded="lg"
            className="navbar-classic navbar navbar-expand-lg"
            style={{ backgroundColor: data.warna_primary}} // Apply the color here
        >
            <div className="d-flex justify-content-between w-100">
                <div className="d-flex align-items-center">
                    <Link
                        href="#"
                        id="nav-toggle"
                        className="nav-icon me-2 icon-xs"
                        onClick={() => props.data.SidebarToggleMenu(!props.data.showMenu)}>
                        <Menu size="18px" />
                    </Link>
                </div>
                {/* Quick Menu */}
                <Nav className="navbar-right-wrap ms-2 d-flex nav-top-wrap">
                    <QuickMenu />
                </Nav>
            </div>
        </Navbar>
    );
};

export default NavbarTop;
