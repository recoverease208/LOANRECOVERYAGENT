import test from "node:test";
import assert from "node:assert/strict";

function sanitizePlainText(value) {
  return value.replace(/[<>]/g, "").trim();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

test("formatCurrency formats INR values without decimals", () => {
  assert.match(formatCurrency(28400000), /2,84,00,000/);
});

test("sanitizePlainText removes angle brackets and trims", () => {
  assert.equal(sanitizePlainText(" <script> "), "script");
});
