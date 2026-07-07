import { useEffect, useState } from "react";
import "./index.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import ComputerIcon from "@mui/icons-material/Computer";
import LanguageIcon from "@mui/icons-material/Language";
import LaptopWindowsIcon from "@mui/icons-material/LaptopWindows";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { useLoginBackgroundMotion, useLoginScript } from "./script";

const LOGIN_VIEW_SWAP_MS = 960;
const LOGIN_VIEW_TRANSITION_MS = 2200;

function getDeviceIcon(dispositivo: string | null, tipoDispositivo?: string | null) {
  const deviceName = `${dispositivo || ""} ${tipoDispositivo || ""}`.toLowerCase();

  if (deviceName.includes("movil") || deviceName.includes("mobile")) {
    return <PhoneIphoneIcon fontSize="small" />;
  }

  return <ComputerIcon fontSize="small" />;
}

function getDeviceLabel(dispositivo: string | null, tipoDispositivo?: string | null) {
  const deviceName = `${dispositivo || ""} ${tipoDispositivo || ""}`.toLowerCase();

  if (deviceName.includes("movil") || deviceName.includes("mobile")) {
    return "Movil";
  }

  if (deviceName.includes("pc") || deviceName.includes("ordenador") || deviceName.includes("desktop")) {
    return "Ordenador";
  }

  return dispositivo || "Dispositivo";
}

function getOperatingSystemIcon(sistemaOperativo: string | null) {
  const systemName = (sistemaOperativo || "").toLowerCase();

  if (systemName.includes("android")) {
    return <AndroidIcon fontSize="inherit" />;
  }

  if (systemName.includes("ios") || systemName.includes("mac")) {
    return <AppleIcon fontSize="inherit" />;
  }

  if (systemName.includes("windows")) {
    return <LaptopWindowsIcon fontSize="inherit" />;
  }

  return <ComputerIcon fontSize="inherit" />;
}

export default function Login() {
  const {
    loginPageRef,
    motionAvailable,
    motionPermissionRequired,
    motionEnabled,
    enableMotion,
  } = useLoginBackgroundMotion();
  const {
    permiso,
    credentials,
    loading,
    message,
    error,
    activeSessions,
    closingSessionId,
    sessionSelectorLocked,
    handleChange,
    handleIngresar,
    handleCerrarSesionActiva,
    handleVolverALogin,
  } = useLoginScript();

  const showSessionSelector = activeSessions.length > 0 || sessionSelectorLocked;
  const [sessionSelectorVisible, setSessionSelectorVisible] = useState(showSessionSelector);
  const [viewTransitioning, setViewTransitioning] = useState(false);
  const [sessionContentReady, setSessionContentReady] = useState(showSessionSelector);
  const [cachedActiveSessions, setCachedActiveSessions] = useState(activeSessions);

  useEffect(() => {
    if (activeSessions.length === 0) {
      return;
    }

    setCachedActiveSessions(activeSessions);
  }, [activeSessions]);

  useEffect(() => {
    if (showSessionSelector === sessionSelectorVisible) {
      return;
    }

    setViewTransitioning(true);

    if (showSessionSelector) {
      setSessionContentReady(false);
    }

    const swapTimerId = window.setTimeout(() => {
      setSessionSelectorVisible(showSessionSelector);
    }, LOGIN_VIEW_SWAP_MS);

    const contentReadyTimerId = window.setTimeout(() => {
      setSessionContentReady(showSessionSelector);
    }, LOGIN_VIEW_TRANSITION_MS);

    const completeTimerId = window.setTimeout(() => {
      setViewTransitioning(false);
    }, LOGIN_VIEW_TRANSITION_MS);

    return () => {
      window.clearTimeout(swapTimerId);
      window.clearTimeout(contentReadyTimerId);
      window.clearTimeout(completeTimerId);
    };
  }, [showSessionSelector]);

  const sessionsToRender = activeSessions.length > 0 ? activeSessions : cachedActiveSessions;

  if (!permiso) {
    return (
      <main className="login-page" ref={loginPageRef}>
        <section
          className={`login-panel ${sessionSelectorVisible ? "login-panel--sessions" : ""} ${viewTransitioning ? "login-panel--switching" : ""}`}
        >
          {!sessionSelectorVisible ? (
            <div className="login-brand">
              <span className="login-badge">Valian</span>
              <h1>Acceso al sistema</h1>
              <p>
                Ingresa con tus credenciales para continuar a los modulos
                administrativos.
              </p>

              <ul className="login-highlights">
                <li>Acceso centralizado a modulos administrativos.</li>
                <li>Persistencia local del token de sesion.</li>
                <li>Gestion visual de sesiones activas cuando se alcance el limite.</li>
              </ul>

              {motionAvailable && !motionEnabled ? (
                <button
                  type="button"
                  className="login-motion-button"
                  onClick={enableMotion}
                >
                  {motionPermissionRequired
                    ? "Activar fondo dinamico con giroscopio"
                    : "Encender fondo dinamico"}
                </button>
              ) : null}
            </div>
          ) : null}

          <form className="login-form" onSubmit={handleIngresar}>
            {message ? <p className="login-message login-message--success">{message}</p> : null}
            {error && !showSessionSelector ? (
              <p className="login-message login-message--error">{error}</p>
            ) : null}

            <div className={`login-form__body ${viewTransitioning ? "login-form__body--switching" : ""}`}>
            {sessionSelectorVisible ? (
              <section
                className={`login-sessions ${sessionContentReady ? "login-sessions--ready" : "login-sessions--staging"}`}
              >
                <div className="login-sessions__toolbar">
                  <button
                    type="button"
                    className="login-sessions__back"
                    onClick={handleVolverALogin}
                    aria-label="Regresar al formulario de login"
                    title="Regresar al formulario de login"
                  >
                    <ArrowBackIcon fontSize="small" />
                  </button>
                </div>

                <div className="login-sessions__header">
                  <h2>Selecciona una sesion para cerrarla</h2>
                  <p className={sessionContentReady ? "" : "login-sessions__copy--hidden"}>
                    {error ||
                      "Tus sesiones activas ya alcanzaron el limite permitido. Cierra una para liberar acceso y continuar con este ingreso."}
                  </p>
                  {motionAvailable && !motionEnabled ? (
                    <button
                      type="button"
                      className="login-motion-button login-motion-button--light"
                      onClick={enableMotion}
                    >
                      {motionPermissionRequired
                        ? "Activar fondo dinamico con giroscopio"
                        : "Encender fondo dinamico"}
                    </button>
                  ) : null}
                </div>

                <div className={`login-sessions__list ${sessionContentReady ? "" : "login-sessions__list--hidden"}`}>
                  {sessionsToRender.map((session) => (
                    <article className="login-session-card" key={session.id}>
                      <div className="login-session-card__avatar">
                        {getDeviceIcon(session.dispositivo, session.tipoDispositivo)}
                      </div>

                      <div className="login-session-card__content">
                        <div className="login-session-card__topline">
                          <strong>{getDeviceLabel(session.dispositivo, session.tipoDispositivo)}</strong>
                          <span>{session.sessionStart}</span>
                        </div>

                        {session.navegador ? (
                          <p className="login-session-card__meta login-session-card__meta--browser">
                            <LanguageIcon fontSize="inherit" />
                            <span>{session.navegador}</span>
                          </p>
                        ) : null}

                        {session.sistemaOperativo ? (
                          <p className="login-session-card__meta">
                            {getOperatingSystemIcon(session.sistemaOperativo)}
                            <span>{session.sistemaOperativo}</span>
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        className={`login-session-card__button ${closingSessionId === session.id ? "login-session-card__button--closing" : ""}`}
                        aria-label="Cerrar sesion activa"
                        title="Cerrar sesion activa"
                        disabled={closingSessionId === session.id}
                        onClick={() => handleCerrarSesionActiva(session.id)}
                      >
                        {closingSessionId === session.id
                          ? <span className="login-session-card__loader" />
                          : <LogoutIcon fontSize="small" />}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <div className="login-form__view login-form__view--active">
                <div className="login-form__fields">
                  <label className="login-field">
                    <span>Usuario</span>
                    <input
                      type="text"
                      name="usuario"
                      value={credentials.usuario}
                      onChange={handleChange}
                      placeholder="Ingresa tu usuario"
                      autoComplete="username"
                    />
                  </label>

                  <label className="login-field">
                    <span>Contrasena</span>
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Ingresa tu contrasena"
                      autoComplete="current-password"
                    />
                  </label>

                  <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                  >
                    {loading ? "Ingresando..." : "Ingresar"}
                  </button>
                </div>
              </div>
            )}
            </div>
          </form>
        </section>
      </main>
    );
  }

  return null;
}