import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://29e0e832f4c72410a43b64b1d08fd60b@o1156986.ingest.sentry.io/4506231418388480",
  tracesSampleRate: 0.3,
});