import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { queryClient } from "@/lib/queryClient";
import { env } from "@/lib/env";
import "@/index.css";

if (env.sentryDsn) {
  Sentry.init({
    dsn: env.sentryDsn,
    tracesSampleRate: env.isProduction ? 0.25 : 1,
    environment: env.mode
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div className="p-8">Settlie AI hit an error. The incident has been logged.</div>}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
