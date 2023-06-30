<template>
  <div>
    <form
      action="submit"
      @submit.prevent="onSubmit"
      @keydown.enter.prevent=""
      :class="
        formType === 'new'
          ? 'settings-form settings-form-green'
          : 'settings-form'
      "
    >
      <h3 class="subheader">Basic Info:</h3>
      <ul class="basic-info">
        <li><strong>Username:</strong> {{ user.nickname }}</li>
        <li><strong>Email Address:</strong> {{ user.email }}</li>
      </ul>

      <h3 class="subheader">Pay Info:</h3>
      <table
        :class="formType === 'new' ? 'pay-info info-centered' : 'pay-info'"
      >
        <tbody>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="pay">Pay Rate:</label></strong>
            </td>
            <td class="pay-input">
              <input type="number" id="pay" name="pay" v-model="newPay" />
            </td>
          </tr>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="rate">Per:</label></strong>
            </td>
            <td class="pay-input">
              <select name="rate" id="rate" v-model="newRate">
                <option value="">--Select One --</option>
                <option value="hourly">Hour</option>
                <option value="annualy">Year</option>
              </select>
            </td>
          </tr>
          <tr class="table-row"> 
            <td class="pay-label">
              <strong><label for="frequency">Frequency:</label></strong>
            </td>
            <td class="pay-input">
              <select name="frequency" id="frequency" v-model="newFrequency">
                <option value="">--Select One --</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="bi-monthly">Bi-Monthly</option>
              </select>
            </td>
          </tr>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="hours">Hours per Paycheck:</label></strong>
            </td>
            <td class="pay-input">
              <input
                type="number"
                step="0.01"
                id="hours"
                name="hours"
                v-model="newHours"
              />
            </td>
          </tr>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="pay">Pay Start Date:</label></strong>
            </td>
            <td class="pay-input">
              <input type="date" id="pay" name="pay" v-model="newDate" />
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
      <div class="submit-btn">
        <input
          class="btn btn-success"
          type="submit"
          id="submit-btn"
          value="Update Info"
        />
      </div>

      <div v-if="duplicate">
        <p>Looks like you've already registered.</p>
        <p>
          You can view your settings
          <RouterLink to="/settings">here.</RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import Axios from "axios";
import { useUserStore } from "../stores/UserStore";

export default {
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  props: {
    formType: String,
    pay: Number,
    rate: String,
    frequency: String,
    hours: Number,
  },
  data() {
    return {
      userStore: useUserStore(),
      newPay: this.pay,
      newRate: this.rate,
      newFrequency: this.frequency,
      newHours: this.hours,
      newDate: new Date().toISOString().slice(0,10),
      invalid: false,
      duplicate: false,
    };
  },
  computed: {
    userData() {
      const userData = {
        userName: this.user.nickname,
        uid: this.user.sub,
        pay: this.newPay,
        rate: this.newRate,
        frequency: this.newFrequency,
        hours: this.newHours,
        date: this.newDate
      };
      return userData;
    },
  },
  methods: {
    addInfo() {
      console.log(this.userData);
      console.log(this.pay, this.rate, this.frequency);
      Axios.post("http://127.0.0.1:3000/users", this.userData)
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Duplicate") {
            this.duplicate = true;
          } else if (res.data.message === "Success") {
            console.log(res.data.id);
            this.userStore.dbUserId = res.data.id;
            console.log("in the form");
            console.log(this.userData);
            this.$emit("close", this.userData);
          }
        })
        .catch((err) => console.log(err));
    },
    editInfo() {
      console.log(this.newPay, this.newRate, this.newFrequency, this.newHours, this.newDate);
    },
    onSubmit() {
      if (this.newPay && this.newRate && this.newFrequency && this.newHours) {
        this.invalid = false;
        if (this.formType === "new") {
          this.addInfo();
        } else if (this.formType === "update") {
          this.editInfo();
        }
      } else {
        this.invalid = true;
      }
    },
  },
  // mounted() {
  //   this.userStore.fill(this.user.sub)
  // },
};
</script>

<style scoped>
.settings-form {
  background-color: var(--white-black);
  color: var(--text-color)
}

.settings-form-green {
  background-color: var(--green-bg);
}

.subheader {
  margin: 10px 0px;
  color: var(--text-color);
}

.basic-info {
  list-style: none;
  padding: 0;
}

.pay-info {
  width: 75%;
}

td {
  width: 50%;
}

.info-centered {
  margin: 0 auto;
}

#pay,
#rate,
#frequency,
#hours {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

#pay,
#hours {
  text-align: right;
}

#warning {
  color: var(--red);
  text-align: center;
  margin-top: 20px;
}

.submit-btn {
  margin: 50px;
  text-align: center;
  margin: 0px auto;
}
#submit-btn {
  margin: 20px;
}
</style>
