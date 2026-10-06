const getExpenses = jest.fn();
const addExpense = jest.fn();
const updateExpense = jest.fn();
const deleteExpense = jest.fn();

const signUpWithEmail = jest.fn();
const signInWithEmail = jest.fn();
const sendVerificationEmail = jest.fn();
const getAccountInfo = jest.fn();
const sendPasswordResetEmail = jest.fn();
const confirmPasswordReset = jest.fn();

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,

  signUpWithEmail,
  signInWithEmail,
  sendVerificationEmail,
  getAccountInfo,
  sendPasswordResetEmail,
  confirmPasswordReset,
};
