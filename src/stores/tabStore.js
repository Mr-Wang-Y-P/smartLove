import { defineStore } from 'pinia';

export const useTabStore = defineStore('tabStore', {
  state: () => ({
    activeTabIndex: 0,
  }),

  actions: {
    setActiveTabIndex(index) {
      this.activeTabIndex = index;
    }
  },

  getters: {
    getActiveTabIndex() {
      return this.activeTabIndex;
    }
  }
});
