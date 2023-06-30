import { defineStore } from "pinia";
import Axios from "axios";

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
      expenses: [] as {}[],
      accounts: [] as {}[],
      debts: [] as {}[],
      baseUrl: 'http://127.0.0.1:3000/'
    };
  },

  actions: {
    async fill(authUID: String | undefined) {
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

            this.expenses = res.data.data.expenses;
          }
          return res.data.data[0];
        })
        .catch((err) => console.log(err));
    },
    addDays(date: string, days: number) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return new Date(result.getTime() - result.getTimezoneOffset() * -60000);
    },
  },

  getters: {
    nextPayDay(): string {
      const ogPayDate = new Date(this.date);
      const ogPayDateStr = ogPayDate.toISOString().substring(0, 10);
      const today = new Date();
      const todayStr = today.toISOString().substring(0, 10);
      let dateDiff: number;
      let newPayDay = today 
      let newMonth = today.getMonth() + 2;
      let year: number;
      let calc: number
      
      const diff = Math.floor((today.valueOf() - ogPayDate.valueOf()) / (1000*60*60*24))

      const userStore = useUserStore();

      if (newMonth === 13) {
        newMonth = 1;
        year = today.getFullYear() + 1;
      } else {
        year = today.getFullYear();
      }
      

      if (this.payFreq === "weekly") {
        dateDiff = 7;
      } else if (this.payFreq === "bi-weekly") {
        dateDiff = 14;
      } else {
        dateDiff = 0
      }

      if (dateDiff !== 0) {
        if (diff % dateDiff === 0) {
          calc = diff;
        } else {
          calc = (dateDiff - (diff % dateDiff)) + diff;
        }
        newPayDay = userStore.addDays(ogPayDateStr, calc)
      }
      
      
      if (this.payFreq === "monthly") {
        console.log("monthly");
        if (today.getDate() !== 1) {
          newPayDay = new Date(`${year}-${newMonth}-${1}`);
        } else {
          newPayDay = today;
        }

      } else if (this.payFreq === "bi-monthly") {
        console.log("bi-monthly");
        if (today.getDate() !== 1 && today.getDate() !== 15) {
          if (today.getDate() < 15) {
            newPayDay = new Date(`${year}-${today.getMonth() + 1}-${15}`);
          } else {
            newPayDay = new Date(`${year}-${newMonth}-${1}`);
          }
        } else {
          newPayDay = today;
        }
      }
      return newPayDay.toLocaleDateString();
    },
  }
});
