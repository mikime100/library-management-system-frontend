import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// Register service worker for caching
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
// Performance optimization: Use React 18's concurrent features
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  _jsx(React.StrictMode, {
    children: _jsx(BrowserRouter, { children: _jsx(App, {}) }),
  })
);
