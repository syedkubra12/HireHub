import cors from "cors";
import express from "express";
import process from "node:process";

export function createApp() {
  const app = express();
  const events = [];

  app.use(cors({ origin: process.env.WEB_ORIGIN || "http://localhost:5173" }));
  app.use(express.json({ limit: "16kb" }));

  app.get("/health", (_request, response) =>
    response.json({ status: "ok", service: "hirehub-notifications" }),
  );
  app.get("/api/notifications", (_request, response) => response.json(events));
  app.post("/api/notifications", (request, response) => {
    const { type, message, applicationId } = request.body ?? {};
    if (
      typeof type !== "string" ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return response
        .status(400)
        .json({ error: "type and message are required" });
    }

    const event = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: type.slice(0, 80),
      applicationId: Number.isInteger(applicationId) ? applicationId : null,
      message: message.trim().slice(0, 500),
      createdAt: new Date().toISOString(),
    };
    events.unshift(event);
    events.length = Math.min(events.length, 100);
    return response.status(201).json(event);
  });

  return app;
}
