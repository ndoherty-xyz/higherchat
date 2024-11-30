export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://higherchatapi-production.up.railway.app"
    : "http://localhost:8080";

export const GRAPHQL_URL = `${API_URL}/api/graphql`;
