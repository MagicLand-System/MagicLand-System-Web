import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { setUser, removeUser } from '../store/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../store/selectors';

const AuthRoutes = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    let role = useSelector(userSelector).role;

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.accessToken) {
        if (!role) {
            const auth = jwtDecode(user.accessToken);
            const role = auth.role;
            dispatch(setUser({ role }));
        }
        else {
            return <Outlet />;
        }
    } else {
        localStorage.clear();
        dispatch(removeUser({ role }));
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

};
export default AuthRoutes;