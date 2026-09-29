import { createApp } from "./app.js";
import process from "node:process";

const port = Number(process.env.PORT || 3001);
createApp().listen(port, () =>
  console.log(`HireHub notifications listening on ${port}`),
);
