import { useNavigate } from "react-router-dom";
import { useEffect } from "react";  


export default function Dashboard() {

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
        <h2>Dashboard aqui</h2>
      </div>
    );
  }

  return null;
}

