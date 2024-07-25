'use client';

import { FaChevronRight } from 'react-icons/fa';
import { FiEdit3 } from 'react-icons/fi';
import { IoLogOutOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useEffect } from 'react';
import { LiaUserCircleSolid } from 'react-icons/lia';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Profile() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
    });
  }, []);

  const menuItems = [
    { icon: LiaUserCircleSolid, text: 'Detail Akun', link: '/detailuser' },
    { icon: FiEdit3, text: 'Edit Foto Profile', link: '/edit-potoprofile' },
    { icon: IoLogOutOutline, text: 'Logout', link: '/logout' },
  ];

  return (
    <div className="container mt-5" data-aos="fade-down">
      <div className="card shadow">
        <div className="card-header d-flex align-items-center">
        </div>
        <div className="card-body">
          <h2 className="h6 mb-4">Akun</h2>
          <ul className="list-group list-group-flush">
            {menuItems.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <Link href={item.link || '#'} passHref>
                  <div className="d-flex align-items-center text-decoration-none">
                    <item.icon className="me-3" size={24} />
                    <span>{item.text}</span>
                  </div>
                </Link>
                <FaChevronRight className="text-muted" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
