"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

const DetailUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "http://localhost:3000/login";
    } else {
      const parsedUserData = JSON.parse(userData);
      // Pastikan parsedUserData adalah array
      if (Array.isArray(parsedUserData)) {
        setUsers(parsedUserData);
      } else {
        // Jika bukan array, bungkus menjadi array
        setUsers([parsedUserData]);
      }
    }
  }, []);

  return (
    <div className="bg-white rounded-lg mx-4 p-4 text-xl dark:bg-slate-900 dark:text-white">
      {/* Tampilan Untuk Laptop */}
      <div className="relative overflow-x-auto hidden sm:block">
        <div className="flex items-center mb-4">
          <Link href="/profile">
            <div className="flex items-center cursor-pointer">
              <IoIosArrowBack className="mr-2" />
              <p className="font-semibold">DETAIL USER</p>
            </div>
          </Link>
        </div>
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-gray-900 uppercase dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Foto
              </th>
              <th scope="col" className="px-6 py-3">
                Nama
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white dark:bg-slate-900">
                <td className="px-6 py-4">
                  <Link href="/edit-potoprofile">
                    <img
                      className="w-24 h-18 cursor-pointer"
                      src={user.url}
                      alt="user photo"
                    />
                  </Link>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.role}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.email}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.gender}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tampilan Untuk Hp */}
      {users.map((user) => (
        <div
          key={user.id}
          className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 sm:hidden"
        >
          <div className="flex justify-start px-4 pt-4">
            <Link href="/profile">
              <li className="flex items-center py-3">
                <IoIosArrowBack className="mr-1" />
              </li>
            </Link>
          </div>
          <div className="flex flex-col items-center pb-10">
            <Link href="/edit-potoprofile">
              <img
                className="w-24 h-24 mb-3 rounded-full shadow-lg cursor-pointer"
                src={user.url}
                alt="Bonnie image"
              />
            </Link>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {user.name}
            </h5>
            <span className="text-lg text-gray-500 dark:text-gray-400">
              {user.role}
            </span>
            <div className="mt-4 md:mt-6">
              <div className="mb-5">
                <label className="font-semibold text-sm">Email : </label>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <label className="font-semibold text-sm">Gender :</label>
                <p className="font-semibold">{user.gender}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailUser;
