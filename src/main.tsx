import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { dynamicRoutes } from "./routes";
import ThemeProvider from "./components/ThemeProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          {dynamicRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.theme
                  ? <ThemeProvider>{route.element}</ThemeProvider>
                  : route.element
              }
            />
          ))}
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);