const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Gemini 2.5 Flash Lite is inexpensive and supports structured JSON output.
const MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || "google/gemini-2.5-flash-lite";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Groceries",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Subscriptions",
  "Other",
];

const expenseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: {
      type: "number",
      description:
        "The expense amount in Indian rupees. Must be greater than zero.",
    },
    description: {
      type: "string",
      description: "A short, clear description of the expense.",
    },
    category: {
      type: "string",
      enum: EXPENSE_CATEGORIES,
      description: "The most appropriate expense category.",
    },
    date: {
      type: "string",
      description:
        "Expense date in YYYY-MM-DD format. Use the supplied current date when no date is mentioned.",
    },
  },
  required: ["amount", "description", "category", "date"],
};

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

function parseModelResponse(content) {
  if (!content) {
    throw new Error("AI returned an empty response.");
  }

  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("AI returned an invalid expense response.");
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error("AI returned an invalid expense response.");
    }
  }
}

function validateExpense(expense) {
  const amount = Number(expense?.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("AI could not determine a valid expense amount.");
  }

  if (typeof expense?.description !== "string" || !expense.description.trim()) {
    throw new Error("AI could not determine an expense description.");
  }

  if (!EXPENSE_CATEGORIES.includes(expense?.category)) {
    throw new Error("AI returned an invalid expense category.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(expense?.date || "")) {
    throw new Error("AI returned an invalid expense date.");
  }

  return {
    amount,
    description: expense.description.trim().slice(0, 100),
    category: expense.category,
    date: expense.date,
  };
}

export async function parseExpenseWithAI(userInput) {
  if (!API_KEY) {
    throw new Error(
      "OpenRouter API key is missing. Add VITE_OPENROUTER_API_KEY to your .env file.",
    );
  }

  const input = userInput.trim();

  if (!input) {
    throw new Error("Please describe the expense first.");
  }

  if (input.length > 500) {
    throw new Error(
      "Please keep the expense description under 500 characters.",
    );
  }

  const currentDate = getCurrentDate();

  const systemPrompt = `
You are an expense extraction assistant for an Indian expense tracker.

Your only job is to convert the user's natural-language expense description
into structured expense data.

Rules:
- Currency is INR unless the user explicitly specifies another currency.
- Return the amount as a plain number in Indian rupees.
- Extract a concise description.
- Choose exactly one category from the allowed categories.
- If the user does not specify a date, use the supplied current date.
- Convert relative dates such as "yesterday" or "last Friday" into YYYY-MM-DD.
- Never invent an amount.
- Never invent an expense that the user did not mention.
- If an amount cannot reasonably be determined, return 0.
- Return only the requested JSON structure.

Allowed categories:
${EXPENSE_CATEGORIES.join(", ")}
`;

  const userPrompt = `
Current date: ${currentDate}

Expense description:
${input}
`;

  let response;

  try {
    response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "expense",
            strict: true,
            schema: expenseSchema,
          },
        },
      }),
    });
  } catch {
    throw new Error(
      "Unable to connect to OpenRouter. Please check your internet connection.",
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message || data?.error || "OpenRouter request failed.";

    throw new Error(message);
  }

  const content = data?.choices?.[0]?.message?.content;

  const parsedExpense = parseModelResponse(content);

  return validateExpense(parsedExpense);
}
