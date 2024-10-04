<template>
  <div class="app">
    <div class="home">
      <img src="../assets/AdobeStock_519445978-scaled.jpeg.webp" alt="Background Image" class="fadeIn" />
      <div class="energy-calculator">
        <header>
          <h2>Solar Energy Calculator</h2>
        </header>
        <form @submit.prevent="calculate">
          <div class="form-group">
            <label for="priceRate">Price Rate (ZAR/kWh):</label>
            <input v-model.number="priceRate" type="number" step="0.01" id="priceRate" placeholder="Enter rate" required>
          </div>
          <div class="form-group">
            <label for="energyGenerated">Energy Generated (kWh):</label>
            <input v-model.number="energyGenerated" type="number" step="0.01" id="energyGenerated" placeholder="Enter generated energy" required>
          </div>
          <div class="form-group">
            <label for="energyUsed">Energy Used (kWh):</label>
            <input v-model.number="energyUsed" type="number" step="0.01" id="energyUsed" placeholder="Enter used energy" required>
          </div>
          <div class="button-group">
            <button type="submit" class="calculate-button">Calculate</button>
          </div>
        </form>
        
        <div v-if="savedEnergy !== null" class="result">
          <p>Energy Saved: <span>{{ savedEnergy.toFixed(2) }} kWh</span></p>
          <p>Amount Paid Back: <span>ZAR {{ amountPaidBack.toFixed(2) }}</span></p>
        </div>

        <!-- Chart component -->
        <div v-if="savedEnergy !== null" class="chart">
          <BarChart :data="chartData" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { defineComponent, ref, reactive } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale);

export default defineComponent({
  components: {
    BarChart: Bar
  },
  setup() {
    const priceRate = ref(0);
    const energyGenerated = ref(0);
    const energyUsed = ref(0);
    const savedEnergy = ref(null);
    const amountPaidBack = ref(null);

    const chartData = reactive({
      labels: ['Current'], // Example static label
      datasets: [
        {
          label: 'Energy Generated (kWh)',
          data: [],
          backgroundColor: '#2ecc71',
          borderColor: '#27ae60',
          borderWidth: 1,
        },
        {
          label: 'Energy Used (kWh)',
          data: [],
          backgroundColor: '#e67e22',
          borderColor: '#d35400',
          borderWidth: 1,
        },
        {
          label: 'Energy Saved (kWh)',
          data: [],
          backgroundColor: '#3498db',
          borderColor: '#2980b9',
          borderWidth: 1,
        },
      ]
    });

    const calculate = () => {
      const generated = energyGenerated.value;
      const used = energyUsed.value;
      const saved = generated - used;
      const amountPaidBackValue = Math.max(0, saved) * priceRate.value;

      savedEnergy.value = Math.max(0, saved);
      amountPaidBack.value = amountPaidBackValue;

      // Update chartData
      chartData.labels = ['Current'];
      chartData.datasets[0].data = [generated];
      chartData.datasets[1].data = [used];
      chartData.datasets[2].data = [savedEnergy.value];
    };

    return {
      priceRate,
      energyGenerated,
      energyUsed,
      savedEnergy,
      amountPaidBack,
      chartData,
      calculate
    };
  }
});
</script>


<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.home {
  flex: 1;
  display: grid;
  place-items: center;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.home img {
  filter: drop-shadow(blue);
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.fadeIn {
  opacity: 1;
}

.energy-calculator {
  position: relative;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  height: max-content;
  z-index: 1;
  text-align: left;
  backdrop-filter: blur(15px);
}

.energy-calculator h2 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 800;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #333;
  font-size: 16px;
  background: #f9f9f9;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input::placeholder {
  color: #aaa;
}

.form-group input:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.button-group {
  margin-top: 20px;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

button:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.result {
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

#error {
  color: #e74c3c;
}

.success {
  color: #2ecc71;
}

.register {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table,
th,
td {
  border: 1px solid #555;
}

th,
td {
  padding: 12px;
  text-align: left;
  font-size: 16px;
}

th {
  background: #444;
  color: #ffcc00;
}

td {
  background: #333;
  color: #eee;
}

tfoot {
  background: #444;
  color: #ffcc00;
  font-weight: 700;
}
.chart {
  margin-top: 20px;
  height: max-content;
  width: 100%;
}

@media (max-width: 768px) {
  .energy-calculator {
    padding: 20px;
    margin: 20px;
  }

  .energy-calculator h2 {
    font-size: 2rem;
  }

  .form-group input {
    font-size: 14px;
  }

  button {
    font-size: 14px;
  }
}
</style>

