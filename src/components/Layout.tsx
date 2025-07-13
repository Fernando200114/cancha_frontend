import type React from "react"
import Navbar from "./NavBar"
import Footer from "./Footer"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <main style={{ paddingTop: "76px" }}>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
