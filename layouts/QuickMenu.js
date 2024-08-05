import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import { IoMdImage } from "react-icons/io";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import { useMediaQuery } from 'react-responsive';
import {
    Image,
    Dropdown as BootstrapDropdown,
    ListGroup,
} from 'react-bootstrap';
import useMounted from 'hooks/useMounted';

const QuickMenu = () => {
    const hasMounted = useMounted();
    const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = () => {
            const userData = localStorage.getItem("user");
            if (userData) {
                setUser(JSON.parse(userData));
            }   
            setLoading(false);
        };

        fetchUserData();

        const handleStorageChange = () => {
            fetchUserData();
            setProfileImageUrl(getProfileImageUrl()); // Update profile image URL on storage change
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Update photo URL to ensure fresh data
    const getProfileImageUrl = () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            return parsedUser.url ? `${parsedUser.url}?t=${new Date().getTime()}` : '/images/assets/gmt-ultra-full-extra-hd.png';
        }
        return '/images/assets/gmt-ultra-full-extra-hd.png';
    };

    const [profileImageUrl, setProfileImageUrl] = useState(getProfileImageUrl());

    useEffect(() => {
        const updateProfileImage = () => {
            setProfileImageUrl(getProfileImageUrl());
        };

        // Simulate fetching user data every few seconds
        const intervalId = setInterval(updateProfileImage, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleEditModalOpen = () => {
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    if (loading) {
        return (
            <div role="status">
                <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <Link href="/authentication/login">
                    <button style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>
                        Login
                    </button>
                </Link>
            </div>
        );
    }

    const QuickMenuDesktop = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <BootstrapDropdown as="li" className="ms-2">
                    <BootstrapDropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser"
                        onClick={toggleProfile}
                    >
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="avatar" src={profileImageUrl} className="rounded-circle" />
                        </div>
                    </BootstrapDropdown.Toggle>
                    <BootstrapDropdown.Menu
                        className="dropdown-menu dropdown-menu-end"
                        align="end"
                        aria-labelledby="dropdownUser"
                        show={isProfileOpen}
                    >
                        <BootstrapDropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 d-flex align-items-center">
                                <Image alt="avatar" src={profileImageUrl} className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />
                                <h5 className="mb-1">
                                {user?.name}</h5>
                            </div>
                                <Link href="/pages/user/detailuser" className="text-inherit fs-6 mt-4 text-center">Lihat Profile Saya</Link>
                            <div className=" dropdown-divider mt-2 mb-2"></div>
                        </BootstrapDropdown.Item>
                        <BootstrapDropdown.Item eventKey="2">
                            <a className="text-inherit fs-6" onClick={handleEditModalOpen} style={{ cursor: 'pointer' }}>
                                <i className="fe fe-user me-2"></i> Edit Photo Profile
                            </a>
                        </BootstrapDropdown.Item>
                        <BootstrapDropdown.Item>
                            <Link href="/authentication/logout" className="text-inherit fs-6">
                                <i className="fe fe-power me-2"></i>Log Out</Link>
                        </BootstrapDropdown.Item>
                    </BootstrapDropdown.Menu>
                </BootstrapDropdown>
            </ListGroup>
        );
    };

    const QuickMenuMobile = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <BootstrapDropdown as="li" className="ms-2">
                    <BootstrapDropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser"
                        onClick={toggleProfile}
                    >
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="avatar" src={profileImageUrl} className="rounded-circle" />
                        </div>
                    </BootstrapDropdown.Toggle>
                    <BootstrapDropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser"
                        show={isProfileOpen}
                    >
                        <BootstrapDropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 d-flex align-items-center">
                                <Image alt="avatar" src={profileImageUrl} className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />
                                <h5 className="mb-1">{user?.name || 'John Doe'}</h5>
                            </div>
                            <Link href="/pages/user/detailuser" className="text-inherit fs-6 mt-1">View my profile</Link>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </BootstrapDropdown.Item>
                        <BootstrapDropdown.Item eventKey="2">
                            <a className="text-inherit fs-6" onClick={handleEditModalOpen} style={{ cursor: 'pointer' }}>
                                <i className="fe fe-user me-2"></i> Edit Photo Profile
                            </a>
                        </BootstrapDropdown.Item>
                        <BootstrapDropdown.Item>
                            <Link href="/authentication/logout" className="text-inherit fs-6">
                                <i className="fe fe-power me-2"></i>Log Out</Link>
                        </BootstrapDropdown.Item>
                    </BootstrapDropdown.Menu>
                </BootstrapDropdown>
            </ListGroup>
        );
    };

    return (
        <Fragment>
            {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
            <EditFotoProfile
                show={isEditModalOpen}
                onHide={handleEditModalClose}
                user={user}
            />
        </Fragment>
    );
};

const EditFotoProfile = ({ show, onHide, user }) => {
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (user) {
            setPreview(user.profilePicture);
        }
    }, [user]);

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    };

    const saveFotoProfile = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.patch(
                `http://localhost:5001/updateuser/${user.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setPreview(response.data.profilePicture);

            Swal.fire({
                title: "Berhasil!",
                text: "Foto profil berhasil diperbarui!",
                icon: "success"
            }).then(() => {
                window.location.href = "/";
            });
        } catch (error) {
            console.error("Error details:", error);
            if (error.response) {
                console.error("Server responded with a status:", error.response.status);
                console.error("Response data:", error.response.data);
            }
            alert("Gagal memperbarui foto profil. Silakan coba lagi.");
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Foto Profil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveFotoProfile}>
                    <Form.Group className="mb-3">
                        <Form.Label>Foto Profil</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <IoMdImage />
                            </span>
                            <Form.Control
                                id="user_avatar"
                                onChange={loadImage}
                                type="file"
                            />
                        </div>
                    </Form.Group>

                    {preview && (
                        <div className="text-center my-3">
                            <Image
                                src={preview}
                                alt="Preview Image"
                                className="img-thumbnail rounded-circle"
                                width={150}
                                height={150}
                            />
                        </div>
                    )}

                    <div className="text-center">
                        <Button type="submit" variant="success">
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default QuickMenu;