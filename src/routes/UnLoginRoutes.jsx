import { useLocation, Outlet, Navigate } from 'react-router-dom';

const UnLoginRoutes = () => {
    const location = useLocation();

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return <Outlet />;
    } else {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

};
export default UnLoginRoutes;