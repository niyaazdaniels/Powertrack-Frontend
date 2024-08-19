<template>
  <div class="home">
    <img
      alt="background"
      :class="{ fadeIn: isImageLoaded }"
      src="../assets/AdobeStock_519445978-scaled.jpeg.webp"
      @load="startAnimation"
    />
    <div
      class="text-overlay text-uppercase rounded"
      :class="{ fadeIn: isVisible }"
    >
      <h1 class="display-3">LC STUDIO</h1>
      <p class="display-6">Coding The Future</p>
    </div>
  </div>
  <section class="powertrack-about">
    <div
      class="heading-container pt-5 pb-5 d-inline-flex text-uppercase d-flex flex-wrap justify-content-center"
    >
      <h1 class="text display-5 fw-bold">Power</h1>
      <h1 class="text-success display-5 fw-bold">Track</h1>
    </div>
    <div class="about-container container-fluid p-5">
      <p class="p fs-3">
        Introducing Power Track – an elegant, user-centric application that
        seamlessly connects to your solar and battery inverters. Gain real-time
        insights into your energy production, consumption, and excess energy
        sent back to the grid. Stay informed and optimize your energy use with
        ease, from anywhere in the world.
      </p>
    </div>
    <div
      class="energy-dashboard-section container col-11 p-4 bg-dark bg-gradient rounded shadow-lg"
      id="dashboard"
    >
      <div
        class="dashboard-heading text-light fw-bold text-start pt-5 pb-4 text-capitalize"
      >
        Energy Dashboard
      </div>
      <div class="dashboard-timezones mb-4 container-fluid">
        <ul
          class="navbar text-decoration-none list-unstyled nav-background rounded text-uppercase position-relative justify-content-center"
        >
          <li class="nav-item active">
            <a class="nav-link px-3" href="#">Today</a>
          </li>
          <li class="nav-item">
            <a class="nav-link px-3" href="#">Monthly</a>
          </li>
          <li class="nav-item">
            <a class="nav-link px-3" href="#">Yearly</a>
          </li>
        </ul>
      </div>

      <div class="chart-container d-flex flex-wrap justify-content-between">
        <!-- First Chart -->
        <div class="chart-card col-md-4 mb-4">
          <div class="card h-100 border-0 shadow-lg">
            <div class="card-body bg-dark text-white rounded-lg">
              <h5 class="h5 text-light text-start text-uppercase">
                Production
              </h5>
              <div class="card-text">
                <canvas id="myChart" height="350"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Second Chart -->
        <div class="chart-card col-md-4 mb-4">
          <div class="card h-100 border-0 shadow-lg">
            <div class="card-body bg-dark text-white rounded-lg">
              <h5 class="h5 text-light text-start text-uppercase">Cost</h5>
              <div class="card-text">
                <canvas id="mySecondChart" height="350"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Third Chart -->
        <div class="chart-card col-md-4 mb-4">
          <div class="card h-100 border-0 shadow-lg">
            <div class="card-body bg-dark text-white rounded-lg">
              <h5 class="h5 text-light text-uppercase text-start">
                Usage Estimate
              </h5>
              
              <div class="card-text">
                <canvas id="myThirdChart" height="350"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { nextTick } from "vue";

Chart.register(...registerables);

export default {
  data() {
    return {
      isVisible: false,
      isImageLoaded: false,
      myChart: null,
      mySecondChart: null,
      myThirdChart: null,
      monthlyProduction: 0,
      monthlyConsumption: 0,
      unit: 0,
      sell: 0,
      dailyLabels: [],
      dailyProductionData: [],
      dailyConsumptionData: [],
    };
  },
  methods: {
    startAnimation() {
      this.isVisible = true;
      this.isImageLoaded = true;
    },
    async fetchInverterData() {
      try {
        const response = await axios.get(
          "https://backend-powertrack.onrender.com/inverter"
        );
        const data = response.data[0];

        this.monthlyProduction = parseFloat(
          data.monthly_production.replace(" kWh", "")
        );
        this.monthlyConsumption =
          parseFloat(data.monthly_consumption.replace(" mWh", "")) * 1000;

        this.unit = parseFloat(data.unit.replace("R", "").trim());
        this.sell = parseFloat(data.sell.replace("R", "").trim());

        const dailyResponse = await axios.get(
          "https://backend-powertrack.onrender.com/daily"
        );
        const dailyData = dailyResponse.data;

        this.dailyLabels = dailyData.map((item) => item.day);
        this.dailyProductionData = dailyData.map((item) =>
          parseFloat(item.production.replace(" kWh", ""))
        );
        this.dailyConsumptionData = dailyData.map((item) =>
          parseFloat(item.consumption.replace(" kWh", ""))
        );

        this.initChart();
      } catch (error) {
        console.error("Error fetching inverter data:", error);
      }
    },
    initChart() {
      const ctx1 = document.getElementById("myChart");
      if (ctx1) {
        this.myChart = new Chart(ctx1, {
          type: "doughnut",
          data: {
            labels: ["Solar Production", "Consumption"],
            datasets: [
              {
                data: [this.monthlyProduction, this.monthlyConsumption],
                backgroundColor: ["rgb(255, 255, 1)", "rgb(255, 0, 0)"],
                borderColor: ["rgb(255, 255, 1)", "rgb(255, 0, 0)"],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#ffffff",
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed !== null) {
                      label += `${context.parsed} kWh`;
                    }
                    return label;
                  },
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas element not found for myChart");
      }

      const ctx2 = document.getElementById("mySecondChart");
      if (ctx2) {
        this.mySecondChart = new Chart(ctx2, {
          type: "bar",
          data: {
            labels: ["Unit Cost", "Sell Price"],
            datasets: [
              {
                label: "Cost/Price",
                data: [this.unit, this.sell],
                backgroundColor: ["rgb(255, 0, 0)", "rgb(0, 172, 0)"],
                borderColor: ["rgb(255, 0, 0)", "rgb(0, 172, 0)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#ffffff",
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || context.label || "";
                    const value = context.raw || 0;
                    return `${label}: R${value}`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "#444444",
                },
                ticks: {
                  color: "#ffffff",
                },
              },
              x: {
                grid: {
                  color: "#444444",
                },
                ticks: {
                  color: "#ffffff",
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas element not found for mySecondChart");
      }

      // Line chart
      const ctx3 = document.getElementById("myThirdChart");
      if (ctx3) {
        this.myThirdChart = new Chart(ctx3, {
          type: "line",
          data: {
            labels: this.dailyLabels,
            datasets: [
              {
                label: "Production",
                data: this.dailyProductionData,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
                pointBackgroundColor: "rgb(75, 192, 192)",
                pointBorderColor: "rgb(255, 255, 255)",
                pointBorderWidth: 2,
              },
              {
                label: "Consumption",
                data: this.dailyConsumptionData,
                fill: false,
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
                pointBackgroundColor: "rgb(255, 99, 132)",
                pointBorderColor: "rgb(255, 255, 255)",
                pointBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#ffffff",
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value} kWh`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                  color: "#444444",
                },
                ticks: {
                  color: "#ffffff",
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "#444444",
                },
                ticks: {
                  color: "#ffffff",
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas element not found for myThirdChart");
      }
    },
  },
  mounted() {
    this.fetchInverterData();
  },
};
</script>

<style scoped>
/* Global Styles */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f0f0;
}

/* Home Section */
.home {
  position: relative;
  overflow: hidden;
  color: #fff;
}

.home img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  filter: grayscale(1);
  transition: filter 2s ease-in-out, opacity 2s ease-in-out;
}

.home .fadeIn {
  filter: grayscale(0);
  opacity: 1;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.text-overlay h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.text-overlay p {
  font-size: 2rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

/* PowerTrack About Section */
.powertrack-about {
  background-color: #ffffff;
  padding: 3rem 0;
}

.heading-container {
  text-align: center;
  margin: 2rem 0;
}

.heading-container h1 {
  font-size: 3.5rem;
  margin: 0;
}

.heading-container .text-success {
  color: #28a745;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Energy Dashboard Section */
.energy-dashboard-section {
  background: linear-gradient(135deg, #333333, #666666);
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.dashboard-heading {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.dashboard-timezones {
  margin-bottom: 2rem;
}

/* Navbar Section */
.navbar {
  background-color: #343a40;
  border-radius: 1rem;
}

.nav-item.active .nav-link {
  color: #28a745;
  background-color: #2c2c2c;
  border-radius: 1rem;
}

.nav-link {
  color: #ffffff;
  font-weight: bold;
}

.nav-link:hover {
  color: #28a745;
  background-color: #3c3c3c;
}

/* Chart Cards */
.chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.chart-card {
  flex: 1 1 20%;
}

.card {
  border: 0;
  border-radius: 0.75rem;
  overflow: hidden;
}

.card-body {
  padding: 1.25rem;
}

.card-body.bg-dark {
  background-color: #212529;
}

.card-text {
  margin-top: 0.75rem;
}

.card-title {
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

/* Responsive Design */
@media (max-width: 768px) {
  .text-overlay {
    left: 50%;
    bottom: 30%;
    transform: translateX(-50%);
    max-width: 80%;
    padding: 1rem;
  }

  .text-overlay h1 {
    font-size: 2.5rem;
  }

  .text-overlay p {
    font-size: 1rem;
  }

  .chart-container {
    flex-direction: column;
  }

  .chart-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .text-overlay h1 {
    font-size: 2rem;
  }

  .text-overlay p {
    font-size: 1rem;
  }
}
</style>
