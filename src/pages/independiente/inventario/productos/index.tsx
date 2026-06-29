import { useNavigate } from "react-router-dom";
import { useEffect } from "react";  


export default function Productos() {

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
        <h2>Productos</h2>
      </div>
    );
  }

  return null;
}

