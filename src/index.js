import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";

// core functions
import { BlockLottoProvider } from "blocklotto-sdk";

// styles
import { theme, GlobalStyles } from "./styles";

// react components
import App from "./app";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Router>
      <BlockLottoProvider>
        <App />
      </BlockLottoProvider>
    </Router>
  </ThemeProvider>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("/serviceWorker.js").catch(() => null)
  );
}

if (module.hot) {
  module.hot.accept();
}
