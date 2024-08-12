"use client";

// import node module libraries
import { useState, useEffect } from "react";	
import axios from "axios";  // Jangan lupa import axios jika belum

// import theme style scss file
import "styles/theme.scss";

// import sub components
import NavbarVertical from "/layouts/navbars/NavbarVertical";
import NavbarTop from "/layouts/navbars/NavbarTop";

export default function DashboardLayout({ children }) {
	
	// Untuk mengganti warna dari database
	const [data, setData] = useState({});
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
      <div className="navbar-vertical navbar" style={{ backgroundColor: data.warna_sidebar }}>
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
        {children}
      </div>
    </div>
  );
}
