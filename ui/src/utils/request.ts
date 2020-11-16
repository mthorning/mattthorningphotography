import { gql, GraphQLClient } from "graphql-request";

import type { Response } from 'express'

const dev = process.env.NODE_ENV === "development";
const client = new GraphQLClient(`${process.env.API_URL}/graphql`);

export default async function request(query: string, res: Response) {
  return client
    .request(
      gql`
        query {
            ${query}
        }       
      `
    )
    .catch((error) => {
      console.error("error", error);
      const message =
        (dev && error && error.response && error.response.errors[0].message) ||
        "Not Found";
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          message,
        })
      );
    });
}
