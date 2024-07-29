import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SlOptionsVertical } from "react-icons/sl";

const DetailAbsen = () => {
  return (
    <div className="bg-white rounded-lg mx-4 p-4 text-xl">
      <div className="grid grid-cols-3 gap-4 flex">
        <p className="px-6 py-8 font-semibold">DETAIL DATA ABSEN</p>
        <div className="flex justify-end col-span-2 bg-white p-2 rounded-lg mb-2 dark:bg-gray-600">
          <div className="self-end">
            <div className="self-end items-center bg-green-400 hover:bg-green-6000 hover:text-gray-800 rounded-xl p-2">
              <Link href="/data-absensi">Back</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tampilan Untuk Laptop */}

      <div className="relative overflow-x-auto mt-5 border hidden sm:block">
        <table className="w-full text-sm text-left rtl:text-right border-collapse border border-gray-200 dark:border-gray-600">
          <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 border-b">
                Nama
              </th>
              <th scope="col" className="px-6 py-3 border-b">
                Role
              </th>
              <th scope="col" className="px-6 py-3 border-b">
                Waktu Masuk
              </th>
              <th scope="col" className="px-6 py-3 border-b">
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white dark:bg-gray-800">
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border-b"
              >
                Jahdan Paku Bumi
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 border-b">
                PKL
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 border-b">
                08.00
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 border-b">
                Tepat waktu
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tampilan untuk layar Hp */}
      <div class="relative overflow-x-auto w-full flex sm:hidden">
        <div class=" p-4 leading-normal">
          <div>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Ang Badarudin
            </h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              angbadarudin@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAbsen;
