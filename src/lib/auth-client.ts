export async function logout() {
  await fetch("/api/studio/logout", { method: "POST" });
  location.href = "/studio/login";
}
