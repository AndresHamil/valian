import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { hasValidSession } from "../../session/auth";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  if (!hasValidSession()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}