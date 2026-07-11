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

function applyDebtRepayment({ totalAmount, paidAmount, repaymentAmount }) {
  const total = assertPositiveAmount(totalAmount);
  const paid = Number(paidAmount);
  const repayment = assertPositiveAmount(repaymentAmount);

  if (!Number.isFinite(paid) || paid < 0) {
    throw new Error("Paid amount cannot be negative.");
  }

  const remaining = Math.round((total - paid) * 100) / 100;
  if (remaining <= 0) {
    throw new Error("Debt is already fully paid.");
  }

  if (repayment > remaining) {
    throw new Error("Repayment amount cannot exceed remaining debt.");
  }

  const newPaidAmount = Math.round((paid + repayment) * 100) / 100;
  return {
    paidAmount: newPaidAmount,
    remainingAmount: Math.round((total - newPaidAmount) * 100) / 100,
    status: newPaidAmount >= total ? "paid" : "open"
  };
}

function applySubscriptionPayment({ accountBalance, amount, cycle, paidAt }) {
  const validAmount = assertPositiveAmount(amount);
  const paidDate = new Date(`${paidAt}T00:00:00.000Z`);
  const nextDate = new Date(paidDate);
  const normalizedCycle = String(cycle).toLowerCase();

  if (normalizedCycle.includes("year") || normalizedCycle.includes("سنوي")) {
    nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
  } else if (normalizedCycle.includes("week") || normalizedCycle.includes("أسبوع")) {
    nextDate.setUTCDate(nextDate.getUTCDate() + 7);
  } else if (normalizedCycle.includes("quarter") || normalizedCycle.includes("ربع")) {
    nextDate.setUTCMonth(nextDate.getUTCMonth() + 3);
  } else {
    nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
  }

  return {
    accountBalance: Math.round((accountBalance - validAmount) * 100) / 100,
    nextPaymentAt: nextDate.toISOString().slice(0, 10)
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
assert.deepEqual(applyDebtRepayment({ totalAmount: 1000, paidAmount: 200, repaymentAmount: 300 }), {
  paidAmount: 500,
  remainingAmount: 500,
  status: "open"
});
assert.deepEqual(applyDebtRepayment({ totalAmount: 1000, paidAmount: 700, repaymentAmount: 300 }), {
  paidAmount: 1000,
  remainingAmount: 0,
  status: "paid"
});
assert.throws(
  () => applyDebtRepayment({ totalAmount: 1000, paidAmount: 900, repaymentAmount: 200 }),
  /cannot exceed remaining debt/
);
assert.deepEqual(applySubscriptionPayment({ accountBalance: 500, amount: 49.99, cycle: "شهري", paidAt: "2026-07-10" }), {
  accountBalance: 450.01,
  nextPaymentAt: "2026-08-10"
});
assert.deepEqual(applySubscriptionPayment({ accountBalance: 500, amount: 120, cycle: "سنوي", paidAt: "2026-07-10" }), {
  accountBalance: 380,
  nextPaymentAt: "2027-07-10"
});

console.log("finance-foundation tests passed");
