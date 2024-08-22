<template>
  <div class="app">
    <div class="home">
      <img
        alt="background"
        :class="{ fadeIn: isImageLoaded }"
        src="../assets/calculator-background-transformed.jpeg"
        @load="startAnimation"
      />
      <div class="energy-calculator container">
        <h2>Energy Calculator</h2>
        <form @submit.prevent="fetchData">
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
              placeholder="Energy generated"
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
              placeholder="Energy used"
              readonly
            />
          </div>
          <div class="button-group">
            <button type="submit">Fetch Data</button>
          </div>
          <div class="pdf-button-group">
            <button
              @click="exportToPDF"
              v-if="
                isDataFetched &&
                capacity !== null &&
                energyUsed !== null &&
                savedUnits !== null &&
                totalMoneyEarned !== null
              "
              class="btn btn-export"
            >
              Export as PDF
            </button>
          </div>
        </form>

        <!-- Result -->
        <canvas
          v-if="isDataFetched"
          id="energyChart"
          width="200"
          height="200"
        ></canvas>

        <!-- Register -->
        <div
          id="register"
          class="register"
          v-if="isDataFetched"
        >
          <h2>Your Receipt</h2>
          <table>
            <tbody id="entries">
              <tr>
                <td>Units </td>
                <td>{{ savedUnits.toFixed(2) }} kWh</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Amount in Rands:</th>
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
  </div>
</template>


<script>
import jsPDF from "jspdf";
import { mapActions, mapState } from "vuex";
import Chart from "chart.js/auto";
import { nextTick } from "vue";

export default {
  data() {
    return {
      day: null,
      rate: 1,
      isDataFetched: false,
    };
  },
  computed: {
    ...mapState(["capacity", "energyUsed", "totalMoneyEarned"]),
    savedUnits() {
      return this.capacity - this.energyUsed;
    },
    resultMessage() {
      if (this.capacity !== null && this.energyUsed !== null) {
        if (this.savedUnits <= 0) {
          return "You did not generate enough energy to receive any payment.";
        } else {
          return `Energy Generated: ${this.capacity.toFixed(2)} kWh, Energy Used: ${this.energyUsed.toFixed(2)} kWh. Units Sent Back: ${this.savedUnits.toFixed(2)} kWh. Amount Paid Back: R ${this.totalMoneyEarned.toFixed(2).replace(".", ",")}`;
        }
      }
      return "";
    },
  },
  methods: {
    ...mapActions(["fetchData", "calculateReturn"]),
    async fetchData() {
      if (!this.day) {
        this.resultMessage = "Please select a day.";
        this.isDataFetched = false;
        return;
      }

      try {
        await this.$store.dispatch("fetchData", this.day);
        this.$store.commit("SET_RATE", this.rate);
        this.calculateReturn();
        this.isDataFetched = true;
        await nextTick();
        this.updateChart();
      } catch (error) {
        this.resultMessage = `Error fetching data: ${error.message}`;
        this.isDataFetched = false
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
              backgroundColor: ["#3498db", "#2980b9", "#1abc9c"],
              borderColor: ["#3498db", "#2980b9", "#1abc9c"],
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
    exportToPDF() {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Energy Calculator Report", 10, 20);

      // Line under the title
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(10, 25, 200, 25);

      // Header
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 35);
      doc.text(`Day: ${this.day || "N/A"}`, 10, 45);
      doc.text(`Price Rate: R ${this.rate.toFixed(2)}`, 10, 55);

      // Data Section
      const dataYStart = 65;
      const lineHeight = 10;

      doc.text(
        `Energy Generated: ${
          this.capacity ? this.capacity.toFixed(2) : "N/A"
        } kWh`,
        10,
        dataYStart
      );
      doc.text(
        `Energy Used: ${
          this.energyUsed ? this.energyUsed.toFixed(2) : "N/A"
        } kWh`,
        10,
        dataYStart + lineHeight
      );
      doc.text(
        `Units Sent Back: ${
          this.savedUnits ? this.savedUnits.toFixed(2) : "N/A"
        } kWh`,
        10,
        dataYStart + 2 * lineHeight
      );
      doc.text(
        `Amount Paid Back: R ${
          this.totalMoneyEarned
            ? this.totalMoneyEarned.toFixed(2).replace(".", ",")
            : "N/A"
        }`,
        10,
        dataYStart + 3 * lineHeight
      );

      // Result Message
      if (this.resultMessage) {
        doc.text("Result Message:", 10, dataYStart + 4 * lineHeight);
        doc.text(this.resultMessage, 10, dataYStart + 5 * lineHeight, { maxWidth: 180 });
      }

      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text("Generated by Energy Calculator", 10, 290);
      
      // Save the PDF
      doc.save("energy_calculator_report.pdf");
    }
  }
};
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
  margin: 40px auto;
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

.pdf-button-group {
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

.btn-export {
  background: #f39c12;
  color: #fff;
}

.btn-export:hover {
  background: #e67e22;
}

.result,
#error,
.success {
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
