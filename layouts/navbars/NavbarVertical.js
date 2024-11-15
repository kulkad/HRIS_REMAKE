"use client";
// import node module libraries
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Fragment, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { ListGroup, Card, Badge } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Skeleton from 'react-loading-skeleton';
import AccordionContext from "react-bootstrap/AccordionContext";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { API_Backend } from "../../app/api/hello";

// import simple bar scrolling used for notification item scrolling
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

// import routes file
import { DashboardMenu } from "routes/DashboardRoutes";

// Fungsi untuk menghitung luminance
const getLuminance = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

const NavbarVertical = (props) => {
  // Untuk mengganti warna dari database
  const [data, setData] = useState({});
  const [letter, setLetter] = useState({});
  const [loading, setLoading] = useState(true);
  const [textColor, setTextColor] = useState("#FFFFFF");

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_Backend}/settings/1`);
      setData(response.data);

      // Mengambil warna latar belakang dari API
      const backgroundColor = response.data.warna_sidebar;
      // Mengatur variabel CSS
      document.documentElement.style.setProperty(
        "--sidebar-bg-color",
        backgroundColor
      );

      // Menghitung luminance dari warna latar belakang
      const luminance = getLuminance(backgroundColor);
      const colorForTextColor = luminance > 0.5 ? "#000000" : "#FFFFFF";
      document.documentElement.style.setProperty('--sidebar-text-color', colorForTextColor);

      // Jika luminance rendah, gunakan teks putih, jika tinggi, gunakan teks hitam
      setTextColor(colorForTextColor);
    } catch (error) {
      console.error("Error fetching Settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLetter = async () => {
    try {
      const response = await axios.get(`${API_Backend}/surats/1`);
      setLetter(response.data);
    } catch (error) {
      console.error("Error fetching Settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchLetter();
  }, []);

  // Tambahkan tampilan loading di sini
  if (loading) {
    return (
      <div className="container bg-white dark:bg-slate-900 dark:text-white my-5 p-4 rounded shadow">
        <Skeleton height={40} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={20} count={1} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
        <Skeleton height={50} width={150} className="mb-4" />
      </div>
    );
  }

  const location = usePathname();
  const CustomToggle = ({ children, eventKey, icon }) => {
    const { activeEventKey } = useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );
    const isCurrentEventKey = activeEventKey === eventKey;
    return (
      <li className="nav-item">
        <Link
          href="#"
          className="nav-link"
          onClick={decoratedOnClick}
          data-bs-toggle="collapse"
          data-bs-target="#navDashboard"
          aria-expanded={isCurrentEventKey ? true : false}
          aria-controls="navDashboard"
        >
          {icon ? <i className={`nav-icon fe fe-${icon} me-2`}></i> : ""}{" "}
          {children}
        </Link>
      </li>
    );
  };
  const CustomToggleLevel2 = ({ children, eventKey, icon }) => {
    const { activeEventKey } = useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );
    const isCurrentEventKey = activeEventKey === eventKey;
    return (
      <Link
        href="#"
        className="nav-link "
        onClick={decoratedOnClick}
        data-bs-toggle="collapse"
        data-bs-target="#navDashboard"
        aria-expanded={isCurrentEventKey ? true : false}
        aria-controls="navDashboard"
      >
        {children}
      </Link>
    );
  };

  const generateLink = (item) => {
    return (
      <Link
        href={item.link}
        className={`nav-link ${location === item.link ? "active" : ""}`}
        onClick={(e) =>
          isMobile ? props.onClick(!props.showMenu) : props.showMenu
        }
      >
        {item.name}
        {""}
        {item.badge ? (
          <Badge
            className="ms-1"
            bg={item.badgecolor ? item.badgecolor : "primary"}
          >
            {item.badge}
          </Badge>
        ) : (
          ""
        )}
      </Link>
    );
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <Fragment>
      <SimpleBar style={{ maxHeight: "100vh" }}>
        <div className="nav-scroller">
          <Link href="/" className="navbar-brand">
            <p
              className="h4 fw-bold text-start"
              style={{ color: textColor }} // Set initial text color
              onMouseEnter={(e) => (e.currentTarget.style.color = textColor)} // Change color on hover
              onMouseLeave={(e) => (e.currentTarget.style.color = textColor)} // Revert color on leave
            >
              {letter.nama_perusahaan}
            </p>
          </Link>
        </div>
        {/* Dashboard Menu */}
        <Accordion
          defaultActiveKey="0"
          as="ul"
          className="navbar-nav flex-column"
        >
          {DashboardMenu.map((menu, index) => {
            if (menu.grouptitle) {
              return (
                <Card
                  bsPrefix="nav-item"
                  key={index}
                  style={{ color: textColor }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = textColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = textColor)
                  }
                >
                  <div
                    className="navbar-heading"
                    style={{ color: textColor }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = textColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = textColor)
                    }
                  >
                    {menu.title}
                  </div>
                </Card>
              );
            } else {
              if (menu.children) {
                return (
                  <Fragment key={index}>
                    <CustomToggle eventKey={index} icon={menu.icon}>
                      {menu.title}
                      {menu.badge && (
                        <Badge
                          className="ms-1"
                          bg={menu.badgecolor ? menu.badgecolor : "primary"}
                        >
                          {menu.badge}
                        </Badge>
                      )}
                    </CustomToggle>
                    <Accordion.Collapse
                      eventKey={index}
                      as="li"
                      bsPrefix="nav-item"
                    >
                      <ListGroup
                        as="ul"
                        bsPrefix=""
                        className="nav flex-column"
                      >
                        {menu.children.map(
                          (menuLevel1Item, menuLevel1Index) => (
                            <ListGroup.Item
                              as="li"
                              bsPrefix="nav-item"
                              key={menuLevel1Index}
                              className="nav-link-children" // Tambahkan class khusus untuk children
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "#FF0000")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color = textColor)
                              }
                            >
                              {generateLink(menuLevel1Item)}
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    </Accordion.Collapse>
                  </Fragment>
                );
              } else {
                return (
                  <Card bsPrefix="nav-item" key={index}>
                    <Link
                      href={menu.link}
                      className={`nav-link ${
                        location === menu.link ? "active" : ""
                      } ${
                        menu.title === "Download" ? "bg-primary text-white" : ""
                      }`}
                    >
                      {typeof menu.icon === "string" ? (
                        <i className={`nav-icon fe fe-${menu.icon} me-2`}></i>
                      ) : (
                        menu.icon
                      )}
                      {menu.title}
                      {menu.badge && (
                        <Badge
                          className="ms-1"
                          bg={menu.badgecolor ? menu.badgecolor : "primary"}
                        >
                          {menu.badge}
                        </Badge>
                      )}
                    </Link>
                  </Card>
                );
              }
            }
          })}
        </Accordion>
        {/* end of Dashboard Menu */}
      </SimpleBar>
    </Fragment>
  );
};

export default NavbarVertical;
