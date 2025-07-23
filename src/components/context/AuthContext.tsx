import { createContext, useContext, useEffect, useState } from "react"

interface Usuario {
  email: string
  role?: string
  [key: string]: any
}

interface AuthContextType {
  usuario: Usuario | null
  tengoPermiso: () => boolean
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  tengoPermiso: () => false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    setUsuario(user)
  }, [])

  const tengoPermiso = () => {
    // Puedes personalizar esta condición (por email o rol)
    return usuario?.email === "fernando@email.com"
  }

  return (
    <AuthContext.Provider value={{ usuario, tengoPermiso }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
// ---------------------------------