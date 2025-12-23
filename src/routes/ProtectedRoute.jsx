import { Navigate } from "react-router"
import storeAuth from "../context/storeAuth"

const ProtectedRoute = ({ children }) => {

    const { token, validateToken } = storeAuth(state => ({ 
        token: state.token,
        validateToken: state.validateToken
    }))
    
    // Validar token antes de permitir acceso
    if (token) {
        validateToken()
    }
    
    return token ?  children  : <Navigate to="/login" replace />
}

export default ProtectedRoute

