import Axios from "axios";

import { type Account } from "../types";
import { type Debt } from "../types";
import { type Expense } from "../types";
import { type OneTimeExpense } from "../types";

const baseUrl = "http://127.0.0.1:3000";
// const baseUrl = "https://reyaly-financial-backend-983411f48872.herokuapp.com";

Axios.interceptors.response.use(
  (res) => {
    if (res.status === 404) {
      console.log("Not Found");
    }
    return res;
  },
  (err) => {
    if (err.response && err.response.data) {
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err.message);
  }
);

// User Routes
export const addUser = (data: {}): Promise<any> => {
  return Axios.post(`${baseUrl}/users`, data).then((res) => res.data);
};

export const editUser = (dbUserId: string, data: {}): Promise<any> => {
  return Axios.put(`${baseUrl}/users/${dbUserId}`, data).then((res) => res.data);
};

export const getUserInfo = (authUID: string | undefined): Promise<any> => {
  return Axios.get(`${baseUrl}/users/${authUID}`).then((res) => res.data);
};

// Generate Excel
export const sendJson = (data: {}, id: string): Promise<any> => {
  return Axios.post(`${baseUrl}/users/${id}/download`, data).then((res) => res.data);
};

// Account Routes
export const addAcct = (dbUserId: string, data: Account): Promise<any> => {
  return Axios.post(`${baseUrl}/users/${dbUserId}/accounts`, data).then((res) => res.data);
};

export const editAcct = (dbUserId: string, data: Account): Promise<any> => {
  return Axios.put(`${baseUrl}/users/${dbUserId}/accounts/${data.id}`, data).then(
    (res) => res.data
  );
};

export const deleteAcct = (dbUserId: string, id: string): Promise<any> => {
  return Axios.delete(`${baseUrl}/users/${dbUserId}/accounts/${id}`).then((res) => res.data);
};

// Debt Routes
export const addDebt = (dbUserId: string, data: Debt): Promise<any> => {
  return Axios.post(`${baseUrl}/users/${dbUserId}/debts`, data).then((res) => res.data);
};

export const editDebt = (dbUserId: string, data: Debt): Promise<any> => {
  return Axios.put(`${baseUrl}/users/${dbUserId}/debts/${data.id}`, data).then((res) => res.data);
};

export const deleteDebt = (dbUserId: string, id: string): Promise<any> => {
  return Axios.delete(`${baseUrl}/users/${dbUserId}/debts/${id}`).then((res) => res.data);
};

// Expense Routes
export const getExpenses = (dbUserId: string, params: string): Promise<any> => {
  return Axios.get(`${baseUrl}/users/${dbUserId}/expenses?${params}`).then((res) => res.data);
};

export const addExpense = (dbUserId: string, data: Expense): Promise<any> => {
  return Axios.post(`${baseUrl}/users/${dbUserId}/expenses`, data).then((res) => res.data);
};

export const editExpense = (dbUserId: string, data: Expense): Promise<any> => {
  return Axios.put(`${baseUrl}/users/${dbUserId}/expenses/${data.id}`, data).then(
    (res) => res.data
  );
};

export const deleteExpense = (dbUserId: string, id: string): Promise<any> => {
  return Axios.delete(`${baseUrl}/users/${dbUserId}/expenses/${id}`).then((res) => res.data);
};

// One Time Expense Routes
export const getOTExpenses = (dbUserId: string, paycheckId: string): Promise<any> => {
  return Axios.get(`${baseUrl}/users/${dbUserId}/paychecks/${paycheckId}/one_time_expenses`).then(
    (res) => res.data
  );
};

export const addOTExpense = (dbUserId: string, data: OneTimeExpense): Promise<any> => {
  return Axios.post(
    `${baseUrl}/users/${dbUserId}/paychecks/${data.paycheck}/one_time_expenses`,
    data
  ).then((res) => res.data);
};

export const editOTExpense = (dbUserId: string, data: OneTimeExpense): Promise<any> => {
  return Axios.put(
    `${baseUrl}/users/${dbUserId}/paychecks/${data.paycheck}/one_time_expenses/${data.id}`,
    data
  ).then((res) => res.data);
};

export const deleteOTExpense = (dbUserId: string, paycheckId: string, id: string): Promise<any> => {
  return Axios.delete(
    `${baseUrl}/users/${dbUserId}/paychecks/${paycheckId}/one_time_expenses/${id}`
  ).then((res) => res.data);
};

// Savings Route
export const getSavings = (): Promise<any> => {
  return Axios.get(`${baseUrl}/savings`).then((res) => res.data);
};

// Currency Route
export const getCurrencyInfo = (want: string, have: string, amount: number): Promise<any> => {
  const params = `have=${have}&want=${want}&amount=${amount}`;
  return Axios.get(`${baseUrl}/converter?${params}`).then((res) => res.data);
};
