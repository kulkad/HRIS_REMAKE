"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Nav, Container } from "react-bootstrap";

const WebinarCard = () => {
  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="justify-content-center"
      >
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto fs-5">
              <Nav.Link
                href="/dashboard_rumah/geolocation"
                className="mx-3"
                
              >
                Geolocation
              </Nav.Link>
              <Nav.Link href="/dashboard_rumah/keterangan" className="mx-3" active>
                Keterangan
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    
      <section className="py-6">
        <div className="container">
          <div className="row">
            <div className="col-xxl-3 col-xl-4 col-lg-6">
              <div className="card mb-4 mb-xl-0 card-hover border">
                <div className="card-body">
                  <h3 className="mb-4 text-truncate">
                    <img src="/images/assets/gmt-ultra-full-extra-hd.png" className="img-fluid w-6 h-12 rounded-top-3 mb-4" layout="responsive"/>
                    <div className="text-inherit">Education Edition</div>
                  </h3>
                  <div className="mb-4">
                    <div className="mb-3 lh-1">
                      <span className="me-1">
                        <i className="bi bi-calendar-check"></i>
                      </span>
                      <span>Thu, November 10, 2023</span>
                    </div>
                    <div className="lh-1">
                      <span className="me-1">
                        <i className="bi bi-clock"></i>
                      </span>
                      <span>6:00 PM - 8:00 PM GMT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WebinarCard;