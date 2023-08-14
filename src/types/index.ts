export interface User {
  residence: string;
  relationship: string;
  pay: number;
  rate: string;
  frequency: string;
  hours: number;
  date: string;
  deductions: number;
  income: number;
  pay2: number;
  rate2: string;
  frequency2: string;
  hours2: number;
  date2: string;
  deductions2: number;
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

export interface OneTimeExpense {
  id: string;
  name: string;
  amount: number;
  date: string;
  paycheck: string;
  dateStr?: string | undefined;
  newPaycheck?: string | undefined;
}

export interface Paycheck {
  date: string;
  income: number;
  id: string;
  dateObj: Date;
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

export interface ConversionData {
  new_amount: number;
  new_currency: string;
  old_amount: number;
  old_currency: string;
}

export interface ExchangeData {
  currency_pair: string;
  exchange_rate: number;
}

export interface PayData {
  number: number;
  pay: number;
  rate: string;
  frequency: string;
  hours: number;
  date: string;
  deductions: number;
}
