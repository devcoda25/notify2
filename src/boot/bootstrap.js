// Tiny, opt-in bootstrap helpers

// Runs BEFORE first paint (we call this from useLayoutEffect)
export function syncBootstrap() {
  // Example: adopt x_authuser (exactly what you do now)
  const params = new URLSearchParams(window.location.search);
  const x = params.get("x_authuser");
  if (x) {
    sessionStorage.setItem("auth", "true");
    sessionStorage.setItem("authUser", x);
  }
}

// Optional async bootstrap you can enable later (token refresh, /me, flags…)
const timeout = (ms) => new Promise((_, r) => setTimeout(() => r(new Error("bootstrap:timeout")), ms));

export async function asyncBootstrap({ signal } = {}) {
  // Example shape; replace with the real calls later
  // await Promise.race([
  //   fetch("/api/me", { signal, credentials: "include" }),
  //   timeout(1500),
  // ]);
  return true;
}
