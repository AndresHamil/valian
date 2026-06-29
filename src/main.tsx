import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { dynamicRoutes } from "./routes";
import ThemeProvider from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const themedRoutes = dynamicRoutes.filter((route) => route.theme);
const publicRoutes = dynamicRoutes.filter((route) => !route.theme);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <Outlet />
              </ThemeProvider>
            </ProtectedRoute>
          }
        >
          {themedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);