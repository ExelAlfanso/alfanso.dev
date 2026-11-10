import { GoogleLogoIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { getUserRole, hasSession } from "../lib/auth-session";

const dashboardPath = "/admin/cms";

export default function AdminLogin() {
  const location = useLocation();
  const session = authClient.useSession();
  const [errorMessage, setErrorMessage] = useState(() =>
    new URLSearchParams(location.search).has("error")
      ? "Google sign-in failed. Please try again."
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function loginWithGoogle() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.social({
        callbackURL: new URL(dashboardPath, window.location.origin).href,
        errorCallbackURL: new URL("/", window.location.origin).href,
        provider: "google",
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Google sign-in failed.");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Google sign-in failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    await authClient.signOut();
  }

  if (session.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary px-5 text-accent">
        <p className="font-mono">Checking admin session...</p>
      </main>
    );
  }

  if (getUserRole(session.data) === "admin") {
    return <Navigate replace to={dashboardPath} />;
  }

  if (hasSession(session.data)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary px-5 text-accent">
        <section className="w-full max-w-md rounded-md border border-accent/20 bg-secondary/70 p-6">
          <h1 className="font-bold font-heading text-4xl">Access denied</h1>
          <p className="mt-3 font-mono text-accent/80">
            Your account is signed in, but it does not have the admin role.
          </p>
          <button
            className="mt-6 rounded-md border border-accent bg-accent px-4 py-2 font-bold font-mono text-primary transition-colors hover:bg-accent-two focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-5 py-16 text-accent">
      <section className="w-full max-w-md rounded-md border border-accent/20 bg-secondary/70 p-6">
        <h1 className="font-bold font-heading text-4xl text-accent">
          Admin Login
        </h1>
        <p className="mt-2 font-mono text-accent/80 text-sm">
          Sign in with an admin account to manage CMS content.
        </p>

        {Boolean(errorMessage) && (
          <p className="mt-4 font-mono text-accent-two text-sm" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-accent bg-accent px-4 py-3 font-bold font-mono text-primary transition-colors hover:bg-accent-two focus-visible:outline-2 focus-visible:outline-accent-two focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          onClick={loginWithGoogle}
          type="button"
        >
          <GoogleLogoIcon aria-hidden="true" size={20} weight="bold" />
          {isSubmitting ? "Connecting to Google..." : "Continue with Google"}
        </button>
      </section>
    </main>
  );
}
