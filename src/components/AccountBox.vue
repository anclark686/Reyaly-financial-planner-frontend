<template>
  <section>
    <main class="account-details">
      <h5 class="subheader">Account Details</h5>
      <table class="details-table">
        <thead class="details-header">
          <td>Start Balance</td>
          <td>Expense Total</td>
          <td>End Balance</td>
        </thead>
        <tbody>
          <td>${{ account.start }}</td>
          <td>${{ total }}</td>
          <td>${{ account.end }}</td>
        </tbody>
      </table>
      <h5 class="subheader">Expenses</h5>
      <div class="expense-list" v-if="account.expenses.length > 0">
        <MasterList pageType="accountBox-noML" :expenses="account.expenses" />
      </div>
    </main>

    <div class="button-container">
      <button class="modify-btn btn btn-success btn-sm" @click="editAcct()">Edit</button>
      <button
        class="modify-btn btn btn-success btn-sm"
        @click="preDelete(account.id, account.name)"
      >
        Delete
      </button>
    </div>
    <DeleteModal
      v-if="showModal"
      @close="showModal = false"
      @deleteItem="deleteAcct(deleteInfo.id)"
      :name="deleteInfo.title"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import MasterList from "./MasterList.vue";
import DeleteModal from "./DeleteModal.vue";
import { useUserStore } from "../stores/UserStore";
import { type Account } from "../types";

export default defineComponent({
  props: {
    account: {
      type: Object as PropType<Account>,
      required: true,
    },
  },
  components: {
    MasterList,
    DeleteModal,
  },
  data() {
    return {
      userStore: useUserStore(),
      edit: false,
      showModal: false,
      deleteInfo: {} as { id: string; title: string },
    };
  },
  computed: {
    total(): number {
      return this.userStore.getExpenseTotal(this.account.expenses);
    },
  },
  methods: {
    editAcct(): void {
      this.$emit("edit", this.account);
    },
    preDelete(id: string, title: string): void {
      this.showModal = true;
      this.deleteInfo = { id: id, title: title };
    },
    async deleteAcct(id: string): Promise<any> {
      await this.userStore
        .deleteAcct(id)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
  },
});
</script>

<style scoped>
.subheader {
  text-align: center;
}

.account-details {
  text-align: left;
}

.details-table {
  width: 100%;
  margin: 20px auto;
  text-align: center;
  border: 2px solid var(--black-white);
  color: var(--text-color);
}

.details-header {
  font-weight: bold;
  border: 2px solid var(--black-white);
  background-color: var(--med-green);
  color: white;
}

.modify-btn {
  border-radius: 5px;
  width: 80px;
  margin: 5px;
}

@media (max-width: 1024px) {
  .subheader {
    font-size: 2rem;
  }

  .modify-btn {
    width: 80px;
    font-size: 1rem;
  }
}
</style>
