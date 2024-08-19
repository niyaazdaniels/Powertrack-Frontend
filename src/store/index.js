import axios from 'axios';


const state = {
  monthlyProduction: 0,
  monthlyConsumption: 0,
  unit: 0,
  sell: 0,
  dailyLabels: [],
  dailyProductionData: [],
  dailyConsumptionData: [],
};

const getters = {
  monthlyProduction: (state) => state.monthlyProduction,
  monthlyConsumption: (state) => state.monthlyConsumption,
  unit: (state) => state.unit,
  sell: (state) => state.sell,
  dailyLabels: (state) => state.dailyLabels,
  dailyProductionData: (state) => state.dailyProductionData,
  dailyConsumptionData: (state) => state.dailyConsumptionData,
};

const mutations = {
  setMonthly(state, { monthlyProduction, monthlyConsumption }) {
    state.monthlyProduction = monthlyProduction;
    state.monthlyConsumption = monthlyConsumption;
  },
  setUnits(state, { unit, sell }) {
    state.unit = unit;
    state.sell = sell;
  },
  setDaily(state, { dailyLabels, dailyProductionData, dailyConsumptionData }) {
    state.dailyLabels = dailyLabels;
    state.dailyProductionData = dailyProductionData;
    state.dailyConsumptionData = dailyConsumptionData;
  },
};

const actions = {
  async fetchInverterData({ commit }) {
    try {
      const response = await axios.get('https://backend-powertrack.onrender.com/inverter');
      const data = response.data[0];

      const monthlyProduction = parseFloat(data.monthly_production.replace(' kWh', ''));
      const monthlyConsumption = parseFloat(data.monthly_consumption.replace(' mWh', '')) * 1000;

      const unit = parseFloat(data.unit.replace('R', '').trim());
      const sell = parseFloat(data.sell.replace('R', '').trim());

      commit('setMonthly', { monthlyProduction, monthlyConsumption });
      commit('setUnits', { unit, sell });

      const dailyResponse = await axios.get('https://backend-powertrack.onrender.com/daily');
      const dailyData = dailyResponse.data;

      const dailyLabels = dailyData.map(item => item.day);
      const dailyProductionData = dailyData.map(item => parseFloat(item.production.replace(' kWh', '')));
      const dailyConsumptionData = dailyData.map(item => parseFloat(item.consumption.replace(' kWh', '')));

      commit('setDaily', { dailyLabels, dailyProductionData, dailyConsumptionData });
    } catch (error) {
      console.error('Error fetching inverter data:', error);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
