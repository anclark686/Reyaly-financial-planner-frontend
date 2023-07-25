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
      residence: "",
      relationship: "",
      pIndex: 0,
      expenses: [] as Expense[],
      paychecks: [] as Paycheck[],
      accounts: [] as Account[],
      debts: [] as Debt[],
      baseUrl: "https://reyaly-financial-backend-983411f48872.herokuapp.com",
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
            this.residence = user.residence;
            this.relationship = user.relationship;

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
      const res = Axios.post(`${this.baseUrl}/users/${this.dbUserId}/download`, data)
        .then((res) => {
          return res;
        })
        .catch((err) => console.log(err));
      return res;
    },
    // getFederalTaxWithholding(): number {
    //   const fica = 0.0765;
    //   // this.afterDeductions
    //   let fedIncome: number

    //   if (this.relationship === "single") {
    //     if (this.estGross < 142) {
    //       fedIncome = 0
    //     } else if (this.estGross > 142 && this.estGross < 509) {
    //       fedIncome = 0 + ((this.estGross - 142 - 159.60) * 0.1)
    //     } else if (this.estGross > 509 && this.estGross < 1631) {
    //       fedIncome = 36.7 + ((this.estGross - 509 - 159.60) * 0.12)
    //     } else if (this.estGross > 1631 && this.estGross < 3315) {
    //       fedIncome = 171.35 + ((this.estGross - 1631 - 159.60) * 0.22)
    //     } else if (this.estGross > 3315 && this.estGross < 6200) {
    //       fedIncome = 541.82 + ((this.estGross - 3315 - 159.60) * 0.24)
    //     } else if (this.estGross > 6200 && this.estGross < 7835) {
    //       fedIncome = 1234.22 + ((this.estGross - 6200 - 159.60) * 0.32)
    //     } else if (this.estGross > 7835 && this.estGross < 19373) {
    //       fedIncome = 1757.42 + ((this.estGross - 7835 - 159.60) * 0.35)
    //     } else {
    //       fedIncome = 5795.72 + ((this.estGross - 19373 - 159.60) * 0.37)
    //     }
    //   } else {
    //     if (this.estGross < 444) {
    //       fedIncome = 0
    //     } else if (this.estGross > 444 && this.estGross < 1177) {
    //       fedIncome = 0 + ((this.estGross - 440 - 159.60) * 0.1)
    //     } else if (this.estGross > 1177 && this.estGross < 3421) {
    //       fedIncome = 73.3 + ((this.estGross - 1177 - 159.60) * 0.12)
    //     } else if (this.estGross > 3421 && this.estGross < 6790) {
    //       fedIncome = 342.58 + ((this.estGross - 3421 - 159.60) * 0.22)
    //     } else if (this.estGross > 6790 && this.estGross < 12560) {
    //       fedIncome = 1083.76 + ((this.estGross - 6790 - 159.60) * 0.24)
    //     } else if (this.estGross > 12560 && this.estGross < 15829) {
    //       fedIncome = 2468.56 + ((this.estGross - 12560 - 159.60) * 0.32)
    //     } else if (this.estGross > 15829 && this.estGross < 23521) {
    //       fedIncome = 3514.64 + ((this.estGross - 15829 - 159.60) * 0.35)
    //     } else {
    //       fedIncome = 6206.84 + ((this.estGross - 23521 - 159.60) * 0.37)
    //     }
    //   }
    //   const estFica = this.afterDeductions * fica;
    //   const estFedTaxes = Math.floor(fedIncome + estFica);
    //   console.log(`estFica = ${estFica}`)
    //   console.log(`estFedTaxes = ${estFedTaxes}`)
    //   return estFedTaxes
    // },
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
      console.log(`estIncomeTax ${estIncomeTax}`);
      const estFedTaxes = estIncomeTax + estFica;
      console.log(`estFica = ${estFica}`);
      console.log(`estFedTaxes = ${estFedTaxes}`);
      return estFedTaxes;
    },
    getLocalTaxWithholding(): number {
      let percentage: number;

      switch (this.residence) {
        case "AL" || "MS" || "NH" || "KY" || "OH" || "OK":
          percentage = 0.05;
          break;
        case "AZ":
          percentage = 0.0454;
          break;
        case "AR":
          percentage = 0.069;
          break;
        case "CA":
          percentage = 0.133;
          break;
        case "CO":
          percentage = 0.0463;
          break;
        case "CT":
          percentage = 0.0699;
          break;
        case "DE":
          percentage = 0.066;
          break;
        case "DC":
          percentage = 0.0895;
          break;
        case "GA":
          percentage = 0.0575;
          break;
        case "HI":
          percentage = 0.11;
          break;
        case "ID":
          percentage = 0.0693;
          break;
        case "IL":
          percentage = 0.0495;
          break;
        case "IN":
          percentage = 0.0323;
          break;
        case "IA":
          percentage = 0.0853;
          break;
        case "KS":
          percentage = 0.057;
          break;
        case "LA":
          percentage = 0.06;
          break;
        case "ME":
          percentage = 0.0715;
          break;
        case "MD":
          percentage = 0.0575;
          break;
        case "MA":
          percentage = 0.0505;
          break;
        case "MI":
          percentage = 0.0425;
          break;
        case "MN":
          percentage = 0.0985;
          break;
        case "M0":
          percentage = 0.054;
          break;
        case "MT":
          percentage = 0.069;
          break;
        case "NE":
          percentage = 0.0684;
          break;
        case "NJ":
          percentage = 0.1075;
          break;
        case "NM":
          percentage = 0.049;
          break;
        case "NY":
          percentage = 0.0882;
          break;
        case "NC":
          percentage = 0.0525;
          break;
        case "ND":
          percentage = 0.029;
          break;
        case "OR":
          percentage = 0.099;
          break;
        case "PA":
          percentage = 0.0307;
          break;
        case "RI":
          percentage = 0.0599;
          break;
        case "SC":
          percentage = 0.07;
          break;
        case "TN":
          percentage = 0.02;
          break;
        case "UT":
          percentage = 0.0495;
          break;
        case "VT":
          percentage = 0.0875;
          break;
        case "VA":
          percentage = 0.0575;
          break;
        case "WV":
          percentage = 0.065;
          break;
        case "WI":
          percentage = 0.0765;
          break;
        default:
          percentage = 0;
          break;
      }
      const estStateTaxes = Math.floor(this.afterDeductions * percentage);
      console.log(`estStateTaxes = ${estStateTaxes}`);
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
