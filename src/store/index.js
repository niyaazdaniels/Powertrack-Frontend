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
    async fetchData({ commit }, Day) {
      try {
        // Fetch data from the API
        const response = await axios.get('https://backend-powertrack.onrender.com/daily');
        const data = response.data;
    
        // Debug: Log the response data to check its format
        console.log('Fetched data:', data);
    
        // Adjusted to match the new format "Day 1"
        const dayData = data.find(entry => entry.day === `Day ${Day}`);
    
        if (!dayData) {
          throw new Error('Data for the selected day not found.');
        }
    
        // Parse and clean the capacity and energy used values
        const capacity = parseFloat(dayData.production.replace(' kWh', '').replace(',', '.'));
        const energyUsed = parseFloat(dayData.consumption.replace(' kWh', '').replace(',', '.'));
    
        // Check if parsed values are valid numbers
        if (isNaN(capacity) || isNaN(energyUsed)) {
          throw new Error('Invalid data format for capacity or energy used.');
        }
    
        // Commit the parsed values to the store
        commit('SET_CAPACITY', capacity);
        commit('SET_ENERGY_USED', energyUsed);
    
      } catch (error) {
        // Log the error message and re-throw to handle it in the component
        console.error(`Error fetching data: ${error.message}`);
        throw error; // Re-throw error to handle it in the component
      }
    
    },
    calculateReturn({ commit, state }) {
      const RATE = 1;
      const savedUnits = state.capacity - state.energyUsed;
      const totalMoneyEarned = savedUnits * RATE;
      commit('SET_TOTAL_MONEY_EARNED', totalMoneyEarned);
    }
  }
});
