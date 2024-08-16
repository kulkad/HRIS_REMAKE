// Masih coba coba
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withRole = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const router = useRouter();
    const user = JSON.parse(localStorage.getItem('user')); // Mengambil data pengguna dari localStorage

    useEffect(() => {
      if (!user || !allowedRoles.includes(user.roleId)) {
        // Redirect atau tampilkan pesan error jika pengguna tidak memiliki peran yang sesuai
        router.push('/not-authorized');
      }
    }, [user, allowedRoles, router]);

    return user && allowedRoles.includes(user.roleId) ? <WrappedComponent {...props} /> : null;
  };
};

export default withRole;
