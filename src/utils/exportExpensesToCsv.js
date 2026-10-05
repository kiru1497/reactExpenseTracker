function escapeCsvValue(value) {
  const stringValue = String(value ?? "");

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function exportExpensesToCsv(expenses) {
  if (!expenses?.length) {
    return;
  }

  const headers = ["Description", "Category", "Amount", "Date"];

  const rows = expenses.map((expense) => [
    escapeCsvValue(expense.description),
    escapeCsvValue(expense.category),
    escapeCsvValue(expense.amount),
    escapeCsvValue(new Date(expense.date).toLocaleDateString("en-IN")),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n",
  );

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  URL.revokeObjectURL(url);
}
