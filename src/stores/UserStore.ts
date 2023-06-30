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
  },

  // getters
});
