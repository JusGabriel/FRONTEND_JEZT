import storeAuth from '../context/storeAuth';
import { Forbidden } from '../pages/Forbidden';
import { jwtDecode } from 'jwt-decode';

export default function PrivateRouteWithRole({ children, allowedRoles = [] }) {
    const token = storeAuth.getState().token;
    let rol = null;
    if (token) {
        try {
            rol = jwtDecode(token).rol;
        } catch (e) {
            rol = null;
        }
    }
    // Si no está permitido, mostrar Forbidden
    if (!rol || (allowedRoles.length > 0 && !allowedRoles.includes(rol))) {
        return <Forbidden />;
    }
    return children;
}