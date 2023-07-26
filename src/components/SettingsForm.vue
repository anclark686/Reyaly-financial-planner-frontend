<template>
  <div>
    <form
      action="submit"
      @submit.prevent="onSubmit"
      @keydown.enter.prevent=""
      :class="formType === 'new' ? 'settings-form settings-form-green' : 'settings-form'"
    >
      <h3 class="subheader">Basic Info:</h3>
      <ul class="basic-info">
        <li><strong>Username:</strong> {{ user.nickname }}</li>
        <li><strong>Email Address:</strong> {{ user.email }}</li>
      </ul>

      <h3 class="subheader">Pay Info:</h3>
      <table :class="formType === 'new' ? 'pay-info info-centered' : 'pay-info'">
        <tbody>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="pay">Pay Rate:</label></strong>
            </td>
            <td class="pay-input">
              <input
                type="number"
                step="0.01"
                id="pay"
                name="pay"
                class="input-info"
                v-model="newPay"
              />
            </td>
          </tr>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="rate">Per:</label></strong>
            </td>
            <td class="pay-input">
              <select name="rate" id="rate" class="input-info" v-model="newRate">
                <option value="">--Select One--</option>
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
                <option value="">--Select One--</option>
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
              <input
                type="number"
                id="deductions"
                name="deductions"
                class="input-info"
                v-model="newDeductions"
                @keyup.enter="onSubmit"
              />
            </td>
          </tr>
          <tr class="table-row">
            <td class="pay-label">
              <strong><label for="residence">State:</label></strong>
            </td>
            <td class="pay-input">
              <select name="residence" id="residence" class="input-info" v-model="newResidence">
                <option value="">--Select One--</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </td>
          </tr>
          <tr class="table-row">
            <td class="relationship-label">
              <strong><label for="relationship">Single or Married:</label></strong>
            </td>
            <td class="pay-input">
              <select
                name="relationship"
                id="relationship"
                class="input-info"
                v-model="newRelationship"
              >
                <option value="">--Select One--</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
      <div v-if="loadingSettings" class="small-spinner-container">
        <div class="spinner-border text-success loading-spinner" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else class="submit-btn">
        <input class="btn btn-success" type="submit" id="submit-btn" value="Update Info" />
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
    deductions: Number,
    residence: String,
    relationship: String,
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
      newResidence: this.residence,
      newRelationship: this.relationship,
      invalid: false,
      duplicate: false,
      loadingSettings: false,
      success: false,
    };
  },
  computed: {
    userData() {
      const userData = {
        username: this.user.nickname,
        uid: this.user.sub,
        pay: this.newPay,
        rate: this.newRate,
        frequency: this.newFrequency,
        hours: this.newHours,
        date: this.newDate,
        deductions: this.newDeductions,
        residence: this.newResidence,
        relationship: this.newRelationship,
      };
      return userData;
    },
  },
  methods: {
    async addUser() {
      this.loadingSettings = true;
      await this.userStore
        .addUser(this.userData)
        .then((res) => {
          this.loadingSettings = false;
          if (res.message === "Duplicate") {
            this.duplicate = true;
          } else if (res.message === "Success") {
            this.userStore.fill(this.user.sub);
            this.$emit("close", this.userData);
          }
        })
        .catch((err) => console.log(err));
    },
    async editUser() {
      this.loadingSettings = true;
      await this.userStore
        .editUser(this.userData)
        .then((res) => {
          if (res.message === "Success") {
            this.loadingSettings = false;
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 5000);
          }
        })
        .catch((err) => console.log(err));
    },
    onSubmit() {
      if (this.newPay && this.newRate && this.newFrequency && this.newHours) {
        this.invalid = false;
        if (this.formType === "new") {
          this.addUser();
        } else if (this.formType === "update") {
          this.editUser();
        }
      } else {
        this.invalid = true;
      }
    },
  },
};
</script>

<style scoped>
.settings-form {
  background-color: var(--white-black);
  color: var(--text-color);
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

.submit-btn,
.small-spinner-container {
  margin: 50px;
  text-align: center;
  margin: 0px auto;
}

#submit-btn,
.loading-spinner {
  margin: 20px;
}

#success {
  color: var(--med-green);
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 1000px) {
  .subheader {
    font-size: 2.5rem;
  }

  .btn {
    font-size: 1.5rem;
  }
}
</style>
