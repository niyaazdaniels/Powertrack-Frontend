import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    capacity: 0,
    energyUsed: 0,
    totalMoneyEarned: 0
  },
  mutations: {
    SET_CAPACITY(state, capacity) {
      state.capacity = capacity;
    },
    SET_ENERGY_USED(state, energyUsed) {
      state.energyUsed = energyUsed;
    },
    SET_TOTAL_MONEY_EARNED(state, totalMoneyEarned) {
      state.totalMoneyEarned = totalMoneyEarned;
    }
  },
  actions: {
    async fetchData({ commit }, day) {
      try {
        const response = await axios.get('https://backend-powertrack.onrender.com/daily');
        const data = response.data;
        const dayData = data.find(entry => entry.day === `day${day}`);
        if (!dayData) throw new Error('Data for the selected day not found.');

        const capacity = parseFloat(dayData.production.replace(' kWh', ''));
        const energyUsed = parseFloat(dayData.consumption.replace(' kWh', ''));

        commit('SET_CAPACITY', capacity);
        commit('SET_ENERGY_USED', energyUsed);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        throw error; // Re-throw error to handle it in the component
      }
    },
    calculateReturn({ commit, state }) {
      const RATE = 1; // Example rate
      const savedUnits = state.capacity - state.energyUsed;
      const totalMoneyEarned = savedUnits * RATE;
      commit('SET_TOTAL_MONEY_EARNED', totalMoneyEarned);
    }
  }
});
