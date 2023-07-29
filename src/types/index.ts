export interface User {
  pay: number;
  rate: string;
  frequency: string;
  hours: number;
  date: string;
  deductions: number;
  residence: string;
  relationship: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: number;
  dateStr?: string | undefined;
  dateObj?: Date | undefined;
  account?: string;
}

export interface Paycheck {
  date: string;
  id: string;
}

export interface Debt {
  id: string;
  name: string;
  type: string;
  owed: number;
  limit: number;
  rate: number;
  payment: number;
}

export interface Account {
  id: string;
  name: string;
  start: number;
  total: number;
  end: number;
  expenses: Expense[];
}

export interface SavingsAccount {
  name: string;
  rate: string;
  percentage: number;
  min: string;
  link: string;
}