const LAST_ROUTE_KEY = "jgLastRoute";

const DEFAULT_ROUTE = "/products";

export function setLastRoute(route: string): void {
  if (!route.startsWith("/") || route.startsWith("/login")) return;
  sessionStorage.setItem(LAST_ROUTE_KEY, route);
}

export function getLastRoute(): string {
  const route = sessionStorage.getItem(LAST_ROUTE_KEY);
  if (!route || !route.startsWith("/") || route.startsWith("/login")) {
    return DEFAULT_ROUTE;
  }
  return route;
}
