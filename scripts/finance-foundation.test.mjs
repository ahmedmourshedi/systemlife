import assert from "node:assert/strict";

function assertPositiveAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }
  return Math.round(amount * 100) / 100;
}

function applyMovement(balance, type, amount) {
  const validAmount = assertPositiveAmount(amount);
  if (type === "income") return Math.round((balance + validAmount) * 100) / 100;
  if (type === "expense") return Math.round((balance - validAmount) * 100) / 100;
  throw new Error(`Unsupported movement type: ${type}`);
}

function applyTransfer(sourceBalance, destinationBalance, amount, fee = 0) {
  const validAmount = assertPositiveAmount(amount);
  const validFee = Number(fee);
  if (!Number.isFinite(validFee) || validFee < 0) {
    throw new Error("Transfer fee cannot be negative.");
  }

  return {
    sourceBalance: Math.round((sourceBalance - validAmount - validFee) * 100) / 100,
    destinationBalance: Math.round((destinationBalance + validAmount) * 100) / 100
  };
}

assert.equal(applyMovement(1000, "income", 250.235), 1250.24);
assert.equal(applyMovement(1000, "expense", 99.999), 900);
assert.deepEqual(applyTransfer(1000, 200, 150, 2.5), {
  sourceBalance: 847.5,
  destinationBalance: 350
});
assert.throws(() => assertPositiveAmount(0), /greater than zero/);
assert.throws(() => assertPositiveAmount(-1), /greater than zero/);
assert.throws(() => applyTransfer(100, 100, 10, -1), /cannot be negative/);

console.log("finance-foundation tests passed");
