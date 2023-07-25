import { defineStore } from "pinia";
import Axios from "axios";

import { type Expense } from "../types";
import { type Paycheck } from "../types";
import { type Debt } from "../types";
import { type Account } from "../types";

export const useUserStore = defineStore("UserStore", {
  state: () => {
    return {
      darkMode: document.cookie
        .split("; ")
        .find((row) => row.startsWith("darkmode="))
        ?.split("=")[1],
      dbUserId: "",
      pay: 0,
      payRate: "",
      payFreq: "",
      hours: 0,
      date: "",
      deductions: 0,
      pIndex: 0,
      expenses: [] as Expense[],
      paychecks: [] as Paycheck[],
      accounts: [] as Account[],
      debts: [] as Debt[],
      baseUrl: "http://127.0.0.1:3000",
      loading: false,
    };
  },

  actions: {
    async fill(authUID: String | undefined) {
      this.loading = true;
      await Axios.get(`${this.baseUrl}/users/?uid=${authUID}`)
        .then((res) => {
          if (res.data.message !== "Not Found") {
            const user = res.data.data.user;
            this.dbUserId = user._id.$oid;
            this.pay = user.pay;
            this.payRate = user.rate;
            this.payFreq = user.frequency;
            this.hours = user.hours;
            this.date = user.date;
            this.deductions = user.deductions;

            this.expenses = this.matchAccountToExpense(
              res.data.data.expenses,
              res.data.data.accounts
            );
            this.paychecks = res.data.data.paychecks;
            this.debts = res.data.data.debts;
            this.accounts = res.data.data.accounts;

            this.loading = false;
            console.log(res.data.data);
          }
        })
        .catch((err) => console.log(err));
    },
    matchAccountToExpense(expenses: Expense[], accounts: Account[]) {
      const acctObj = {} as any;
      for (const acct of accounts) {
        acctObj[acct.id] = acct.name;
      }

      for (const expense of expenses) {
        if (expense.account) {
          expense.account = acctObj[expense.account];
        }
      }
      return expenses;
    },
    getExpenseTotal(expenseList: Expense[]) {
      const total = expenseList.reduce((a: any = {}, b: any = {}) => a + b.amount, 0);
      return total;
    },
    formatDays(date: Date) {
      const usLocale = "en-US";
      return date.toLocaleDateString(usLocale, { timeZone: "UTC" });
    },
    generateJSON(username: String | undefined) {
      const data = {
        data: {
          userInfo: {
            username: username,
            pay: `$${this.pay} ${this.payRate}`,
            payFreq: this.payFreq,
            hours: this.hours,
            deductions: `$${this.deductions}`,
            gross: `$${this.estGross}`,
            net: `$${this.estNet}`,
            numExpenses: this.expenses.length,
            totalExpenses: `$${this.expenseSum}`,
            startDate: this.formatDays(new Date(this.date)),
            nextDate: this.nextPayDay,
          },
          expenses: this.expenses,
        },
      };
      const res = Axios.post(`${this.baseUrl}/users/${this.dbUserId}/download`, data)
        .then((res) => {
          return res
        })
        .catch((err) => console.log(err));
      return res
    },
  },

  getters: {
    nextPayDay(): string {
      const userStore = useUserStore();
      const today = new Date();
      for (const [i, paycheck] of this.paychecks.entries()) {
        const payDate = new Date(paycheck.date);

        if (today === payDate) {
          this.pIndex = i;
          return userStore.formatDays(today);
        } else if (today < payDate) {
          this.pIndex = i;
          return userStore.formatDays(payDate);
        }
      }
      return this.date;
    },
    estGross(): number {
      let estGross: number

      if (this.payFreq === "monthly") {
        estGross = this.hours * this.pay;
      } else {
        const hourly = Math.round(((this.pay / 52) / 40) * 100) / 100 
        estGross = this.hours * hourly
      }
      console.log(estGross)
      return estGross
    },
    estNet(): number {
      const afterDeductions = this.estGross - this.deductions;
      return afterDeductions * 0.75;
    },
    expenseSum(): number {
      const expenseSum = this.expenses.reduce((a: any = {}, b: any = {}) => a + b.amount, 0);
      return expenseSum;
    },
  },
});
