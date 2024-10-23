'use client';

import 'styles/theme.scss';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { API_Backend } from './api/hello';

function RootLayout({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_Backend}/surats/1`);
        setData(response.data);
        // console.log(response.data);
        // Mengubah judul halaman secara dinamis
        document.title = response.data.nama_perusahaan || 'Default Title';
        
        // Mengubah favicon secara dinamis
        if (response.data.url) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = response.data.url;  // Pastikan ini adalah URL lengkap ke gambar logo
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      } catch (error) {
        console.error("Error fetching Settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Memaksa re-render saat data berubah
  useEffect(() => {
    router.refresh();
  }, [data, router]);

  return (
    <html lang="en">
      <head>
        {/* Favicon default akan di-override oleh kode JavaScript di atas */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className='bg-light'>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;