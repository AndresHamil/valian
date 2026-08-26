import axios from "axios";
import {
  USUARIOS_API_ENDPOINTS,
  type ConsultarUsuarioResponse,
  type ConsultarUsuariosResponse,
  type CreateUsuarioPayload,
  type EditUsuarioPayload,
  type MutationResponse,
  type RegistrarUsuarioResponse,
  type ResponseWithMessage,
  type UsuarioFilters,
} from "./model";

let consultarUsuariosInFlight: Promise<ConsultarUsuariosResponse> | null = null;
const consultarUsuarioInFlight = new Map<string, Promise<ConsultarUsuarioResponse>>();

export function requestConsultarUsuarios(token: string) {
  if (!consultarUsuariosInFlight) {
    consultarUsuariosInFlight = axios
      .get<ConsultarUsuariosResponse>(USUARIOS_API_ENDPOINTS.consultarUsuarios, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => response.data)
      .finally(() => {
        consultarUsuariosInFlight = null;
      });
  }

  return consultarUsuariosInFlight;
}

export async function requestConsultarUsuariosFiltrados(token: string, filters: UsuarioFilters) {
  const response = await axios.post<ConsultarUsuariosResponse>(
    USUARIOS_API_ENDPOINTS.consultarUsuariosFiltros,
    filters,
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export function requestConsultarUsuarioById(token: string, id: string) {
  const cachedRequest = consultarUsuarioInFlight.get(id);

  if (cachedRequest) {
    return cachedRequest;
  }

  const request = axios
    .post<ConsultarUsuarioResponse>(
      USUARIOS_API_ENDPOINTS.consultarUsuario,
      { id },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => response.data)
    .finally(() => {
      consultarUsuarioInFlight.delete(id);
    });

  consultarUsuarioInFlight.set(id, request);

  return request;
}

export async function requestEditarUsuario(token: string, payload: EditUsuarioPayload) {
  const response = await axios.put<MutationResponse>(USUARIOS_API_ENDPOINTS.editarUsuario, payload, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export async function requestRegistrarUsuario(token: string, payload: CreateUsuarioPayload) {
  const response = await axios.post<RegistrarUsuarioResponse>(USUARIOS_API_ENDPOINTS.registrarUsuario, payload, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export function resolveRequestMessage<T extends ResponseWithMessage>(
  error: unknown,
  requestFallbackMessage: string,
  connectionFallbackMessage: string
) {
  if (axios.isAxiosError<T>(error) && error.response) {
    return error.response.data.message || requestFallbackMessage;
  }

  return connectionFallbackMessage;
}