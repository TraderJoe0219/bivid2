export type CurrentUser =
  | ({ id?: string; email?: string | null; name?: string | null } & Record<string, unknown>)
  | null;

/** Temporary shim to unblock build; replace with real implementation later. */
export async function getCurrentUser(): Promise<CurrentUser> {
  return null;
}
