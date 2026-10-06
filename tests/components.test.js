import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import ExpenseTable from "../src/components/Expenses/ExpenseTable";
import ExpenseModal from "../src/components/UI/ExpenseModal";

// Test 9
test("should display expenses in the transaction history table", () => {
  const expenses = [
    {
      id: "1",
      description: "Grocery shopping",
      category: "Groceries",
      amount: 1500,
      date: "2026-10-05T10:00:00.000Z",
    },
  ];

  render(
    <ExpenseTable
      expenses={expenses}
      onEdit={jest.fn()}
      onDelete={jest.fn()}
    />,
  );

  expect(
    screen.getByRole("heading", {
      name: "Transaction History",
    }),
  ).toBeInTheDocument();

  expect(screen.getByText("Grocery shopping")).toBeInTheDocument();

  expect(screen.getByText("Groceries")).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Edit Grocery shopping",
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Delete Grocery shopping",
    }),
  ).toBeInTheDocument();
});

// Test 10
test("should show an error when an invalid expense amount is submitted", async () => {
  const user = userEvent.setup();

  render(
    <ExpenseModal
      isOpen={true}
      onClose={jest.fn()}
      onSubmit={jest.fn()}
      loading={false}
    />,
  );

  const amountInput = screen.getByLabelText("Amount (₹)");
  const descriptionInput = screen.getByLabelText("Description");

  await user.type(amountInput, "0");
  await user.type(descriptionInput, "Test expense");

  await user.click(
    screen.getByRole("button", {
      name: "Add Expense",
    }),
  );

  expect(
    screen.getByText("Enter a valid amount greater than zero."),
  ).toBeInTheDocument();
});
