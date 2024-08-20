import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    capacity: 0,
    energyUsed: 0,
    totalMoneyEarned: 0,
    rate: 1 // Initialize with a default value
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
    },
    SET_RATE(state, rate) {
      state.rate = rate;
    }
  },
  actions: {
    async fetchData({ commit }, Day) {
      try {
        // Fetch data from the API
        const response = await axios.get('https://backend-powertrack.onrender.com/daily');
        const data = response.data;

        console.log('Fetched data:', data);

        const dayData = data.find(entry => entry.day === `Day ${Day}`);

        if (!dayData) {
          throw new Error('Data for the selected day not found.');
        }

        const capacity = parseFloat(dayData.production.replace(' kWh', '').replace(',', '.'));
        const energyUsed = parseFloat(dayData.consumption.replace(' kWh', '').replace(',', '.'));

        // Check if parsed values are valid numbers
        if (isNaN(capacity) || isNaN(energyUsed)) {
          throw new Error('Invalid data format for capacity or energy used.');
        }

        commit('SET_CAPACITY', capacity);
        commit('SET_ENERGY_USED', energyUsed);

      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    },
    calculateReturn({ commit, state }) {
      const savedUnits = state.capacity - state.energyUsed;
      const totalMoneyEarned = savedUnits * state.rate;
      commit('SET_TOTAL_MONEY_EARNED', totalMoneyEarned);
    }
  }
});