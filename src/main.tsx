import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { Provider as ReduxProvider } from "react-redux"
import { Provider as UiProvider } from "@/components/ui/provider"
import App from "./App"
import { store } from "./app/store"
// import "./index.css"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <UiProvider>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ReduxProvider>
      </UiProvider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
