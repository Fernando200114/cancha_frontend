// src/components/Loading.tsx
import Spinner from "react-bootstrap/Spinner";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
      <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
