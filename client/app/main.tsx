import { createRoot } from "react-dom/client";
import "./globals.css";
// import { BrowserRouter, RouterProvider } from "react-router-dom";
// import router from "./router";
// import { Provider } from "react-redux";
// import { store } from "./store/store";
import { StrictMode } from "react";
import AppRouter from "./router";
import { store } from "./store/store";
import { Provider } from "react-redux";
// import { DataProvider } from "./lib/data-context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </StrictMode>
);
