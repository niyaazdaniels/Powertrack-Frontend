<template>
  <div class="home">
    <img
      alt="background"
      :class="{ fadeIn: isImageLoaded }"
      src="../assets/AdobeStock_519445978-scaled.jpeg.webp"
      @load="startAnimation"
    />
    <div id="app">
      <div class="container">
        <h1>Energy Calculator</h1>
        <div class="form-group-container d-sm-flex">
          <div class="form-group">
            <label for="day">Select Day:</label>
            <input
              type="number"
              id="day"
              v-model.number="day"
              required
              placeholder="Select a day"
            />
          </div>
          <div class="form-group">
            <label for="rate">Price Rate (R per kWh):</label>
            <input
              type="number"
              id="rate"
              v-model.number="rate"
              step="0.01"
              placeholder="Enter price rate"
              required
            />
          </div>
          <div class="form-group">
            <label for="capacity">Energy Generated (kWh):</label>
            <input
              type="number"
              id="capacity"
              v-model.number="capacity"
              step="0.01"
              placeholder="Enter energy generated"
              readonly
            />
          </div>
          <div class="form-group">
            <label for="energyUsed">Energy Used (kWh):</label>
            <input
              type="number"
              id="energyUsed"
              v-model.number="energyUsed"
              step="0.01"
              placeholder="Enter energy used"
              readonly
            />
          </div>
        </div>

        <div class="button-group">
          <button @click="fetchData">Fetch Data</button>
        </div>

        <!-- Result -->
        <canvas v-if="isDataFetched" id="energyChart" width="200" height="200"></canvas>
        
        <!-- Register -->
      </div>
      <div
      id="register"
        class="d-flex flex-column flex-wrap"
        v-if="isDataFetched && (savedUnits !== null || totalMoneyEarned !== null)"
      >
      <h1>Your Receipt</h1>
      <table>
        <tbody id="entries">
            <tr>
              <td>Units Sent Back</td>
              <td>{{ savedUnits.toFixed(2) }} kWh</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Amount Paid Back:</th>
              <th id="total">
                R {{ totalMoneyEarned.toFixed(2).replace(".", ",") }}
              </th>
            </tr>
          </tfoot>
        </table>
        <div v-if="isDataFetched" class="result">{{ resultMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Chart from "chart.js/auto";
import { nextTick } from 'vue';

export default {
  data() {
    return {
      day: null,
      rate: 1,
      resultMessage: "",
      isDataFetched: false, // New state variable
    };
  },
  computed: {
    ...mapState(["capacity", "energyUsed", "totalMoneyEarned"]),
    savedUnits() {
      return this.capacity - this.energyUsed;
    },
    resultMessage() {
      if (this.capacity !== null && this.energyUsed !== null) {
        return `Energy Generated - ${this.capacity} kWh, Energy Used - ${this.energyUsed} kWh`;
      }
      return "";
    },
  },
  methods: {
    ...mapActions(["fetchData", "calculateReturn"]),
    async fetchData() {
      if (!this.day) {
        this.resultMessage = "Please select a day.";
        this.isDataFetched = false; // Reset data fetch status
        return;
      }

      try {
        await this.$store.dispatch("fetchData", this.day);
        // Update the rate in the Vuex store
        this.$store.commit("SET_RATE", this.rate);
        this.resultMessage = `Data fetched: Energy Generated: ${this.capacity} kWh, Energy Used: ${this.energyUsed} kWh`;
        this.calculateReturn();
        this.isDataFetched = true; // Set data fetch status to true
        // Wait for the DOM update and then update the chart
        await nextTick();
        this.updateChart();
      } catch (error) {
        this.resultMessage = `Error fetching data: ${error.message}`;
        this.isDataFetched = false; // Reset data fetch status on error
      }
    },
    calculateReturn() {
      this.$store.dispatch("calculateReturn");
    },
    updateChart() {
      const canvas = document.getElementById("energyChart");
      if (!canvas) {
        console.error("Canvas element not found.");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Unable to get canvas context.");
        return;
      }

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Energy Generated", "Energy Used", "Excess Energy"],
          datasets: [
            {
              label: "Energy (kWh)",
              data: [this.capacity, this.energyUsed, this.savedUnits],
              backgroundColor: ["#FFCC00", "#FF9900", "#99CC00"],
              borderColor: ["#FFCC00", "#FF9900", "#99CC00"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  watch: {
    capacity() {
      if (this.isDataFetched) {
        this.updateChart();
      }
    },
    energyUsed() {
      if (this.isDataFetched) {
        this.updateChart();
      }
    },
  },
};
</script><style scoped>
.home {
  position: relative;
  color: white;
  overflow: hidden;
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
}

img {
  filter: blur(2px);
  transition: filter 2s ease-in, opacity 2s ease-in;
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

#app {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1; 
  padding: 20px;
  box-sizing: border-box;
}

.container {
  background: radial-gradient(circle, #2a2a2a, #4d4d4d);
  padding: 30px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

h1 {
  color: #ff9900;
  margin-bottom: 15px;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffcc00, #ff9900);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.form-group-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.form-group {
  flex: 1;
  min-width: 280px;
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #ff9900;
  text-transform: uppercase;
}

.form-group input {
  width: 100%;
  background: #333;
  padding: 10px;
  outline: none;
  border: 2px solid #444;
  border-radius: 5px;
  font-size: 1rem;
  color: #eee;
  transition: border-color 0.7s, box-shadow 0.7s;
}

::placeholder {
  color: #888;
}

.form-group input:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 8px rgba(255, 204, 0, 0.6);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

button {
  background: linear-gradient(135deg, #ff9900, #ff6600);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

button:hover {
  background: linear-gradient(135deg, #ff6600, #ff3300);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.result, #error, .success {
  margin-top: 10px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

#error {
  color: #ff9900;
}

.success {
  color: #ffcc00;
}

#register {
  background: radial-gradient(rgb(73, 73, 73), rgb(124, 124, 124));
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .form-group-container {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 20px;
    max-width: 100%;
  }

  button {
    padding: 12px 24px;
    font-size: 16px;
  }
}
</style>