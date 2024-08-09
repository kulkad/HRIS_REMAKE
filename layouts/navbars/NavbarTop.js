"use client"
// import node module libraries
import React, { useState, useEffect } from 'react';
import { Menu } from 'react-feather';
import Link from 'next/link';
import {
	Nav,
	Navbar,
	Form
} from 'react-bootstrap';
// import sub components
import QuickMenu from 'layouts/QuickMenu';
import axios from "axios";


const NavbarTop = (props) => {
	const [data, setData] = useState([]);
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
	return (
		<Navbar expanded="lg" className="navbar-classic navbar navbar-expand-lg">
			<div className='d-flex justify-content-between w-100'>
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
