import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { fetchUser } from '../store/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../store/selectors';

const AuthRoutes = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    let user = useSelector(userSelector);

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        if (!user) {
            dispatch(fetchUser());
        }
        return <Outlet />;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

};
export default AuthRoutes;