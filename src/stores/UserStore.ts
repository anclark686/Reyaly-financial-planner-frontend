import { defineStore } from "pinia";

import * as API from "../API/APICalls";

import * as stateData from '../data/state_percentages.json';
import * as currencyData from "../data/currencies.json";

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
      residence: "",
      relationship: "",
      pIndex: 0,
      expenses: [] as Expense[],
      paychecks: [] as Paycheck[],
      accounts: [] as Account[],
      debts: [] as Debt[],
      loading: false,
      currencies: currencyData.currencies,
    };
  },

  actions: {
    // API functions
    // User API methods
    async addUser(data: {}) {
      const res = await API.addUser(data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async editUser(data: {}) {
      const res = await API.editUser(this.dbUserId, data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async fill(authUID: string | undefined) {
      this.loading = true;
      await API.getUserInfo(authUID)
        .then((res) => {
          console.log(res)
          if (res.message !== "Not Found") {
            const user = res.data.user;
            this.dbUserId = user._id.$oid;
            this.pay = user.pay;
            this.payRate = user.rate;
            this.payFreq = user.frequency;
            this.hours = user.hours;
            this.date = user.date;
            this.deductions = user.deductions;
            this.residence = user.residence;
            this.relationship = user.relationship;

            this.expenses = this.matchAccountToExpense(res.data.expenses, res.data.accounts);
            this.paychecks = res.data.paychecks;
            this.debts = res.data.debts;
            this.accounts = res.data.accounts;

            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch((err) => console.log(err));
    },
    async generateJSON(username: String | undefined) {
      const data = {
        data: {
          userInfo: {
            username: username,
            pay: `$${this.pay} ${this.payRate}`,
            payFreq: this.payFreq,
            hours: this.hours,
            deductions: `$${this.deductions}`,
            residence: this.residence,
            relationship: this.relationship,
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
      const res = await API.sendJson(data, this.dbUserId)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    // Account API methods
    async addAcct(data: Account) {
      const res = await API.addAcct(this.dbUserId, data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async editAcct(data: Account) {
      const res = await API.editAcct(this.dbUserId, data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async deleteAcct(id: string) {
      const res = await API.deleteAcct(this.dbUserId, id)
        .then((res) => {
          this.accounts = this.accounts.filter((acct: Account) => acct.id !== id);
          return res;
        })
        .catch((err) => console.log(err));
      return res;
    },
    // Debt API methods
    async addDebt(data: Debt) {
      const res = await API.addDebt(this.dbUserId, data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async editDebt(data: Debt) {
      const res = await API.editDebt(this.dbUserId, data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async deleteDebt(id: string) {
      const res = await API.deleteDebt(this.dbUserId, id)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    // Expense API methods
    async addExpense(data: Expense) {
      const res = await API.addExpense(this.dbUserId, data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async editExpense(data: Expense) {
      const res = await API.editExpense(this.dbUserId, data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async deleteExpense(id: string) {
      const res = await API.deleteExpense(this.dbUserId, id)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    // Paycheck API method
    async getPaychecks(params: string) {
      const res = await API.getPaychecks(this.dbUserId, params)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    // Savings API method
    async getSavings() {
      this.loading = true;
      const res = await API.getSavings()
        .then((res) => {
          this.loading = false;
          return res
        })
        .catch((err) => console.log(err));
      return res;
    },
    // Currency API method
    async getCurrencyInfo(want: string, have: string, amount: number) {
      this.loading = true;
      const res = await API.getCurrencyInfo(want, have, amount)
        .then((res) => {
          this.loading = false;
          return res
        })
        .catch((err) => console.log(err));
      return res;
    },

    // Non API functions
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
    addConvertedDates(expenseList: Expense[], date: string) {
      const dateArr: string[] = date?.split("/")!;

      for (const expense of expenseList) {
        let month = Number(dateArr[0]);
        let year = Number(dateArr[2]);
        if (expense.date < Number(dateArr[1])) {
          if (month < 12) {
            month++;
          } else {
            month = 1;
            year++;
          }
        }

        const newDateObj = new Date(`${month}/${expense.date}/${year}`);
        expense.dateObj = newDateObj;
        expense.dateStr = newDateObj.toDateString();
      }
    },
    sortExpenseDateList(expenseList: Expense[]) {
      expenseList.sort((a: any = {} as Expense, b: any = {} as Expense) => {
        return a.dateObj - b.dateObj;
      });
    },

    getFederalTaxWithholding(): number {
      const fica = 0.0765;
      const estFica = Math.floor(this.afterDeductions * fica);

      const annual = this.estAnnual;
      let fedIncomeAnnual: number;

      if (this.relationship === "single") {
        const annual = this.estAnnual - 12950;
        if (annual < 11000) {
          fedIncomeAnnual = annual * 0.1;
        } else if (annual > 11001 && annual < 44725) {
          fedIncomeAnnual = 1100 + (annual - 11000) * 0.12;
        } else if (annual > 44726 && annual < 95375) {
          fedIncomeAnnual = 5147 + (annual - 44725) * 0.22;
        } else if (annual > 95376 && annual < 182100) {
          fedIncomeAnnual = 16290 + (annual - 95375) * 0.24;
        } else if (annual > 182101 && annual < 231250) {
          fedIncomeAnnual = 37104 + (annual - 182100) * 0.32;
        } else if (annual > 231251 && annual < 578125) {
          fedIncomeAnnual = 52832 + (annual - 231250) * 0.35;
        } else {
          fedIncomeAnnual = 174238.25 + (annual - 578125) * 0.37;
        }
      } else {
        const annual = this.estAnnual - 25900;
        if (annual < 22000) {
          fedIncomeAnnual = annual * 0.1;
        } else if (annual > 22001 && annual < 89450) {
          fedIncomeAnnual = 2200 + (annual - 22000) * 0.12;
        } else if (annual > 89451 && annual < 190750) {
          fedIncomeAnnual = 10294 + (annual - 89450) * 0.22;
        } else if (annual > 190751 && annual < 364200) {
          fedIncomeAnnual = 32580 + (annual - 190750) * 0.24;
        } else if (annual > 364201 && annual < 462500) {
          fedIncomeAnnual = 74208 + (annual - 364200) * 0.32;
        } else if (annual > 462501 && annual < 693750) {
          fedIncomeAnnual = 105664 + (annual - 462500) * 0.35;
        } else {
          fedIncomeAnnual = 186601.5 + (annual - 186601.5) * 0.37;
        }
      }

      let estIncomeTax: number;

      switch (this.payFreq) {
        case "bi-weekly":
          estIncomeTax = Math.floor(fedIncomeAnnual / 26);
          break;
        case "weekly":
          estIncomeTax = Math.floor(fedIncomeAnnual / 52);
          break;
        case "bi-monthly":
          estIncomeTax = Math.floor(fedIncomeAnnual / 24);
          break;
        default:
          estIncomeTax = Math.floor(fedIncomeAnnual / 12);
          break;
      }

      const estFedTaxes = estIncomeTax + estFica;

      return estFedTaxes;
    },
    getLocalTaxWithholding(): number {
      // https://taxfoundation.org/state-income-tax-rates-2023/
      let percentage = stateData[this.residence as keyof typeof stateData];

      const estStateTaxes = Math.floor(this.afterDeductions * percentage);

      return estStateTaxes;
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
      let estGross: number;
      if (this.payRate === "hourly") {
        estGross = this.hours * this.pay;
      } else {
        const hourly = Math.round((this.pay / 52 / 40) * 100) / 100;
        estGross = this.hours * hourly;
      }
      return Math.floor(estGross);
    },
    estAnnual(): number {
      let estAnnual: number;
      if (this.payRate === "hourly") {
        estAnnual = 40 * this.pay * 52;
      } else {
        estAnnual = this.pay;
      }
      return estAnnual;
    },
    afterDeductions(): number {
      return this.estGross - this.deductions;
    },
    estFedTaxes(): number {
      const userStore = useUserStore();
      return userStore.getFederalTaxWithholding();
    },
    estLocalTaxes(): number {
      const userStore = useUserStore();
      return userStore.getLocalTaxWithholding();
    },
    estNet(): number {
      const afterTaxes = this.afterDeductions - this.estLocalTaxes - this.estFedTaxes;

      return Math.floor(afterTaxes);
    },
    expenseSum(): number {
      const expenseSum = this.expenses.reduce((a: any = {}, b: any = {}) => a + b.amount, 0);
      return expenseSum;
    },
  },
});
