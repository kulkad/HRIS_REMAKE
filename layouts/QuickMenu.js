// import node module libraries
import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Row,
    Col,
    Image,
    Dropdown as BootstrapDropdown,
    ListGroup,
} from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import data files
import NotificationList from 'data/Notification';

// import hooks
import useMounted from 'hooks/useMounted';

const QuickMenu = () => {
    const hasMounted = useMounted();
    const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });

    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    if (loading) {
        return <div role="status">
            <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
            <span className="sr-only">Loading...</span>
        </div>
    }

    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

    const QuickMenuDesktop = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <BootstrapDropdown as="li" className="stopevent">
                    <BootstrapDropdown.Menu
                        className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                        aria-labelledby="dropdownNotification"
                        align="end"
                        show
                    >
                    </BootstrapDropdown.Menu>
                </BootstrapDropdown>
                <BootstrapDropdown as="li" className="ms-2">
                    <BootstrapDropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser"
                    >
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="avatar" src={user?.avatar || '/images/avatar/avatar-1.jpg'} className="rounded-circle" />
                        </div>
                    </BootstrapDropdown.Toggle>
                    <BootstrapDropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser"
                        show
                    >
                        <BootstrapDropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1">{user?.name || 'John Doe'}</h5>
                                <Link href="/pages/user/detailuser" className="text-inherit fs-6">View my profile</Link>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </BootstrapDropdown.Item>
                        <BootstrapDropdown.Item eventKey="2">
                            <Link href="/pages/user/profile/edit-foto" className="text-inherit fs-6">
                                <i className="fe fe-user me-2"></i> Edit Photo Profile</Link>
                        </BootstrapDropdown.Item>
                        <BootstrapDropdown.Item>
                            <Link href="/authentication/logout" className="text-inherit fs-6">
                                <i className="fe fe-power me-2"></i>Log Out</Link>
                        </BootstrapDropdown.Item>
                    </BootstrapDropdown.Menu>
                </BootstrapDropdown>
            </ListGroup>
        )
    }

    const QuickMenuMobile = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <BootstrapDropdown as="li" className="ms-2">
                    <BootstrapDropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser"
                    >
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="avatar" src={user?.avatar || '/images/avatar/avatar-1.jpg'} className="rounded-circle" />
                        </div>
                    </BootstrapDropdown.Toggle>
                    <BootstrapDropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser"
                    >
                        <BootstrapDropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1">{user?.name || 'John Doe'}</h5>
                                <Link href="/pages/user/detailuser" className="text-inherit fs-6">View my profile</Link>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </BootstrapDropdown.Item>
                        <BootstrapDropdown.Item eventKey="2">
                            <Link href="/pages/user/profile/edit-foto" className="text-inherit fs-6">
                                <i className="fe fe-user me-2"></i> Edit Photo Profile</Link>
                        </BootstrapDropdown.Item>
                        <BootstrapDropdown.Item>
                            <Link href="/authentication/logout" className="text-inherit fs-6">
                                <i className="fe fe-power me-2"></i>Log Out</Link>
                        </BootstrapDropdown.Item>
                    </BootstrapDropdown.Menu>
                </BootstrapDropdown>
            </ListGroup>
        )
    }

    return (
        <Fragment>
            {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    )
}

export default QuickMenu;