import "./index.css";
import { useDashboardScript } from "./script";

export default function Dashboard() {
  const { permiso, fullName, cards } = useDashboardScript();

  if (!permiso) {
    return null;
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-hero">
          <p className="dashboard-hero__eyebrow">Panel principal</p>
          <h1 className="dashboard-hero__title">Bienvenido, {fullName}</h1>
          <p className="dashboard-hero__description">
            Tu sesion esta activa y la informacion basica del usuario se conserva
            en almacenamiento local para reutilizarla entre vistas sin volver a
            consultar el perfil en cada cambio de pantalla.
          </p>
        </div>

        <div className="dashboard-grid">
          {cards.map((card) => (
            <article className="dashboard-card" key={card.label}>
              <p className="dashboard-card__label">{card.label}</p>
              <strong className="dashboard-card__value">{card.value}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

