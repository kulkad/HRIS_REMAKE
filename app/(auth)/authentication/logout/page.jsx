'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Logout = () => {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Clear user data from local storage
    localStorage.removeItem("user");

    // Set timeout for animation
    const timer = setTimeout(() => {
      setShowAnimation(false);
      // Redirect to login page
      router.push("/authentication/login");
    }, 2000); // 2 seconds for animation

    return () => clearTimeout(timer);
  }, [router]);

  return (
    showAnimation && (
      <div style={styles.container}>
        <h1 style={styles.text}>Logging Out...</h1>
        <div style={styles.spinner}></div>
      </div>
    )
  );
}

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
