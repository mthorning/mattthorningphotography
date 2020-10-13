import { gql, GraphQLClient } from "graphql-request";

const dev = process.env.NODE_ENV === "development";
const client = new GraphQLClient(`${process.env.PUBLIC_URL}/api/graphql`);

export default function request(query, res) {
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
