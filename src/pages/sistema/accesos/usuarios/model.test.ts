import { describe, expect, it } from "vitest";
import {
  buildEditUsuarioForm,
  buildEditUsuarioPayload,
  buildInitialCreateUsuarioForm,
  validateCreateUsuarioForm,
  validateEditUsuarioForm,
  type UsuarioApiItem,
} from "./model";

const usuarioBase: UsuarioApiItem = {
  id: "usr-1",
  nombre: "Luis",
  apellido: "Mora",
  fechaNacimiento: "1992-08-12",
  usuario: "lmora",
  email: "luis@demo.com",
  telefono: "5551234567",
  empresaId: "emp-1",
  empresa: "Valian",
  sucursalId: "suc-1",
  sucursal: "Matriz",
  departamentoId: "dep-1",
  departamento: "Administracion",
  perfilId: "perf-1",
  perfil: "Administrador",
  usuarioRegistroId: "usr-admin",
  usuarioRegistro: "Administrador Demo",
  sesionesActivas: 0,
  asignaciones: [
    {
      empresaId: "emp-1",
      sucursalId: "suc-1",
      departamentoId: "dep-1",
      perfilId: "perf-1",
      principal: true,
      estado: true,
      usuarioRegistroId: "usr-admin",
      fechaAsignacion: "2026/07/09 03:17 am",
    },
  ],
  fechaRegistro: "2025-01-01",
  fechaActualizacion: "2025-01-02",
  estado: true,
  sesion: false,
};

describe("usuarios model validations", () => {
  it("valida el alta con datos completos", () => {
    const form = buildInitialCreateUsuarioForm(
      {
        empresaId: "emp-1",
        sucursalId: "suc-1",
        departamentoId: "dep-1",
        perfilId: "perf-1",
      },
      "session-user"
    );

    form.nombre = "Luis";
    form.apellido = "Mora";
    form.telefono = "5551234567";
    form.email = "luis@demo.com";
    form.password = "Segura123";

    const result = validateCreateUsuarioForm(form);

    expect(result.isValid).toBe(true);
    expect(result.message).toBeNull();
  });

  it("rechaza el alta si falta el correo valido", () => {
    const form = buildInitialCreateUsuarioForm(
      {
        empresaId: "emp-1",
        sucursalId: "suc-1",
        departamentoId: "dep-1",
        perfilId: "perf-1",
      },
      "session-user"
    );

    form.nombre = "Luis";
    form.apellido = "Mora";
    form.telefono = "5551234567";
    form.email = "sin-correo";
    form.password = "Segura123";

    const result = validateCreateUsuarioForm(form);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Captura un correo valido para registrar el usuario.");
  });

  it("valida la edicion y exige password actual si se define uno nuevo", () => {
    const form = buildEditUsuarioForm(usuarioBase);
    form.passwordNueva = "NuevaSegura123";

    const result = validateEditUsuarioForm(form);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Debes capturar el password actual para definir un password nuevo.");
  });

  it("arma payload de edicion solo con cambios relevantes", () => {
    const original = buildEditUsuarioForm(usuarioBase);
    const current = {
      ...original,
      telefono: "5550000000",
      passwordActual: "Actual123",
      passwordNueva: "Nueva123",
    };

    const payload = buildEditUsuarioPayload(current, original);

    expect(payload.telefono).toBe("5550000000");
    expect(payload.passwordactual).toBe("Actual123");
    expect(payload.passworNueva).toBe("Nueva123");
    expect(payload.nombre).toBeNull();
  });
});