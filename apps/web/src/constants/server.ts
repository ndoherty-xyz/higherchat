export const API_URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:8080";

export const GRAPHQL_URL = `${API_URL}/api/graphql`;
