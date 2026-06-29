import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Accesos() {
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
        <h2>Accesos aqui</h2>
      </div>
    );
  }

  return null;
}