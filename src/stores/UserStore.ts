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
            this.payRate = user.pay_rate;
            this.payFreq = user.pay_freq;
            this.hours = user.hours;
            this.date = user.date;
            this.deductions = user.deductions;

            this.expenses = this.matchAccountToExpense(res.data.data.expenses, res.data.data.accounts);
            this.paychecks = res.data.data.paychecks;
            this.debts = res.data.data.debts;
            this.accounts = res.data.data.accounts;
            
            this.loading = false;
            console.log(res.data.data);
          }
        })
        .catch((err) => console.log(err));
    },
    async getUpdatedAccts() {
      await Axios.get(`${this.baseUrl}/users/${this.dbUserId}/accounts`)
        .then((res) => {
          this.accounts = res.data.data;
        })
        .catch((err) => console.log(err))
    },
    matchAccountToExpense(expenses: Expense[], accounts: Account[]) {
      const acctObj = {} as any
      for (const acct of accounts) {
        acctObj[acct.id] = acct.name
      }

      for (const expense of expenses) {
        if (expense.account) {
          expense.account = acctObj[expense.account]
        }
      }
      return expenses
    },
    getExpenseTotal(expenseList: Expense[]) {
      const total = expenseList.reduce(
        (a: any = {}, b: any = {}) => a + b.amount,
        0
      );
      return total;
    },
    consoleSomething() {
      console.log("hello")
    },
    // addDays(date: string, days: number) {
    //   const result = new Date(date);
    //   result.setDate(result.getDate() + days);
    //   return new Date(result.getTime() - result.getTimezoneOffset() * -60000);
    // },
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
            nextDate: this.nextPayDay
          },
          expenses: this.expenses
        }
        
      }
      Axios.post(`${this.baseUrl}/users/${this.dbUserId}/download`, data)
        .then((res) => {
          console.log(res)
        })  
        .catch((err) => console.log(err))
    }
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
      return this.hours * this.pay
    },
    estNet(): number {
      const afterDeductions = this.estGross - this.deductions
      return afterDeductions * .75
    },
    expenseSum(): number {
      const expenseSum = this.expenses.reduce(
        (a: any = {}, b: any = {}) => a + b.amount,
        0
      );
      return expenseSum;
    },
    //   console.log(this.date)
    //   const ogPayDate = new Date(this.date);
    //   console.log(ogPayDate)
    //   const ogPayDateStr = ogPayDate.toISOString().substring(0, 10);
    //   const today = new Date();
    //   const todayStr = today.toISOString().substring(0, 10);
    //   let dateDiff: number;
    //   let newPayDay = today
    //   let newMonth = today.getMonth() + 2;
    //   let year: number;
    //   let calc: number

    //   const diff = Math.floor((today.valueOf() - ogPayDate.valueOf()) / (1000*60*60*24))

    //   const userStore = useUserStore();

    //   if (newMonth === 13) {
    //     newMonth = 1;
    //     year = today.getFullYear() + 1;
    //   } else {
    //     year = today.getFullYear();
    //   }

    //   if (this.payFreq === "weekly") {
    //     dateDiff = 7;
    //   } else if (this.payFreq === "bi-weekly") {
    //     dateDiff = 14;
    //   } else {
    //     dateDiff = 0
    //   }

    //   if (dateDiff !== 0) {
    //     if (diff % dateDiff === 0) {
    //       calc = diff;
    //     } else {
    //       calc = (dateDiff - (diff % dateDiff)) + diff;
    //     }
    //     newPayDay = userStore.addDays(ogPayDateStr, calc)
    //   }

    //   if (this.payFreq === "monthly") {
    //     console.log("monthly");
    //     if (today.getDate() !== 1) {
    //       newPayDay = new Date(`${year}-${newMonth}-${1}`);
    //     } else {
    //       newPayDay = today;
    //     }

    //   } else if (this.payFreq === "bi-monthly") {
    //     console.log("bi-monthly");
    //     if (today.getDate() !== 1 && today.getDate() !== 15) {
    //       if (today.getDate() < 15) {
    //         newPayDay = new Date(`${year}-${today.getMonth() + 1}-${15}`);
    //       } else {
    //         newPayDay = new Date(`${year}-${newMonth}-${1}`);
    //       }
    //     } else {
    //       newPayDay = today;
    //     }
    //   }
    //   return newPayDay.toLocaleDateString();
    // },
  },
});
