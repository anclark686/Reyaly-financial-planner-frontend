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
              <input type="number" id="pay" name="pay" class="input-info" v-model="newPay" />
            </td>
          </tr>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="rate">Per:</label></strong>
            </td>
            <td class="pay-input">
              <select name="rate" id="rate" class="input-info" v-model="newRate">
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
              <select name="frequency" id="frequency" class="input-info" v-model="newFrequency">
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
                class="input-info"
                v-model="newHours"
              />
            </td>
          </tr>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="date">Pay Start Date:</label></strong>
            </td>
            <td class="pay-input">
              <input type="date" id="date" name="date" class="input-info" v-model="newDate" />
            </td>
          </tr>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="deductions">Deductions:</label></strong>
            </td>
            <td class="pay-input">
              <input type="number" id="deductions" name="deductions" class="input-info" v-model="newDeductions" />
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
      <div v-if="loading"  class="spinner-container">
        <div class="spinner-border text-success loading-spinner" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else class="submit-btn">
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

      <div v-if="success">
        <p id="success">Changes Successfully Saved!</p>
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
    date: String,
    deductions: Number
  },
  data() {
    return {
      userStore: useUserStore(),
      newPay: this.pay,
      newRate: this.rate,
      newFrequency: this.frequency,
      newHours: this.hours,
      newDate: this.date,
      newDeductions: this.deductions,
      invalid: false,
      duplicate: false,
      loading: false,
      success: false
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
        date: this.newDate,
        deductions: this.newDeductions
      };
      return userData;
    },
  },
  methods: {
    addInfo() {
      this.loading = true
      Axios.post(`${this.userStore.baseUrl}/users`, this.userData)
        .then((res) => {
          this.loading = false
          console.log(res.data);
          if (res.data.message === "Duplicate") {
            this.duplicate = true;
          } else if (res.data.message === "Success") {
            this.userStore.dbUserId = res.data.id;
            this.$emit("close", this.userData);
          }
        })
        .catch((err) => console.log(err));
    },
    editInfo() {
      this.loading = true
      Axios.put(`${this.userStore.baseUrl}/users/${this.userStore.dbUserId}`, this.userData)
        .then((res) => {
          console.log(res.data)
          if (res.data.message === "Success") {
            this.loading = false
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 5000);
          }
        })
        .catch((err) => console.log(err))
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
  mounted() {
    this.userStore.fill(this.user.sub)
  },
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

.input-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

#pay,
#hours,
#deductions {
  text-align: right;
}

#warning {
  color: var(--red);
  text-align: center;
  margin-top: 20px;
}

.submit-btn, .spinner-container {
  margin: 50px;
  text-align: center;
  margin: 0px auto;
}

#submit-btn, .loading-spinner {
  margin: 20px;
}

#success {
  color: var(--med-green);
  text-align: center;
  margin-top: 20px;
}

</style>
