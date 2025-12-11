import { create } from "zustand"
import { persist } from "zustand/middleware"

// Decodificar JWT y obtener exp
const getTokenExpiration = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.exp * 1000 // convertir a milisegundos
    } catch {
        return null
    }
}

// Verificar si token expiró
const isTokenExpired = (token) => {
    const exp = getTokenExpiration(token)
    return !exp || Date.now() >= exp
}

const storeAuth = create(
    persist(
        
        set => ({
            token: null,
            rol: null,
            setToken: (token) => set({ token }),
            setRol: (rol) => set({ rol }),
            clearToken: () => set({ token: null, rol: null }),
            // Verificar y limpiar si expiró
            validateToken: () => {
                set(state => {
                    if (state.token && isTokenExpired(state.token)) {
                        return { token: null, rol: null }
                    }
                    return state
                })
            }
        }),

        { name: "auth-token" }
    
    )
)


export default storeAuth
