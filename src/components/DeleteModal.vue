<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3 name="header">Are you sure?</h3>
          </div>
          <hr />
          <div class="modal-body">
            <p name="body">Are you sure you want to delete</p>
            <p name="body" id="title">{{ name }}?</p>
          </div>

          <div class="modal-footer">
            <button class="modal-btn btn btn-secondary" id="cancel" @click="$emit('close')">
              Cancel
            </button>
            <button class="modal-btn btn btn-danger" id="delete" @click="$emit('deleteItem')">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  props: {
    name: { type: String, required: true },
  },
  methods: {
    onClickButton(): void {
      this.$emit("clicked");
    },
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 350px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: var(--white-black);
  border-radius: 5px;
  border: 2px solid var(--black-white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  color: var(--text-color);
}

.modal-header h3 {
  margin-top: 0;
  color: var(--red);
}

.modal-body {
  margin: 20px 0;
  text-align: center;
}

#title {
  font-weight: bold;
}

.modal-footer {
  text-align: center;
  padding: 0;
  justify-content: center;
}

.modal-btn {
  color: white;
  width: 100px;
  margin: 20px 10px;
  border-radius: 5px;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
