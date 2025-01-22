import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import * as React from "react";

import Menu from "./Menu";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);
//

root.render(
  <StrictMode>
    <Menu />
  </StrictMode>
);
