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
    <div class="heading-container pt-5 pb-5 d-inline-flex text-uppercase">
      <h1 class="text display-5 fw-semibold">Power</h1>
      <h1 class="text-success display-5 fw-semibold">Track</h1>
    </div>
    <div class="about-container container-fluid p-5">
      <p class="p display-6">
        Introducing Power Track - a simple, user-friendly app that connects to
        your solar and battery inverters, providing real-time insights into your
        energy production, consumption, and excess energy sent back to the grid.
        Stay informed and optimize your energy use with ease, wherever you are.
      </p>
    </div>
    <div
      class="energy-dashboard-section container col-11 p-2 bg-black bg-gradient rounded" id="dashboard"
    >
      <div
        class="dashboard-heading text-light fw-semibold text-start pt-5 pb-3 px-3 display-6 text-capitalize"
      >
        Energy Dashboard
      </div>
      <div class="dashboard-timezones mb-5 container-fluid">
        <ul
          class="navbar text-decoration-none list-unstyled nav-background rounded text-uppercase position-relative justify-content-center"
        >
          <li class="nav-item active">
            <a class="nav-link px-2" href="#">Today</a>
          </li>
          <li class="nav-item">
            <a class="nav-link px-2" href="#">Monthly</a>
          </li>
          <li class="nav-item">
            <a class="nav-link px-2" href="#">Yearly</a>
          </li>
        </ul>
      </div>

      <table class="table">
        <div class="container-fluid d-inline-block">
          <div class="row">
            <!-- First Chart -->
            <div class="col-md-4 container-fluid">
              <div class="card h-100 border-0 shadow">
                <div class="card-body bg-dark text-white rounded">
                  <h5 class="h5 text-light text-start text-uppercase p-2">
                    Cost Predicted
                  </h5>
                  <div class="card-text">
                    <canvas id="myChart" height="350"></canvas>
                  </div>
                </div>
              </div>
            </div>

            <!-- Second Chart -->
            <div class="col-md-4 container-fluid">
              <div class="card h-100 border-0 shadow">
                <div class="card-body bg-dark text-white rounded">
                  <h5 class="h5 text-light text-start text-uppercase p-2">
                    Change in cost
                  </h5>
                  <div class="card-text">
                    <canvas id="mySecondChart" height="350"></canvas>
                  </div>
                  <p>Cost R1.77</p>
                </div>
              </div>
            </div>

            <!-- Third Chart -->
            <div class="col-md-4 container-fluid">
              <div class="card h-100 border-0 shadow">
                <div class="card-body bg-dark text-white rounded">
                  <h5
                    class="h5 text-light text-uppercase text-light text-start p-2"
                  >
                    Usage Estimate
                  </h5>
                  <div class="row">
                    <div class="col">
                      <p>Predicted:</p>
                    </div>
                    <div class="col">
                      <p>Till now:</p>
                    </div>
                  </div>
                  <div class="card-text">
                    <canvas id="myThirdChart" height="350"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </table>
    </div>
  </section>
</template>

<script>
import { Chart, registerables } from "chart.js";
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
    };
  },
  methods: {
    startAnimation() {
      this.isVisible = true;
      this.isImageLoaded = true;
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
                label: "Usage",
                data: [12, 19],
                borderWidth: 2,
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
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed !== null) {
                      label += `${context.parsed}%`;
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
            labels: ["January", "February"],
            datasets: [
              {
                label: "Monthly Returns",
                data: [10, 25],
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
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed !== null) {
                      label += context.parsed;
                    }
                    return label;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        console.error("Canvas element not found for mySecondChart");
      }

      const ctx3 = document.getElementById("myThirdChart");
      if (ctx3) {
        this.myThirdChart = new Chart(ctx3, {
          type: "line",
          data: {
            labels: ["April", "May", "June", "July", "August"],
            datasets: [
              {
                label: "Usage",
                data: [15, 25, 12, 25, 10],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
                pointBackgroundColor: "rgb(75, 192, 192)",
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
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;
                    }
                    return label;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
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
    nextTick(() => {
      this.initChart();
    });
  },
};
</script>

<style scoped>

/* Chart Card */
.card-title {
  font-size: 1.5rem;
  color: #343a40;
}
.card-text {
  padding: 1rem;
}
.card-body {
  padding: 5px;
  box-shadow: 0px 0px 5px 0px white;
}

/* home  */
.home {
  position: relative;
  color: white;
  overflow: hidden;
}

/* background image */
img {
  filter: grayscale(1);
  transition: filter 2s ease-in;
  height: 100vh;
  width: 100%;
  object-fit: cover;
}

img.fadeIn {
  filter: grayscale(0);
}

/* text ontop of image */
.text-overlay.fadeIn {
  opacity: 1;
}

.text-overlay {
  position: absolute;
  bottom: 75px;
  left: 20px;
  text-align: left;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  opacity: 0;
  transition: opacity 1s ease-in;
  width: auto;
  max-width: 500px;
}

h1.display-3 {
  font-size: 4.5rem;
}

p.display-6 {
  font-size: 1.5rem;
}

/* Navigation Background */
.nav-background {
  position: relative;
  padding: 15px 10px;
  width: fit-content;
  margin: 10px 0;
  background: rgba(153, 153, 153, 0.6);
}

.nav-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(156, 156, 156, 0.4);
  z-index: -1;
}

.nav-background * {
  position: relative;
  z-index: 1;
}

.nav-link {
  color: white;
}

.nav-item:active {
  background-color: rgb(66, 66, 66);
  border-radius: 5%;
}

/* media queries */
@media (max-width: 768px) {
  .text-overlay {
    left: 50%;
    bottom: 50%;
    transform: translateX(-50%);
    text-align: center;
    max-width: 400px;
  }

  h1.display-3 {
    font-size: 2.25rem;
  }

  p.display-6 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  h1.display-3 {
    font-size: 1.75rem;
  }

  p.display-6 {
    font-size: 1rem;
  }
}
</style>
