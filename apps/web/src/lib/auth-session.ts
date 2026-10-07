export function getUserRole(session: unknown) {
  if (!session || typeof session !== "object") {
    return;
  }

  const { user } = session as { user?: unknown };

  if (!user || typeof user !== "object") {
    return;
  }

  const { role } = user as { role?: unknown };

  return typeof role === "string" ? role : undefined;
}

export function hasSession(session: unknown) {
  return Boolean(session && typeof session === "object");
}
