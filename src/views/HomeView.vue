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
      class="energy-dashboard-section container col-12 p-2  bg-dark bg-gradient rounded shadow-lg"
      id="dashboard"
    >
      <div
        class="dashboard-heading text-light fw-bold text-start pt-5 pb-4 px-3 text-capitalize"
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
        </ul>
      </div>

      <div class="chart-container d-flex flex-wrap justify-content-between">
        <!-- First Chart -->
        <div class="chart-card col-md-4 mb-4">
          <div class="card h-100 border-0 shadow-lg">
            <div class="card-body p-3 bg-dark text-white rounded-lg">
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
            <div class="card-body p-3 bg-dark text-white rounded-lg">
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
            <div class="card-body p-3 bg-dark text-white rounded-lg">
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

  <section id="our-partners pb-5 pt-5">
    <div
      class="our-partners-heading-container d-flex justify-content-center text-uppercase flex-wrap"
    >
      <h1 class="our-partners-heading-our px-1 fw-semibold">Our</h1>
      <h1 class="our-partners-heading-partner px-3 fw-semibold">Partners</h1>
    </div>
    <div class="our-partners-sub-heading">
      <p class="our-partners-sub-heading-text">
        Companies contributing to the sustainability of our programme
      </p>
    </div>
    <div class="our-partners-companies d-flex justify-content-center">
      <div class="carousel-container">
        <div class="carousel-item">
          <img src="../assets/microsoft-logo.jpg" alt="Microsoft">
        </div>
        <div class="carousel-item">
          <img src="../assets/google-logo.jpg" alt="Google">
        </div>
        <div class="carousel-item">
          <img src="../assets/slack-logo.png" alt="Slack">
        </div>
        <div class="carousel-item">
          <img src="../assets/click-up-logo.png" alt="ClickUp">
        </div>
        <div class="carousel-item">
          <img src="../assets/suptask-logo.webp" alt="Suptask">
        </div>
        <div class="carousel-item">
          <img src="../assets/canva-logo.webp" alt="Canva">
        </div>
        <div class="carousel-item">
          <img src="../assets/mainwp-logo.png" alt="MainWP">
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
                label: ["Cost/Price"],
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

/* Home Section */
.home {
  position: relative;
  overflow: hidden;
  color: #fff;
  height: 100vh;
  background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('../assets/AdobeStock_519445978-scaled.jpeg.webp') no-repeat center center fixed;
  background-size: cover;
  animation: homeBackground 15s ease-in-out infinite;
}

@keyframes homeBackground {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

.home img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.8);
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
  transform: translate(-50%, -50%) scale(0.8);
  text-align: center;
  color: #fff;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 1s ease-in-out, transform 2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
}

.text-overlay h1 {
  font-size: 5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.text-overlay p {
  font-size: 1.5rem;
}

/* PowerTrack About Section */
.powertrack-about {
  background-color: #fff;
  padding: 3rem 1rem;
  position: relative;
  overflow: hidden;
}

.heading-container {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.heading-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #00bcd4, #ffffff, #00bcd4);
  background-size: 200% 100%;
  animation: headingGlow 2s infinite;
}

@keyframes headingGlow {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

.heading-container h1 {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
}

/* Energy Dashboard Section */
.energy-dashboard-section {
  background: linear-gradient(135deg, #1d1d1d, #333);
  margin: 1.5rem auto;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
  position: relative;
  overflow: hidden;
}

.energy-dashboard-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
  animation: pulse 20s infinite ease-in-out;
  pointer-events: none;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.2; }
  50% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(0.8); opacity: 0.2; }
}

.dashboard-heading {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  position: relative;
  color: #e0e0e0;
}

/* Navbar Section */
.navbar {
  background-color: #343a40;
  border-radius: 0.5rem;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.navbar::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  width: calc(100% + 16px);
  height: calc(100% + 16px);
  border: 2px solid #00bcd4;
  border-radius: 0.5rem;
  pointer-events: none;
  opacity: 0.5;
  z-index: -1;
  animation: borderGlow 2s infinite;
}

@keyframes borderGlow {
  0% { border-color: #00bcd4; }
  50% { border-color: #ffffff; }
  100% { border-color: #00bcd4; }
}

.nav-item.active .nav-link {
  color: #fff;
  background-color: #00bcd4;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-link {
  color: #fff;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.nav-link:hover {
  color: #00bcd4;
  background-color: #454d55;
}

/* Chart Cards */
.chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-card {
  flex: 1 1 calc(33.333% - 1rem);
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  animation: cardFloat 5s ease-in-out infinite;
}

@keyframes cardFloat {
  0% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
}

.card {
  border: none;
  overflow: hidden;
}

.card-body {
  padding: 1.5rem;
  position: relative;
}

.card-text {
  margin-top: 1rem;
}

.card-title {
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

/* Our Partners Section */
.our-partners-companies {
  margin: 2rem;
  position: relative;
}

.carousel-container {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 1rem 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  display: inline-block;
  margin-right: 1rem;
  position: relative;
  animation: carouselMove 20s linear infinite;
}

.carousel-item img {
  filter: grayscale(0.5);
  display: block;
  height: auto;
  max-height: 105px;
  transition: filter 0.3s ease, transform 0.3s ease;
}

.carousel-item:hover img {
  filter: grayscale(0);
  transform: scale(1.05);
}

@keyframes carouselMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(-20%); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .text-overlay {
    left: 50%;
    bottom: 25%;
    transform: translateX(-50%);
    max-width: 90%;
    padding: 1rem;
  }

  .text-overlay h1 {
    font-size: 2rem;
  }

  .text-overlay p {
    font-size: 1rem;
  }

  .chart-container {
    flex-direction: column;
  }

  .chart-card {
    flex: 1 1 100%;
  }
}

@media (max-width: 480px) {
  .text-overlay h1 {
    font-size: 1.75rem;
  }
  .text-overlay p {
    font-size: 0.9rem;
  }

  .navbar {
    border-radius: 0;
  }

  .chart-card {
    flex: 1 1 100%;
  }
}
</style>

