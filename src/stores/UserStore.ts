import { defineStore } from "pinia";

import * as API from "../API/APICalls";

import * as stateData from "../data/state_percentages.json";
import * as currencyData from "../data/currencies.json";

import { type Expense } from "../types";
import { type Paycheck } from "../types";
import { type Debt } from "../types";
import { type Account } from "../types";
import { type OneTimeExpense } from "../types";
import { type SavedPaycheck } from "../types";

export const useUserStore = defineStore("UserStore", {
  state: () => {
    return {
      darkMode: document.cookie
        .split("; ")
        .find((row) => row.startsWith("darkmode="))
        ?.split("=")[1],
      noUser: false,
      dbUserId: "",
      pay: 0,
      payRate: "",
      payFreq: "",
      hours: 0,
      date: "",
      deductions: 0,
      income: 1,
      pay2: 0,
      payRate2: "",
      payFreq2: "",
      hours2: 0,
      date2: "",
      deductions2: 0,
      residence: "",
      relationship: "",
      pIndex: 0,
      pIndex2: 0,
      expenses: [] as Expense[],
      otExpenses: [] as OneTimeExpense[],
      paychecks: [] as Paycheck[],
      paychecks2: [] as Paycheck[],
      savedPaychecks: {} as { [key: string]: SavedPaycheck },
      accounts: [] as Account[],
      debts: [] as Debt[],
      fedTaxRate: 0,
      localTaxRate: 0,
      fedTaxRate2: 0,
      localTaxRate2: 0,
      baseUrl: "https://reyaly-financial-backend-983411f48872.herokuapp.com",
      loading: false,
      error: false,
      currencies: currencyData.currencies,
    };
  },

  actions: {
    // API functions
    // User API methods
    async addUser(data: {}): Promise<any> {
      const res = await API.addUser(data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async editUser(data: {}): Promise<any> {
      const res = await API.editUser(this.dbUserId, data)
        .then((res) => res)
        .catch((err) => console.log(err));
      return res;
    },
    async fill(authUID: string | undefined): Promise<any> {
      this.loading = true;
      await API.getUserInfo(authUID)
        .then((res) => {
          if (res.message !== "Not Found") {
            this.error = false;
            this.noUser = false;
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

            this.income = user.income;
            if (user.income > 1) {
              this.pay2 = user.pay2;
              this.payRate2 = user.rate2;
              this.payFreq2 = user.frequency2;
              this.hours2 = user.hours2;
              this.date2 = user.date2;
              this.deductions2 = user.deductions2;
            }

            this.expenses = this.matchAccountToExpense(res.data.expenses, res.data.accounts);
            this.otExpenses = res.data.otExpenses;
            this.paychecks = res.data.paychecks;
            this.paychecks2 = res.data.paychecks2;
            this.savedPaychecks = res.data.saved_paychecks;
            this.debts = res.data.debts;
            this.accounts = res.data.accounts;

            this.addPaycheckDates(this.paychecks);
            this.addPaycheckDates(this.paychecks2);

            this.loading = false;
          } else {
            this.error = false;
            this.loading = false;
            this.noUser = true;
          }
        })
        .catch((err) => {
          if (err.message === "Not Found") {
            this.error = false;
            this.loading = false;
            this.noUser = true;
          } else {
            this.loading = false;
            this.error = true;
            console.log(err);
          }
        });
    },
    async generateJSON(username: String | undefined): Promise<any> {
      const data = {
        data: {
          userInfo: {
            username: username,
            income: this.income,
            numExpenses: this.expenses.length,
            totalExpenses: `$${this.expenseSum}`,
            nextDate: this.nextPayDay,
            monthly: `$${this.getMonthlyTakeHome()}`,
            pay: `$${this.pay} ${this.payRate}`,
            frequency: this.payFreq,
            hours: this.hours,
            gross: `$${this.getEstGross(1)}`,
            deductions: `$${this.deductions}`,
            fed: `$${this.getFederalTaxWithholding(1)}`,
            local: `$${this.getLocalTaxWithholding(1)}`,
            net: `$${this.getEstNet(1)}`,
            pay2: `$${this.pay2} ${this.payRate2}`,
            frequency2: this.payFreq2,
            hours2: this.hours2,
            gross2: `$${this.getEstGross(2)}`,
            deductions2: `$${this.deductions2}`,
            fed2: `$${this.getFederalTaxWithholding(2)}`,
            local2: `$${this.getLocalTaxWithholding(2)}`,
            net2: `$${this.getEstNet(2)}`,
          },
          expenses: this.expenses,
        },
      };
      const res = await API.sendJson(data, this.dbUserId)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    // Account API methods
    async addAcct(data: Account): Promise<any> {
      const res = await API.addAcct(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async editAcct(data: Account): Promise<any> {
      const res = await API.editAcct(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async deleteAcct(id: string): Promise<any> {
      const res = await API.deleteAcct(this.dbUserId, id)
        .then((res) => {
          this.error = false;
          this.accounts = this.accounts.filter((acct: Account) => acct.id !== id);
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    // Debt API methods
    async addDebt(data: Debt): Promise<any> {
      const res = await API.addDebt(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async editDebt(data: Debt): Promise<any> {
      const res = await API.editDebt(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async deleteDebt(id: string): Promise<any> {
      const res = await API.deleteDebt(this.dbUserId, id)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    // Expense API methods
    async getExpenses(params: string): Promise<any> {
      const res = await API.getExpenses(this.dbUserId, params)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async addExpense(data: Expense): Promise<any> {
      const res = await API.addExpense(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async editExpense(data: Expense): Promise<any> {
      const res = await API.editExpense(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async deleteExpense(id: string): Promise<any> {
      const res = await API.deleteExpense(this.dbUserId, id)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    // One Time Expense API methods
    async getOTExpenses(paycheckId: string): Promise<any> {
      const res = await API.getOTExpenses(this.dbUserId, paycheckId)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async addOTExpense(data: OneTimeExpense): Promise<any> {
      const res = await API.addOTExpense(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async editOTExpense(data: OneTimeExpense): Promise<any> {
      const res = await API.editOTExpense(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async deleteOTExpense(paycheckId: string, id: string): Promise<any> {
      const res = await API.deleteOTExpense(this.dbUserId, paycheckId, id)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    // Saved Paycheck API methods
    async getSavedPaycheck(paycheckId: string): Promise<any> {
      const res = await API.getSavedPaycheck(this.dbUserId, paycheckId)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async addSavedPaycheck(data: SavedPaycheck): Promise<any> {
      const res = await API.addSavedPaycheck(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async editSavedPaycheck(data: SavedPaycheck): Promise<any> {
      const res = await API.editSavedPaycheck(this.dbUserId, data)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    async deleteSavedPaycheck(paycheckId: string, id: string): Promise<any> {
      const res = await API.deleteSavedPaycheck(this.dbUserId, paycheckId, id)
        .then((res) => {
          this.error = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    // Savings API method
    async getSavings(): Promise<any> {
      this.loading = true;
      const res = await API.getSavings()
        .then((res) => {
          this.error = false;
          this.loading = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },
    // Currency API method
    async getCurrencyInfo(want: string, have: string, amount: number): Promise<any> {
      this.loading = true;
      const res = await API.getCurrencyInfo(want, have, amount)
        .then((res) => {
          this.error = false;
          this.loading = false;
          return res;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
      return res;
    },

    // Non API functions
    deleteSecondIncome(): void {
      this.income = 1;
      this.pay2 = 0;
      this.payRate2 = "";
      this.payFreq2 = "";
      this.hours2 = 0;
      this.date2 = "";
      this.deductions2 = 0;
    },
    matchAccountToExpense(expenses: Expense[], accounts: Account[]): Expense[] {
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
    getExpenseTotal(expenseList: Expense[]): number {
      const total = expenseList.reduce((a: any = {}, b: any = {}) => a + b.amount, 0);
      return total;
    },
    formatDays(date: Date): string {
      const usLocale = "en-US";
      return date.toLocaleDateString(usLocale, { timeZone: "UTC" });
    },
    convertDate(expense: Expense, dateArr: string[]): Date {
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
      return new Date(`${month}/${expense.date}/${year}`);
    },
    addConvertedDates(expenseList: Expense[], date: string): void {
      const dateArr: string[] = date?.split("/")!;

      for (const expense of expenseList) {
        const newDateObj = this.convertDate(expense, dateArr);
        expense.dateObj = newDateObj;
        expense.dateStr = newDateObj.toDateString();
      }
    },
    addPaycheckDates(paychecks: Paycheck[]): void {
      for (const check of paychecks) {
        const newDateObj = new Date(check.date.replace(/-/g, "/"));
        check.dateObj = newDateObj;
      }
    },
    combinePaychecks(): Paycheck[] {
      let paychecks = this.paychecks.concat(this.paychecks2);

      paychecks = paychecks.sort((a: any = {} as Paycheck, b: any = {} as Paycheck) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate !== bDate ? aDate.valueOf() - bDate.valueOf() : aDate.valueOf();
      });

      paychecks = paychecks.filter(
        (value, index, self) => index === self.findIndex((check) => check.date === value.date)
      );
      return paychecks;
    },
    sortExpenseDateList(expenseList: Expense[]): void {
      expenseList.sort((a: any = {} as Expense, b: any = {} as Expense) => {
        return a.dateObj - b.dateObj;
      });
    },
    getFederalTaxWithholding(num: number): number {
      const fica = 0.0765;
      const estFica = Math.floor(this.getAfterDeductions(num) * fica);

      let fedIncomeAnnual: number;
      let fedTaxRate: number;

      if (this.relationship === "Single") {
        const annual = this.getEstAnnual(num) > 0 ? this.getEstAnnual(num) - 12950 : 0;
        if (annual < 11000) {
          fedIncomeAnnual = annual * 0.1;
          fedTaxRate = 10;
        } else if (annual > 11001 && annual < 44725) {
          fedIncomeAnnual = 1100 + (annual - 11000) * 0.12;
          fedTaxRate = 12;
        } else if (annual > 44726 && annual < 95375) {
          fedIncomeAnnual = 5147 + (annual - 44725) * 0.22;
          fedTaxRate = 22;
        } else if (annual > 95376 && annual < 182100) {
          fedIncomeAnnual = 16290 + (annual - 95375) * 0.24;
          fedTaxRate = 24;
        } else if (annual > 182101 && annual < 231250) {
          fedIncomeAnnual = 37104 + (annual - 182100) * 0.32;
          fedTaxRate = 32;
        } else if (annual > 231251 && annual < 578125) {
          fedIncomeAnnual = 52832 + (annual - 231250) * 0.35;
          fedTaxRate = 35;
        } else {
          fedIncomeAnnual = 174238.25 + (annual - 578125) * 0.37;
          fedTaxRate = 37;
        }
      } else {
        const annual = this.getEstAnnual(num) - 25900;
        if (annual < 22000) {
          fedIncomeAnnual = annual * 0.1;
          fedTaxRate = 10;
        } else if (annual > 22001 && annual < 89450) {
          fedIncomeAnnual = 2200 + (annual - 22000) * 0.12;
          fedTaxRate = 12;
        } else if (annual > 89451 && annual < 190750) {
          fedIncomeAnnual = 10294 + (annual - 89450) * 0.22;
          fedTaxRate = 22;
        } else if (annual > 190751 && annual < 364200) {
          fedIncomeAnnual = 32580 + (annual - 190750) * 0.24;
          fedTaxRate = 24;
        } else if (annual > 364201 && annual < 462500) {
          fedIncomeAnnual = 74208 + (annual - 364200) * 0.32;
          fedTaxRate = 32;
        } else if (annual > 462501 && annual < 693750) {
          fedIncomeAnnual = 105664 + (annual - 462500) * 0.35;
          fedTaxRate = 35;
        } else {
          fedIncomeAnnual = 186601.5 + (annual - 186601.5) * 0.37;
          fedTaxRate = 37;
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

      if (num === 1) {
        this.fedTaxRate = fedTaxRate;
      } else {
        this.fedTaxRate2 = fedTaxRate;
      }

      return estFedTaxes;
    },
    getLocalTaxWithholding(num: number): number {
      // https://taxfoundation.org/state-income-tax-rates-2023/
      let percentage = stateData[this.residence as keyof typeof stateData];
      let localTaxRate: number;

      const estStateTaxes = Math.floor(this.getAfterDeductions(num) * percentage);

      if (num === 1) {
        this.localTaxRate = percentage * 100;
      } else {
        this.localTaxRate2 = percentage * 100;
      }

      return estStateTaxes;
    },
    getEstAnnual(num: number): number {
      const payRate = num === 1 ? this.payRate : this.payRate2;
      const pay = num === 1 ? this.pay : this.pay2;

      let estAnnual: number;
      if (payRate === "hourly") {
        estAnnual = 40 * pay * 52;
      } else {
        estAnnual = pay;
      }
      return estAnnual;
    },
    getEstGross(num: number): number {
      const payRate = num === 1 ? this.payRate : this.payRate2;
      const pay = num === 1 ? this.pay : this.pay2;
      const hours = num === 1 ? this.hours : this.hours2;

      let estGross: number;
      if (payRate === "hourly") {
        estGross = hours * pay;
      } else {
        const hourly = Math.round((this.pay / 52 / 40) * 100) / 100;
        estGross = hours * hourly;
      }
      return Math.floor(estGross);
    },
    getAfterDeductions(num: number): number {
      const deductions = num === 1 ? this.deductions : this.deductions2;
      return this.getEstGross(num) - deductions;
    },
    getEstNet(num: number): number {
      const afterTaxes =
        this.getAfterDeductions(num) -
        this.getLocalTaxWithholding(num) -
        this.getFederalTaxWithholding(num);

      return Math.floor(afterTaxes);
    },
    getMonthlyTakeHome(): number {
      let takeHome1: number;
      let takeHome2: number;

      const estNet1 = this.getEstNet(1);
      const estNet2 = this.getEstNet(2);

      if (this.payFreq === "weekly") {
        takeHome1 = Math.floor((estNet1 * 52) / 12);
      } else if (this.payFreq === "bi-weekly") {
        takeHome1 = Math.floor((estNet1 * 26) / 12);
      } else if (this.payFreq === "bi-monthly") {
        takeHome1 = estNet1 * 2;
      } else {
        takeHome1 = estNet1;
      }

      if (this.payFreq2 === "weekly") {
        takeHome2 = Math.floor((estNet2 * 52) / 12);
      } else if (this.payFreq2 === "bi-weekly") {
        takeHome2 = Math.floor((estNet2 * 26) / 12);
      } else if (this.payFreq2 === "bi-monthly") {
        takeHome2 = estNet2 * 2;
      } else {
        takeHome2 = estNet2;
      }
      return takeHome1 + takeHome2;
    },
  },

  getters: {
    nextPayDay(): string {
      const userStore = useUserStore();
      const now = new Date();
      const todayUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      let potential1 = new Date("2999-12-31");
      let potential2 = new Date("2999-12-31");

      for (const [i, paycheck] of this.paychecks.entries()) {
        const payDate = new Date(paycheck.date);

        if (todayUTC === payDate) {
          this.pIndex = i;
          potential1 = todayUTC;
          break;
        } else if (todayUTC < payDate) {
          this.pIndex = i - 1;
          potential1 = payDate;
          break;
        }
      }

      for (const [i, paycheck] of this.paychecks2.entries()) {
        const payDate = new Date(paycheck.date);

        if (todayUTC === payDate) {
          this.pIndex2 = i;
          potential2 = todayUTC;
          break;
        } else if (todayUTC < payDate) {
          this.pIndex2 = i - 2;
          potential2 = payDate;
          break;
        }
      }

      if (potential1 < potential2) {
        return userStore.formatDays(potential1);
      } else {
        return userStore.formatDays(potential2);
      }
    },

    expenseSum(): number {
      const expenseSum = this.expenses.reduce((a: any = {}, b: any = {}) => a + b.amount, 0);
      return expenseSum;
    },
  },
});
