import { createClient, fetchExchange } from "@urql/core";

const API_URL = "http://localhost:8080/v1/graphql"; // URL Hasura

export const client = createClient({
  url: API_URL,
  fetchOptions: () => ({
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "myadminsecretkey",
    },
  }),
  exchanges: [fetchExchange],
});
