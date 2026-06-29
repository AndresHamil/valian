import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hasValidSession, saveSession } from "../../../session/auth";

type LoginCredentials = {
  usuario: string;
  password: string;
};

type ActiveSession = {
  id: string;
  dispositivo: string | null;
  navegador: string | null;
  sessionStart: string;
  sessionExpiry: string;
};

type LoginSuccessResponse = {
  success: true;
  message: string;
  error: null;
  data: Array<{
    usuario: {
      id: string;
      nombre: string;
      apellido: string;
      usuario: string;
      email: string;
      telefono: string;
      fechaRegistro: string;
      fechaActualizacion: string;
      estado: boolean;
      sesion: boolean;
    };
    sesion: {
      token: string;
    };
  }>;
};

type LoginErrorResponse = {
  success: false;
  message: string;
  error: string;
  data: ActiveSession[] | null;
};

type CloseSessionResponse = {
  success: boolean;
  message: string;
  error: string | null;
  data: Array<{
    idSesion: string;
    sesionCerrada: boolean;
    usuarioConSesionActiva: boolean;
  }> | null;
};

const LOGIN_URL = "/api/sesiones/iniciarSesion";
const CLOSE_SESSION_URL = "/api/sesiones/cerrarSesion";

const LOGIN_BACKGROUND_DEFAULTS = {
  primaryX: 18,
  primaryY: 12,
  primaryAlpha: 0.35,
  secondaryX: 82,
  secondaryY: 88,
  secondaryAlpha: 0.3,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function interpolate(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

function setLoginBackgroundPosition(
  element: HTMLElement,
  values: typeof LOGIN_BACKGROUND_DEFAULTS
) {
  element.style.setProperty("--login-glow-primary-x", `${values.primaryX}%`);
  element.style.setProperty("--login-glow-primary-y", `${values.primaryY}%`);
  element.style.setProperty("--login-glow-primary-alpha", `${values.primaryAlpha}`);
  element.style.setProperty("--login-glow-secondary-x", `${values.secondaryX}%`);
  element.style.setProperty("--login-glow-secondary-y", `${values.secondaryY}%`);
  element.style.setProperty("--login-glow-secondary-alpha", `${values.secondaryAlpha}`);
}

function detectDevice() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/android|iphone|ipad|mobile/.test(userAgent)) {
    return "Movil";
  }

  return "PC";
}

export function useLoginBackgroundMotion() {
  const loginPageRef = useRef<HTMLElement | null>(null);
  const cleanupMotionRef = useRef<(() => void) | null>(null);
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [motionPermissionRequired, setMotionPermissionRequired] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);

  const stopMotion = () => {
    cleanupMotionRef.current?.();
    cleanupMotionRef.current = null;
    setMotionEnabled(false);
  };

  const startMotion = () => {
    const element = loginPageRef.current;

    if (!element || cleanupMotionRef.current || typeof window === "undefined") {
      return;
    }

    let frameId = 0;
    let isAnimating = false;
    let currentValues = { ...LOGIN_BACKGROUND_DEFAULTS };
    let targetValues = { ...LOGIN_BACKGROUND_DEFAULTS };

    const animateBackground = () => {
      currentValues = {
        primaryX: interpolate(currentValues.primaryX, targetValues.primaryX, 0.12),
        primaryY: interpolate(currentValues.primaryY, targetValues.primaryY, 0.12),
        primaryAlpha: interpolate(currentValues.primaryAlpha, targetValues.primaryAlpha, 0.1),
        secondaryX: interpolate(currentValues.secondaryX, targetValues.secondaryX, 0.12),
        secondaryY: interpolate(currentValues.secondaryY, targetValues.secondaryY, 0.12),
        secondaryAlpha: interpolate(currentValues.secondaryAlpha, targetValues.secondaryAlpha, 0.1),
      };

      setLoginBackgroundPosition(element, currentValues);

      const isSettled =
        Math.abs(currentValues.primaryX - targetValues.primaryX) < 0.05 &&
        Math.abs(currentValues.primaryY - targetValues.primaryY) < 0.05 &&
        Math.abs(currentValues.primaryAlpha - targetValues.primaryAlpha) < 0.002 &&
        Math.abs(currentValues.secondaryX - targetValues.secondaryX) < 0.05 &&
        Math.abs(currentValues.secondaryY - targetValues.secondaryY) < 0.05 &&
        Math.abs(currentValues.secondaryAlpha - targetValues.secondaryAlpha) < 0.002;

      if (isSettled) {
        isAnimating = false;
        frameId = 0;
        return;
      }

      frameId = window.requestAnimationFrame(animateBackground);
    };

    const queueAnimation = () => {
      if (isAnimating) {
        return;
      }

      isAnimating = true;
      frameId = window.requestAnimationFrame(animateBackground);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null && event.gamma == null) {
        return;
      }

      const tiltX = clamp((event.gamma ?? 0) / 32, -1, 1);
      const tiltY = clamp((event.beta ?? 0) / 48, -1, 1);

      targetValues = {
        primaryX: 18 + tiltX * 8,
        primaryY: 12 + tiltY * 6,
        primaryAlpha: clamp(0.32 + (Math.abs(tiltX) + Math.abs(tiltY)) * 0.06, 0.32, 0.46),
        secondaryX: 82 - tiltX * 6,
        secondaryY: 88 - tiltY * 5,
        secondaryAlpha: clamp(0.28 + (Math.abs(tiltX) + Math.abs(tiltY)) * 0.04, 0.28, 0.38),
      };

      queueAnimation();
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    cleanupMotionRef.current = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("deviceorientation", handleOrientation, true);
      setLoginBackgroundPosition(element, LOGIN_BACKGROUND_DEFAULTS);
    };

    setMotionEnabled(true);
  };

  const enableMotion = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const OrientationEventWithPermission = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof OrientationEventWithPermission.requestPermission === "function") {
      const permission = await OrientationEventWithPermission.requestPermission();

      if (permission !== "granted") {
        return;
      }
    }

    setMotionPermissionRequired(false);
    startMotion();
  };

  useEffect(() => {
    const element = loginPageRef.current;

    if (!element) {
      return;
    }

    setLoginBackgroundPosition(element, LOGIN_BACKGROUND_DEFAULTS);

    if (typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileLike =
      window.matchMedia("(pointer: coarse)").matches || /android|iphone|ipad|mobile/i.test(navigator.userAgent);

    if (prefersReducedMotion || !isMobileLike || !("DeviceOrientationEvent" in window)) {
      return;
    }

    setMotionAvailable(true);

    const OrientationEventWithPermission = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof OrientationEventWithPermission.requestPermission === "function") {
      setMotionPermissionRequired(true);
      return () => {
        stopMotion();
      };
    }

    startMotion();

    return () => {
      stopMotion();
    };
  }, []);

  return {
    loginPageRef,
    motionAvailable,
    motionPermissionRequired,
    motionEnabled,
    enableMotion,
  };
}

export function useLoginScript() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    usuario: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [closingSessionId, setClosingSessionId] = useState<string | null>(null);
  const [sessionSelectorLocked, setSessionSelectorLocked] = useState(false);
  const permiso = hasValidSession();

  useEffect(() => {
    if (permiso) {
      navigate("/dashboard");
    }
  }, [permiso, navigate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const runLogin = async (
    loginCredentials: LoginCredentials,
    options?: { fromSessionClose?: boolean }
  ) => {
    if (!loginCredentials.usuario.trim() || !loginCredentials.password.trim()) {
      setMessage("");
      setError("Debes capturar usuario y contrasena.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    if (!options?.fromSessionClose) {
      setActiveSessions([]);
    }

    try {
      const response = await axios.post<LoginSuccessResponse | LoginErrorResponse>(
        LOGIN_URL,
        {
          ...loginCredentials,
          dispositivo: detectDevice(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const payload = response.data;

      if (payload.success) {
        const sessionData = payload.data[0];
        const token = sessionData?.sesion?.token;
        const user = sessionData?.usuario;

        setMessage(payload.message);

        if (!token || !user) {
          setError("La respuesta del servidor no incluye los datos de sesion esperados.");
          return;
        }

        if (!options?.fromSessionClose) {
          setSessionSelectorLocked(false);
        }

        saveSession(token, user);

        navigate("/dashboard");
        return;
      }

      setError(payload.message);
      setActiveSessions(Array.isArray(payload.data) ? payload.data : []);
      setSessionSelectorLocked(Array.isArray(payload.data) && payload.data.length > 0);
    } catch (requestError) {
      if (axios.isAxiosError<LoginErrorResponse>(requestError) && requestError.response) {
        const apiError = requestError.response.data;

        setError(apiError.message || "No fue posible iniciar sesion.");
        setActiveSessions(Array.isArray(apiError.data) ? apiError.data : []);
        setSessionSelectorLocked(Array.isArray(apiError.data) && apiError.data.length > 0);
      } else {
        setError("No fue posible conectar con el servidor de autenticacion.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIngresar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runLogin(credentials);
  };

  const handleCerrarSesionActiva = async (sessionId: string) => {
    setMessage("");
    setError("");
    setClosingSessionId(sessionId);
    setSessionSelectorLocked(true);

    try {
      const response = await axios.post<CloseSessionResponse>(
        CLOSE_SESSION_URL,
        {
          idSesion: sessionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const payload = response.data;

      if (!payload.success) {
        setError(payload.message || "No fue posible cerrar la sesion seleccionada.");
        return;
      }

      setMessage(payload.message || "Sesion cerrada correctamente.");

      await runLogin(credentials, { fromSessionClose: true });
    } catch (requestError) {
      if (axios.isAxiosError<CloseSessionResponse>(requestError) && requestError.response) {
        setError(
          requestError.response.data.message ||
            "No fue posible cerrar la sesion seleccionada."
        );
      } else {
        setError("No fue posible conectar con el servidor de autenticacion.");
      }
    } finally {
      setClosingSessionId(null);
    }
  };

  const handleVolverALogin = () => {
    setMessage("");
    setError("");
    setActiveSessions([]);
    setClosingSessionId(null);
    setSessionSelectorLocked(false);
  };

  return {
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
  };
}