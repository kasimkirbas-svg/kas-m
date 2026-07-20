export const initializeMonitoring = async () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
  if (!dsn) return;

  const Sentry = await import('@sentry/react');
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1,
    enabled: import.meta.env.PROD,
  });
};

export const reportError = async (error: unknown) => {
  if (!import.meta.env.VITE_SENTRY_DSN?.trim()) return;
  const Sentry = await import('@sentry/react');
  Sentry.captureException(error);
};
