  import { useNavigate } from "react-router-dom";
  import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const permiso = true;

  useEffect(() => {
    if (permiso) {
      navigate("/catalogos");
    }
  }, [permiso, navigate]);

  if (!permiso) {
    return (
      <div>
        <h2>Login</h2>
      </div>
    );
  }

  return null;
}