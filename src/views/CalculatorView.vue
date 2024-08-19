<template>
    <div class="home">
      <img
        alt="background"
        :class="{ fadeIn: isImageLoaded }"
        src="../assets/AdobeStock_519445978-scaled.jpeg.webp"
        @load="startAnimation"
      />
    </div>
    <div id="app">
      <div class="container">
        <h1>Energy Calculator</h1>
        <div class="form-group">
          <label for="day">Select Day:</label>
          <input type="number" id="day" v-model.number="day" />
        </div>
        <div class="form-group">
          <label for="rate">Price Rate (R per kWh):</label>
          <input
            type="number"
            id="rate"
            v-model.number="rate"
            step="0.01"
            placeholder="Enter price rate"
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
        <div class="button-group">
          <button @click="fetchData">Fetch Data</button>
        </div>
        <div class="result">{{ resultMessage }}</div>
        <canvas id="energyChart" width="400" height="200"></canvas>
      </div>
  
      <div id="register">
        <div id="ticket">
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
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState } from "vuex";
  import Chart from "chart.js/auto";
  
  export default {
    data() {
      return {
        day: null,
        rate: 1, // Initialize with a default value
        resultMessage: "",
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
          return;
        }
  
        try {
          await this.$store.dispatch("fetchData", this.day);
          // Update the rate in the Vuex store
          this.$store.commit("SET_RATE", this.rate);
          this.resultMessage = `Data fetched: Energy Generated: ${this.capacity} kWh, Energy Used: ${this.energyUsed} kWh`;
          this.calculateReturn();
          this.updateChart();
        } catch (error) {
          this.resultMessage = `Error fetching data: ${error.message}`;
        }
      },
      calculateReturn() {
        this.$store.dispatch("calculateReturn");
      },
      updateChart() {
        const ctx = document.getElementById("energyChart").getContext("2d");
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
                backgroundColor: ["#ff9a00", "#ffcc00", "#66cc66"],
                borderColor: ["#e87c00", "#ffd700", "#44aa44"],
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
        this.updateChart();
      },
      energyUsed() {
        this.updateChart();
      },
    },
  };
  </script>

<style scoped>
.home {
  position: absolute; /* Changed to absolute positioning */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1; /* Ensure it’s behind other content */
  overflow: hidden;
}

.home img {
  filter: grayscale(1);
  height: 100%;
  width: 100%;
  object-fit: cover;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  margin: 0;
}

#app {
  position: relative;
  top: 20px; 
  z-index: 1; 
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  background-color: white;
  position: relative;
  top: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px black;
  max-width: 500px;
  width: 100%;
  margin: 20px;
  height: auto;
  border: 1px solid black;
  z-index: 2;
}

h1 {
  color: #023b21;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 600;
  background: linear-gradient(
    90deg,
    #00f3f0,
    #053bfd
  ); /* Gradient for heading */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-group {
  display: inline-block;
  width: 30%;
  margin-right: 10px;
}

.form-group label {
  font-size: 10px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 6px;
  font-size: 12px;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #00ff89; /* Light green for focus border */
  outline: none;
  box-shadow: 0 0 5px rgba(0, 255, 137, 0.5);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

button {
  background-color: #023b21; /* Dark green for buttons */
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #00ff89; /* Light green for hover */
}

.result {
  margin-top: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #00ff89; /* Light green for success messages */
  text-align: center;
}

#error {
  color: #023b21; /* Dark green for errors */
  font-size: 16px;
  font-weight: 500;
}

.success {
  color: #00ff89; /* Light green for success messages */
  font-size: 16px;
  font-weight: 500;
}

#register {
  width: 100%;
  max-width: 500px;
}

#ticket {
  margin: auto;
  padding: 1em;
  border-radius: 12px;
  box-shadow: 0 4px 8px black;
  border: 1px solid black;
  background-color: white;
}

#ticket h1 {
  text-align: center;
  color: #023b21; /* Dark green for heading */
}

#ticket table {
  font-family: "Courier New", Courier, monospace;
  width: 100%;
  border-collapse: collapse;
}

#ticket td,
#ticket th {
  padding: 8px;
}

#ticket th {
  text-align: left;
  background-color: #f7f7f7;
}

#ticket td,
#ticket #total {
  text-align: left;
}

#ticket tfoot th {
  border-top: 1px solid #ddd;
  font-size: 14px;
  background-color: #f7f7f7;
}
</style>
