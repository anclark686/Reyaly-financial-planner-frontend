<template>
  <div>
    <form
      action="submit"
      @submit.prevent="onSubmit"
      @keydown.enter.prevent=""
      :class="formType === 'new' ? 'settings-form settings-form-green' : 'settings-form'"
    >
      <h3 class="subheader">Basic Info:</h3>
      <table :class="formType === 'new' ? 'basic-info info-centered' : 'basic-info'">
        <tbody>
          <tr class="table-row">
            <td class="basic-label">
              <strong>Username:</strong>
            </td>
            <td>
              {{ user.nickname }}
            </td>
          </tr>
          <tr class="table-row">
            <td class="basic-label">
              <strong>Email Address:</strong>
            </td>
            <td>
              {{ user.email }}
            </td>
          </tr>

          <tr class="table-row">
            <td class="basic-label">
              <strong><label for="residence">State:</label></strong>
            </td>
            <td class="basic-input">
              <select name="residence" id="residence" class="input-info" v-model="newResidence">
                <option value="">-Select One-</option>
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
            <td class="basic-label">
              <strong><label for="relationship">Single or Married:</label></strong>
            </td>
            <td class="basic-input">
              <select
                name="relationship"
                id="relationship"
                class="input-info"
                v-model="newRelationship"
              >
                <option value="">-Select One-</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="subheader">Pay Info:</h3>
      <PayForm
        :number="1"
        :formType="formType"
        :pay="userInfo.pay"
        :rate="userInfo.rate"
        :frequency="userInfo.frequency"
        :hours="userInfo.hours"
        :date="userInfo.date"
        :deductions="userInfo.deductions"
        @form="addPayInfo"
      />

      <div v-if="showSecond">
        <h5 class="additional">Additional source of income</h5>
        <div class="remove-btn">
          <button class="btn btn-danger btn-sm" @click.prevent="showModal = true">Remove X</button>
        </div>
        <PayForm
          :number="2"
          :formType="formType"
          :pay="userInfo.pay2"
          :rate="userInfo.rate2"
          :frequency="userInfo.frequency2"
          :hours="userInfo.hours2"
          :date="userInfo.date2"
          :deductions="userInfo.deductions2"
          @form="addPayInfo"
        />
      </div>

      <div class="add-new-btn" v-else>
        <button class="btn btn-success" @click.prevent="showSecond = true" id="add">
          + Additional Income
        </button>
      </div>

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
    <DeleteModal
      v-if="showModal"
      @close="showModal = false"
      @deleteItem="onDeleteSecond()"
      name="Additional source of income"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { RouterLink } from "vue-router";

import { useUserStore } from "../stores/UserStore";
import { type User } from "../types";
import { type PayData } from "../types";
import PayForm from "./PayForm.vue";
import DeleteModal from "./DeleteModal.vue";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  props: {
    formType: { type: String, required: true },
    userInfo: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  components: {
    RouterLink,
    PayForm,
    DeleteModal,
  },
  data() {
    return {
      userStore: useUserStore(),
      newResidence: this.userInfo.residence,
      newRelationship: this.userInfo.relationship,
      invalid: false,
      duplicate: false,
      loadingSettings: false,
      success: false,
      showSecond: false,
      showModal: false,
      userWithPay: {
        email: "",
        username: "",
        uid: "",
        residence: this.userInfo.residence,
        relationship: this.userInfo.relationship,
        pay: this.userInfo.pay,
        rate: this.userInfo.rate,
        frequency: this.userInfo.frequency,
        hours: this.userInfo.hours,
        date: this.userInfo.date,
        income: this.userInfo.income,
        deductions: this.userInfo.deductions,
        pay2: this.userInfo.pay2,
        rate2: this.userInfo.rate2,
        frequency2: this.userInfo.frequency2,
        hours2: this.userInfo.hours2,
        date2: this.userInfo.date2,
        deductions2: this.userInfo.deductions2,
      },
    };
  },
  methods: {
    addPayInfo(userPayData: PayData) {
      this.invalid = false;
      if (userPayData.number === 1) {
        this.userWithPay.pay = userPayData.pay;
        this.userWithPay.rate = userPayData.rate;
        this.userWithPay.frequency = userPayData.frequency;
        this.userWithPay.hours = userPayData.hours;
        this.userWithPay.date = userPayData.date;
        this.userWithPay.deductions = userPayData.deductions;
      } else {
        this.userWithPay.income = 2;
        this.userWithPay.pay2 = userPayData.pay;
        this.userWithPay.rate2 = userPayData.rate;
        this.userWithPay.frequency2 = userPayData.frequency;
        this.userWithPay.hours2 = userPayData.hours;
        this.userWithPay.date2 = userPayData.date;
        this.userWithPay.deductions2 = userPayData.deductions;
      }
      console.log(this.userWithPay);
    },
    async addUser() {
      this.loadingSettings = true;
      await this.userStore
        .addUser(this.userWithPay)
        .then((res) => {
          this.loadingSettings = false;
          if (res.message === "Duplicate") {
            this.duplicate = true;
          } else if (res.message === "Success") {
            this.userStore.fill(this.user.sub);
            this.$emit("close");
          }
        })
        .catch((err) => console.log(err));
    },
    async editUser() {
      this.loadingSettings = true;
      await this.userStore
        .editUser(this.userWithPay)
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
    onDeleteSecond() {
      this.showSecond = false;
      this.showModal = false;
      this.userStore.deleteSecondIncome();
      this.userWithPay.income = 1;
      this.userWithPay.pay2 = 0;
      this.userWithPay.rate2 = "";
      this.userWithPay.frequency2 = "";
      this.userWithPay.hours2 = 0;
      this.userWithPay.date2 = "";
      this.userWithPay.deductions2 = 0;
    },
    validateInfo() {
      for (const [key, value] of Object.entries(this.userWithPay)) {
        if (!value && !key.includes("2")) {
          return false;
        }
        if (!value && key.includes("2") && this.userWithPay.income === 2 && key !== "deductions2") {
          return false;
        }
      }
      return true;
    },
    onSubmit() {
      this.userWithPay.email = this.user.email!;
      this.userWithPay.username = this.user.nickname!;
      this.userWithPay.uid = this.user.sub!;
      this.userWithPay.residence = this.newResidence;
      this.userWithPay.relationship = this.newRelationship;

      if (this.validateInfo()) {
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
  mounted() {
    if (this.userInfo.income == 2) {
      this.showSecond = true;
    }
  },
});
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
  width: 75%;
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
  padding: 0 5px;
}

.additional {
  margin: 15px auto 0 auto;
}

.x-out {
  background-color: inherit;
  border-radius: 5px;
  margin: 5px auto;
  top: 0;
  right: 0;
}

#add {
  margin-top: 10px;
}

#warning {
  color: var(--red);
  text-align: center;
  margin-top: 20px;
}

.submit-btn,
.small-spinner-container,
.add-new-btn {
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

@media (max-width: 600px) {
  .subheader {
    font-size: 2.5rem;
  }

  .btn {
    font-size: 1.5rem;
  }
}
</style>
