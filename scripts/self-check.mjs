import assert from "node:assert/strict";

const urgencyOrder = ["critica", "alta", "media", "baja"];
assert.equal(urgencyOrder[0], "critica");
assert.ok(urgencyOrder.includes("media"));

console.log("self-check ok");

// authored-by: gpt-5.3-codex
