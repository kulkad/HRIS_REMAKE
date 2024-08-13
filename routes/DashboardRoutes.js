import { v4 as uuid } from 'uuid';

import { BsPersonLinesFill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";
/**
 *  All Dashboard Routes
 *
 *  Understanding name/value pairs for Dashboard routes
 *
 *  Applicable for main/root/level 1 routes
 *  icon 		: String - It's only for main menu or you can consider 1st level menu item to specify icon name.
 *
 *  Applicable for main/root/level 1 and subitems routes
 * 	id 			: Number - You can use uuid() as value to generate unique ID using uuid library, you can also assign constant unique ID for react dynamic objects.
 *  title 		: String - If menu contains childern use title to provide main menu name.
 *  badge 		: String - (Optional - Default - '') If you specify badge value it will be displayed beside the menu title or menu item.
 * 	badgecolor 	: String - (Optional - Default - 'primary' ) - Used to specify badge background color.
 *
 *  Applicable for subitems / children items routes
 *  name 		: String - If it's menu item in which you are specifiying link, use name ( don't use title for that )
 *  children	: Array - Use to specify submenu items
 *
 *  Used to segrigate menu groups
 *  grouptitle : Boolean - (Optional - Default - false ) If you want to group menu items you can use grouptitle = true,
 *  ( Use title : value to specify group title  e.g. COMPONENTS , DOCUMENTATION that we did here. )
 *
 */

export const DashboardMenu = [{
        id: uuid(),
        title: 'Dashboard',
        icon: 'home',
        link: '/'
    },
    {
        id: uuid(),
        title: 'Bagian Absen',
        grouptitle: true
    },
    {
        id: uuid(),
        title: 'Absensi',
        icon: 'clock',
        children: [
            { id: uuid(), link: '/pages/absen/data-absensi', name: 'Data Absensi' },
            { id: uuid(), link: '/pages/absen/geolocation', name: 'Geolocation'}
        ]
    },

    {
        id: uuid(),
        title: 'Semua Pengguna',
        grouptitle: true
    },

    {
        id: uuid(),
        title: 'Data Pengguna',
        icon: <BsPersonLinesFill style={{ marginRight: '6px' }} />,
        link: '/pages/user/users'
    },
    {
        id: uuid(),
        title: 'Role',
        grouptitle: true
    },

    {
        id: uuid(),
        title: 'Role',
        icon: <FaUsers  style={{ marginRight: '6px' }} />,
        link: '/pages/roles'
    },
    {
        id: uuid(),
        title: 'alpha',
        grouptitle: true
    },

    {
        id: uuid(),
        title: 'Alpha',
        icon: <FaUserXmark  style={{ marginRight: '6px' }} />,
        link: '/pages/alpha'
    },
    {
        id: uuid(),
        title: 'hari libur',
        grouptitle: true
    },

    {
        id: uuid(),
        title: 'Hari Libur',
        icon: <FaUserXmark  style={{ marginRight: '6px' }} />,
        link: '/pages/hari-libur'
    },
    {
        id: uuid(),
        title: 'Settings',
        grouptitle: true
    },

    {
        id: uuid(),
        title: 'Settings',
        icon: <IoSettingsSharp  style={{ marginRight: '6px' }} />,
        link: '/pages/settings'
    },


];

// siu

export default DashboardMenu;