import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Perfiles() {
  const navigate = useNavigate();
  const permiso = false;

  useEffect(() => {
    if (permiso) {
      navigate("/login");
    }
  }, [permiso, navigate]);

  if (!permiso) {
    return (
      <div>
        <h2>Perfiles aqui</h2>
      </div>
    );
  }

  return null;
}