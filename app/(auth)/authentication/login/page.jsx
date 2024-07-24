"use client";

import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password !== confPassword) {
      return setError("Password dan Konfirmasi Password Tidak Cocok");
    }

    try {
      const response = await axios.post("http://localhost:5001/login", {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      window.location.href = "http://localhost:3000/";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Terjadi kesalahan");
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
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <MdEmail />
                    </span>
                  </div>
                  <Form.Control
                    type="email"
                    placeholder="Enter address here"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                  </div>
                  <Form.Control
                    type="password"
                    placeholder="**************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="confPassword">
                <Form.Label>Konfirmasi Password</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                  </div>
                  <Form.Control
                    type="password"
                    placeholder="Confirmation password"
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                    required
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
};

export default Login;
