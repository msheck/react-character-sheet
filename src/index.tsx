import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import Sheet from "./Sheet";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <StrictMode>
    <Sheet tabId="tab-main"/>
  </StrictMode>
);
