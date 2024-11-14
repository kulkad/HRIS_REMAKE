"use client";

import { Row, Col, Card, Form, Button } from "react-bootstrap";
import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "react-loading-skeleton/dist/skeleton.css";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiCheckDoubleLine } from "react-icons/ri";
import { FiLock } from "react-icons/fi";
import { API_Backend } from "../../../api/hello.js";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password !== confPassword) {
      return setError("Password dan Konfirmasi Password Tidak Cocok");
    }
    
    try {
      const response = await axios.post(`${API_Backend}/login`, {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
  );
      localStorage.setItem("user", JSON.stringify(response.data));

      const userRole = response.data.nama_role;

      if (userRole === "Admin" || userRole === "Manager" || userRole === "Karyawan") {
        router.push("/");
      } else {
        router.push("/dashboard_rumah/geolocation");
      }

    } catch (err) {
      console.error("Kesalahan saat login:", err.message);
      if (err.response) {
        console.error("Respons kesalahan data:", err.response.data);
        console.error("Respons kesalahan status:", err.response.status);
        console.error("Respons kesalahan header:", err.response.headers);
        setError(err.response.data.msg || "Terjadi kesalahan dengan server");
      } else if (err.request) {
        console.error("Permintaan yang dibuat tidak ada respons:", err.request);
        setError(
          "Tidak ada respons dari server. Periksa koneksi jaringan Anda atau coba lagi nanti."
        );
      } else {
        console.error("Error:", err.message);
        setError(
          "Terjadi kesalahan saat mengatur permintaan. Silakan coba lagi."
        );
      }
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      {isLoading ? (
       <div className="container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
       <Skeleton height={40} count={1} className="mb-4" />
       <Skeleton height={20} count={1} className="mb-4" />
       <Skeleton height={20} count={1} className="mb-4" />
       <Skeleton height={50} width={150} className="mb-4" />
       <Skeleton height={50} width={150} className="mb-4" />
     </div>
      ) : (
        <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
          <Head>
            <title>Login - HRIS CORPS</title>
          </Head>
          <Card className="smooth-shadow-md">
            <Card.Body className="p-6">
              <div className="mb-4">
                <h1>HRIS CORPS</h1>
                <p className="mb-6">Masukan informasi anda</p>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text d-flex align-items-center justify-content-center rounded">
                      <MdOutlineAlternateEmail />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter address here"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text d-flex align-items-center justify-content-center rounded">
                      <FiLock />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="**************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="confPassword">
                  <Form.Label>Konfirmasi Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text d-flex align-items-center justify-content-center rounded">
                      <RiCheckDoubleLine />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="**************"
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      required
                      className="rounded"
                    />
                  </div>
                </Form.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    animation: 'fadeIn 0.5s ease-in'
  },
  loadingText: {
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
    animation: 'spin 1s linear infinite'
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
  }
};

export default Login;
