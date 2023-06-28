<template>
  <div>
    <form
      action="submit"
      @submit.prevent="onSubmit"
      @keydown.enter.prevent=""
      class="settings-form"
      :class="formType === 'new' ? 'settings-form-green' : null"
    >
      <h3 class="subheader">Basic Info:</h3>
      <ul class="basic-info">
        <li><strong>Username:</strong> {{ user.nickname }}</li>
        <li><strong>Email Address:</strong> {{ user.email }}</li>
      </ul>

      <h3 class="subheader">Pay Info:</h3>
      <table class="pay-info" :class="formType === 'new' ? 'info-centered' : null">
        <tr>
          <td class="pay-label">
            <strong><label for="pay">Pay Rate:</label></strong>
          </td>
          <td class="pay-input">
            <input type="number" id="pay" v-model="pay" />
          </td>
        </tr>
        <tr>
          <td class="pay-label">
            <strong><label for="rate">Per:</label></strong>
          </td>
          <td class="pay-input">
            <select name="rate" id="rate" v-model="rate">
              <option value="">--Select One --</option>
              <option value="hourly">Hour</option>
              <option value="annualy">Year</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="pay-label">
            <strong><label for="frequency">Frequency:</label></strong>
          </td>
          <td class="pay-input">
            <select name="frequency" id="frequency" v-model="frequency">
              <option value="">--Select One --</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="bi-monthly">Bi-Monthly</option>
            </select>
          </td>
        </tr>
      </table>

      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
      <div class="submit-btn">
        <input class="btn btn-success" type="submit" id="submit-btn" value="Update Info" />
      </div>
    
      <div v-if="duplicate">
        <p>Looks like you've already registered.</p>
        <p>You can view your settings <RouterLink to="/settings">here.</RouterLink></p>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
// import { useUserStore } from "../stores/UserStore";
import { useAuth0 } from "@auth0/auth0-vue";
import Axios from "axios";

// const userStore = useUserStore();

export default {
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  props: {
    formType: String,
  },
  data() {
    return {
      pay: 0,
      rate: "",
      frequency: "",
      invalid: false,
      duplicate: false,
    };
  },
  computed: {
    userData() {
      const userData = {
        userName: this.user.nickname,
        uid: this.user.sub,
        pay: this.pay,
        rate: this.rate,
        frequncy: this.frequency,
      }
      return userData;
    }
  },
  methods: {
    addInfo() {
      console.log(this.userData)

      Axios.post("http://127.0.0.1:3000/users", this.userData)
        .then((res) => {
          console.log(res.data)
          if (res.data.message === "Duplicate") {
            this.duplicate = true;
          } else if (res.data.message === "Success") {
            this.$emit('close')
          }
        })
        .catch((err) => console.log(err))
    },
    editInfo() {},
    onSubmit() {
      if (this.pay && this.rate && this.frequency) {
        this.invalid = false;
        if (this.formType === "new") {
          this.addInfo()
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
  background-color: white;
}

.settings-form-green {
  background-color: var(--lt-green);
}

.subheader {
  margin: 10px 0px;
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

#pay, #rate, #frequency {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

#pay {
  text-align: right;
}

#warning {
  color: rgb(161, 8, 8);
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

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
