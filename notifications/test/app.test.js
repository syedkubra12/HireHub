import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApp } from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

test("health endpoint reports the notification service", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    service: "hirehub-notifications",
  });
});

test("notification events are validated and can be listed", async () => {
  const invalid = await fetch(`${baseUrl}/api/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "candidate.created" }),
  });
  assert.equal(invalid.status, 400);

  const created = await fetch(`${baseUrl}/api/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "candidate.created",
      applicationId: 12,
      message: "New candidate added",
    }),
  });
  assert.equal(created.status, 201);
  const event = await created.json();
  assert.equal(event.applicationId, 12);
  assert.equal(event.message, "New candidate added");

  const listed = await fetch(`${baseUrl}/api/notifications`);
  assert.equal((await listed.json())[0].id, event.id);
});
