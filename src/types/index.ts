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

export interface Data {
    data: any;
    message: string;
    status: string;
}

export interface Dataless {
  message: string;
  status: string;
}

export interface Created {
  data: any;
  message: string;
  status: string;
}
