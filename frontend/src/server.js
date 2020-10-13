process.env.NODE_ENV !== 'production' && require('dotenv').config();

import sirv from "sirv";
import polka from "polka";
import bodyParser from 'body-parser';
import compression from "compression";
import { createProxyMiddleware } from "http-proxy-middleware";

import * as sapper from "@sapper/server";

const { PORT, NODE_ENV, API_URL } = process.env;
const dev = NODE_ENV === "development";

const apiProxy = createProxyMiddleware(["/api", "/uploads"], {
  target: API_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
});

polka()
  .use(
    apiProxy,
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    bodyParser.json(),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
