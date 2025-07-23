import type { JSX } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userData = localStorage.getItem("user")
  const user = userData ? JSON.parse(userData) : null

  // Aquí cambiamos por tu correo o ID único
  const esAdmin = user && user.email === "admin@tucorreo.com"

  return esAdmin ? children : <Navigate to="/login" />
}

export default ProtectedRoute
