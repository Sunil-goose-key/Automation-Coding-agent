// QA smoke tests — run against a *deployed* environment over the network
// (not the in-process tests in test/server.test.js). Requires QA_TARGET_URL,
// e.g. QA_TARGET_URL=http://my-alb-dns-name npm run test:qa

const test = require("node:test");
const assert = require("node:assert");

const baseUrl = process.env.QA_TARGET_URL;
if (!baseUrl) {
  throw new Error("QA_TARGET_URL env var is required, e.g. http://my-alb-dns-name");
}

test("GET /health returns 200 ok", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, "ok");
});

test("POST /login succeeds with valid credentials", async () => {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "qa-user", password: "validpass123" }),
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.username, "qa-user");
});

test("POST /login rejects a short password", async () => {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "qa-user", password: "abc" }),
  });
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});

test("POST /login rejects a missing username", async () => {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "validpass123" }),
  });
  assert.strictEqual(res.status, 400);
});

test("GET /login returns HTML login page", async () => {
  const res = await fetch(`${baseUrl}/login`);
  assert.strictEqual(res.status, 200);
  const contentType = res.headers.get("content-type");
  assert.ok(contentType && contentType.includes("html"), "Content-Type should be HTML");
  const body = await res.text();
  assert.ok(body.includes("<form"), "Response should contain a login form");
  assert.ok(body.includes('type="text"') || body.includes("username"), "Form should have username input");
  assert.ok(body.includes('type="password"'), "Form should have password input");
  assert.ok(body.includes('type="submit"') || body.includes("<button"), "Form should have submit button");
});
