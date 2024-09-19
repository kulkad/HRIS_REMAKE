'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Impor axios untuk memanggil backend
import { API_Backend } from "../../../api/hello.js";

const Logout = () => {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Memanggil fungsi logout dari backend
        await axios.delete(`${API_Backend}/logout`);
        
        // Menghapus data user dari localStorage
        localStorage.removeItem("user");

        // Menunggu animasi selesai sebelum redirect
        setTimeout(() => {
          setShowAnimation(false);
          // Redirect ke halaman login
          router.push("/authentication/login");
        }, 2000); // 2 detik untuk animasi
      } catch (error) {
        console.error("Error saat logout:", error);
      }
    };

    logoutUser();

    return () => clearTimeout();
  }, [router]);

  return (
    showAnimation && (
      <div style={styles.container}>
        <h1 style={styles.text}>Logging Out...</h1>
        <div style={styles.spinner}></div>
      </div>
    )
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    animation: 'fadeOut 2s forwards'
  },
  text: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#000'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 2s linear infinite'
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  '@keyframes fadeOut': {
    '0%': { opacity: 1 },
    '100%': { opacity: 0 }
  }
};

export default Logout;
