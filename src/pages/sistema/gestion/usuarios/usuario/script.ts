import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getSessionToken } from "../../../../../session/auth";

const CONSULTAR_USUARIO_URL = "/api/gestion/usuarios/consultarUsuario";
const EDITAR_USUARIO_URL = "/api/gestion/usuarios/editarUsuario";
const USUARIOS_ROUTE = "/organizacion/usuarios";

type UsuarioApiItem = {
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

type ConsultarUsuarioResponse = {
  success: boolean;
  message: string;
  error: string | null;
  data: UsuarioApiItem;
};

type MutationResponse = {
  success: boolean;
  message: string;
  error: string | null;
};

export type EditUsuarioForm = {
  id: string;
  nombre: string;
  apellido: string | null;
  usuario: string;
  email: string | null;
  telefono: string | null;
  fechaRegistro: string;
  fechaActualizacion: string;
  passwordactual: string | null;
  passworNueva: string | null;
  estado: boolean | null;
  sesion: boolean;
};

type EditUsuarioPayload = {
  id: string;
  nombre: string | null;
  apellido: string | null;
  email: string | null;
  telefono: string | null;
  passwordactual: string | null;
  passworNueva: string | null;
  estado: boolean | null;
  sesion: boolean | null;
};

function buildEditUsuarioForm(usuario: UsuarioApiItem): EditUsuarioForm {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido || null,
    usuario: usuario.usuario,
    email: usuario.email || null,
    telefono: usuario.telefono || null,
    fechaRegistro: usuario.fechaRegistro,
    fechaActualizacion: usuario.fechaActualizacion,
    passwordactual: null,
    passworNueva: null,
    estado: usuario.estado,
    sesion: usuario.sesion,
  };
}

function normalizeOptionalText(value: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : null;
}

function buildEditUsuarioPayload(current: EditUsuarioForm, original: EditUsuarioForm): EditUsuarioPayload {
  const normalizedNombre = current.nombre.trim();
  const normalizedApellido = normalizeOptionalText(current.apellido);
  const normalizedEmail = normalizeOptionalText(current.email);
  const normalizedTelefono = normalizeOptionalText(current.telefono);
  const normalizedPasswordActual = normalizeOptionalText(current.passwordactual);
  const normalizedPasswordNueva = normalizeOptionalText(current.passworNueva);

  return {
    id: current.id,
    nombre: normalizedNombre !== original.nombre.trim() ? normalizedNombre : null,
    apellido: normalizedApellido !== normalizeOptionalText(original.apellido) ? normalizedApellido : null,
    email: normalizedEmail !== normalizeOptionalText(original.email) ? normalizedEmail : null,
    telefono: normalizedTelefono !== normalizeOptionalText(original.telefono) ? normalizedTelefono : null,
    passwordactual: normalizedPasswordActual,
    passworNueva: normalizedPasswordNueva,
    estado: current.estado !== original.estado ? current.estado : null,
    sesion: null,
  };
}

export function getUsuarioProfileInitial(nombreCompleto: string) {
  return nombreCompleto.trim().charAt(0).toUpperCase() || "U";
}

export function useUsuarioDetalleScript() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditUsuarioForm | null>(null);
  const [originalForm, setOriginalForm] = useState<EditUsuarioForm | null>(null);

  const perfilNombre = useMemo(() => {
    if (!form) {
      return "Usuario";
    }

    return [form.nombre, form.apellido].filter(Boolean).join(" ") || "Usuario";
  }, [form]);

  const fetchUsuario = async () => {
    if (!id) {
      setLoading(false);
      setError("No se encontro el identificador del usuario.");
      return;
    }

    const token = getSessionToken();

    if (!token) {
      setLoading(false);
      setError("No se encontro un token de sesion para consultar el usuario.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post<ConsultarUsuarioResponse>(
        CONSULTAR_USUARIO_URL,
        { id },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        setError(response.data.message || "No fue posible consultar el usuario.");
        setForm(null);
        setOriginalForm(null);
        return;
      }

      const hydratedForm = buildEditUsuarioForm(response.data.data);
      setForm(hydratedForm);
      setOriginalForm(hydratedForm);
    } catch (requestError) {
      if (axios.isAxiosError<ConsultarUsuarioResponse>(requestError) && requestError.response) {
        setError(requestError.response.data.message || "No fue posible consultar el usuario.");
      } else {
        setError("No fue posible conectar con el servicio de consulta de usuario.");
      }

      setForm(null);
      setOriginalForm(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsuario();
  }, [id]);

  const handleBack = () => {
    void navigate(USUARIOS_ROUTE);
  };

  const handleEditFormChange = <K extends keyof EditUsuarioForm>(key: K, value: EditUsuarioForm[K]) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
    setForm(originalForm);
  };

  const handleSubmit = async () => {
    if (!form || !originalForm) {
      return;
    }

    const token = getSessionToken();

    if (!token) {
      setError("No se encontro un token de sesion para editar el usuario.");
      return;
    }

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = buildEditUsuarioPayload(form, originalForm);
      const response = await axios.put<MutationResponse>(EDITAR_USUARIO_URL, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        setError(response.data.message || "No fue posible editar el usuario.");
        return;
      }

      setIsEditing(false);
      await fetchUsuario();
    } catch (requestError) {
      if (axios.isAxiosError<MutationResponse>(requestError) && requestError.response) {
        setError(requestError.response.data.message || "No fue posible editar el usuario.");
      } else {
        setError("No fue posible conectar con el servicio de edicion de usuarios.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    error,
    isEditing,
    form,
    perfilNombre,
    handleBack,
    handleEditFormChange,
    handleStartEdit,
    handleCancelEdit,
    handleSubmit,
  };
}