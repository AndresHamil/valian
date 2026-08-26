import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSessionToken } from "../../../../../session/auth";
import {
  requestConsultarUsuarioById,
  requestEditarUsuario,
  resolveRequestMessage,
} from "../api";
import {
  USUARIOS_ROUTE,
  buildEditUsuarioForm,
  buildEditUsuarioPayload,
  validateEditUsuarioForm,
  type ConsultarUsuarioResponse,
  type EditUsuarioForm,
  type MutationResponse,
} from "../model";

export type { EditUsuarioForm } from "../model";

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

  const fetchUsuario = async (options?: { isActive?: () => boolean }) => {
    if (!id) {
      if (!options?.isActive || options.isActive()) {
        setLoading(false);
        setError("No se encontro el identificador del usuario.");
      }
      return;
    }

    const token = getSessionToken();

    if (!token) {
      if (!options?.isActive || options.isActive()) {
        setLoading(false);
        setError("No se encontro un token de sesion para consultar el usuario.");
      }
      return;
    }

    if (!options?.isActive || options.isActive()) {
      setLoading(true);
      setError("");
    }

    try {
      const response = await requestConsultarUsuarioById(token, id);

      if (options?.isActive && !options.isActive()) {
        return;
      }

      if (!response.success) {
        setError(response.message || "No fue posible consultar el usuario.");
        setForm(null);
        setOriginalForm(null);
        return;
      }

      const hydratedForm = buildEditUsuarioForm(response.data);
      setForm(hydratedForm);
      setOriginalForm(hydratedForm);
      setIsEditing(false);
    } catch (requestError) {
      if (options?.isActive && !options.isActive()) {
        return;
      }

      setError(
        resolveRequestMessage<ConsultarUsuarioResponse>(
          requestError,
          "No fue posible consultar el usuario.",
          "No fue posible conectar con el servicio de consulta de usuario."
        )
      );
      setForm(null);
      setOriginalForm(null);
    } finally {
      if (!options?.isActive || options.isActive()) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let isActive = true;

    void fetchUsuario({ isActive: () => isActive });

    return () => {
      isActive = false;
    };
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
    setError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setError("");
    setForm(originalForm);
    setIsEditing(false);
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

    const validationResult = validateEditUsuarioForm(form);

    if (!validationResult.isValid) {
      setError(validationResult.message || "No fue posible validar la edicion del usuario.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = buildEditUsuarioPayload(form, originalForm);
      const response = await requestEditarUsuario(token, payload);

      if (!response.success) {
        setError(response.message || "No fue posible editar el usuario.");
        return;
      }

      setIsEditing(false);
      await fetchUsuario();
    } catch (requestError) {
      setError(
        resolveRequestMessage<MutationResponse>(
          requestError,
          "No fue posible editar el usuario.",
          "No fue posible conectar con el servicio de edicion de usuarios."
        )
      );
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