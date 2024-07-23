"use client";

import { FaTags, FaChevronRight } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { LiaUserCircleSolid } from "react-icons/lia";
import { MdAccountCircle } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Profile() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
    });
  }, []);

  const menuItems = [
    { icon: LiaUserCircleSolid, text: "Detail Akun", link: "/detailuser" },
    { icon: FiEdit3, text: "Edit Foto Profile", link: "/edit-potoprofile" },
    { icon: IoLogOutOutline, text: "Logout", link: "/logout" },
  ];

  return (
    <div
      className="w-full dark:bg-slate-900 dark:text-white max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
      data-aos="fade-down"
    >
      <div className="p-4 border-b flex items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <IoIosArrowBack className="mr-1" />
            <h1 className="text-xl font-semibold">Profilku</h1>
          </div>
        </Link>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Akun</h2>
        <ul className="space-y-4 dark:text-white">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.link || "#"} passHref>
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <item.icon className="text-2xl text-gray-700 dark:text-white" />
                    <div>
                      <p className="font-semibold">{item.text}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {!item.new && <FaChevronRight className="text-gray-400" />}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
