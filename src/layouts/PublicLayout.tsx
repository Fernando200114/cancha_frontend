import { Outlet } from "react-router-dom";
import type { JSX } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export function PublicLayout(): JSX.Element {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-fill">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
