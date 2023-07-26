import Axios from "axios";

import { type Account } from "../types";
import { type Debt } from "../types";
import { type Expense } from "../types";

// const baseUrl = "http://127.0.0.1:3000/users";
const baseUrl = "https://reyaly-financial-backend-983411f48872.herokuapp.com/users";

// User Routes

export const addUser = (data: {}): Promise<any> => {
  return Axios.post(baseUrl, data).then((res) => res.data);
};

export const editUser = (dbUserId: string, data: {}): Promise<any> => {
  return Axios.put(`${baseUrl}/${dbUserId}`, data).then((res) => res.data);
};

export const getUserInfo = (authUID: String | undefined): Promise<any> => {
  return Axios.get(`${baseUrl}/?uid=${authUID}`).then((res) => res.data);
};

// Generate Excel
export const sendJson = (data: {}, id: string): Promise<any> => {
  return Axios.post(`${baseUrl}/${id}/download`, data).then((res) => res.data);
};

// Account Routes

export const addAcct = (dbUserId: string, data: Account): Promise<any> => {
  return Axios.post(`${baseUrl}/${dbUserId}/accounts`, data).then((res) => res.data);
};

export const editAcct = (dbUserId: string, data: Account): Promise<any> => {
  return Axios.put(`${baseUrl}/${dbUserId}/accounts/${data.id}`, data).then((res) => res.data);
};

export const deleteAcct = (dbUserId: string, id: string): Promise<any> => {
  return Axios.delete(`${baseUrl}/${dbUserId}/accounts/${id}`).then((res) => res.data);
};

// Debt Routes

export const addDebt = (dbUserId: string, data: Debt): Promise<any> => {
  return Axios.post(`${baseUrl}/${dbUserId}/debts`, data).then((res) => res.data);
};

export const editDebt = (dbUserId: string, data: Debt): Promise<any> => {
  return Axios.put(`${baseUrl}/${dbUserId}/debts/${data.id}`, data).then((res) => res.data);
};

export const deleteDebt = (dbUserId: string, id: string): Promise<any> => {
  return Axios.delete(`${baseUrl}/${dbUserId}/debts/${id}`).then((res) => res.data);
};

// Expense Routes

export const addExpense = (dbUserId: string, data: Expense): Promise<any> => {
  return Axios.post(`${baseUrl}/${dbUserId}/expenses`, data).then((res) => res.data);
};

export const editExpense = (dbUserId: string, data: Expense): Promise<any> => {
  return Axios.put(`${baseUrl}/${dbUserId}/expenses/${data.id}`, data).then((res) => res.data);
};

export const deleteExpense = (dbUserId: string, id: string): Promise<any> => {
  return Axios.delete(`${baseUrl}/${dbUserId}/expenses/${id}`).then((res) => res.data);
};

// Paycheck Routes
export const getPaychecks = (dbUserId: string, params: string): Promise<any> => {
  return Axios.get(`${baseUrl}/${dbUserId}/expenses?${params}`).then((res) => res.data);
};


