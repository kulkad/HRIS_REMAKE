'use client'

// import node module libraries
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Head from 'next/head';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiCheckDoubleLine } from "react-icons/ri";
import { FiLock } from "react-icons/fi";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password !== confPassword) {
      return setError("Password dan Konfirmasi Password Tidak Cocok");
    }

    console.log("Data dikirim ke backend:", { email, password });

    try {
      const response = await axios.post("http://localhost:5001/login", {
        email,
        password,
      });
      console.log("Respons dari backend:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      router.push("/"); // Navigasi ke halaman utama setelah login
    } catch (err) {
      console.error("Kesalahan saat login:", err);
      if (err.response) {
        // Server respons, tetapi ada status kode di luar kisaran 2xx
        console.error("Respons kesalahan data:", err.response.data);
        console.error("Respons kesalahan status:", err.response.status);
        console.error("Respons kesalahan header:", err.response.headers);
        setError(err.response.data.msg || "Terjadi kesalahan dengan server");
      } else if (err.request) {
        // Permintaan dibuat tetapi tidak ada respons
        console.error("Permintaan yang dibuat tidak ada respons:", err.request);
        setError("Tidak ada respons dari server. Periksa koneksi jaringan Anda atau coba lagi nanti.");
      } else {
        // Sesuatu terjadi dalam pengaturan permintaan yang memicu kesalahan
        console.error("Error:", err.message);
        setError("Terjadi kesalahan saat mengatur permintaan. Silakan coba lagi.");
      }
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Head>
          <title>Login - HRIS CORPS</title>
        </Head>
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <h1>HRIS CORPS</h1>
              <p className="mb-6">Please enter your user information.</p>
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
    </Row>
  );
}

export default Login;