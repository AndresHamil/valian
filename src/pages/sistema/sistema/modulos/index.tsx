import { useNavigate } from "react-router-dom";
import { useEffect } from "react";  


export default function Modulos() {

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
        <h2>Modulos aqui</h2>
      </div>
    );
  }

  return null;
}

