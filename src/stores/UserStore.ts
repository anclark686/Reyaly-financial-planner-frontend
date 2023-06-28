import { defineStore } from 'pinia'

export const useUserStore = defineStore("UserStore", {

    state: () => {
        return {
            darkMode: false,
        }
    }

    // actions

    // getters
})