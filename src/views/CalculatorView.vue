<template>
  <div class="container">
    <header>
      <h1>Solar Energy Calculator</h1>
    </header>
    <form @submit.prevent="calculate" class="calculator-form">
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
      <button type="submit" class="calculate-button">Calculate</button>
    </form>
    
    <div v-if="savedEnergy !== null" class="results">
      <h2>Results</h2>
      <p>Energy Saved: <span class="result-value">{{ savedEnergy.toFixed(2) }} kWh</span></p>
      <p>Amount Paid Back: <span class="result-value">ZAR {{ amountPaidBack.toFixed(2) }}</span></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      priceRate: 0,
      energyGenerated: 0,
      energyUsed: 0,
      savedEnergy: null,
      amountPaidBack: null
    };
  },
  methods: {
    calculate() {
      const savedEnergy = this.energyGenerated - this.energyUsed;
      const amountPaidBack = savedEnergy * this.priceRate;
      
      this.savedEnergy = Math.max(0, savedEnergy);
      this.amountPaidBack = Math.max(0, amountPaidBack);
    }
  }
};
</script>

<style scoped>
/* Container styling */
.container {
  max-width: 700px;
  margin: auto;
  padding: 30px;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  font-family: 'Roboto', sans-serif;
  animation: fadeIn 1s ease-out;
}

/* Header styling */
header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  color: #004d40;
  font-size: 2.5em;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: slideIn 1s ease-out;
}

/* Form styling */
.calculator-form {
  display: flex;
  flex-direction: column;
  animation: formAppear 1s ease-out;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #00796b;
  font-size: 1.1em;
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid #b2dfdb;
  border-radius: 8px;
  font-size: 1em;
  background-color: #ffffff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #004d40;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 77, 64, 0.3);
}

/* Button styling */
.calculate-button {
  background: linear-gradient(135deg, #00796b 0%, #004d40 100%);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: 600;
  transition: background 0.3s ease, transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.calculate-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 255, 255, 0.2);
  transition: transform 0.5s ease;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  z-index: 0;
}

.calculate-button:hover::before {
  transform: translate(-50%, -50%) scale(1);
}

.calculate-button:hover {
  background: linear-gradient(135deg, #004d40 0%, #00796b 100%);
  transform: translateY(-2px);
  z-index: 1;
}

/* Results styling */
.results {
  margin-top: 30px;
  text-align: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: resultsFadeIn 1s ease-out;
}

.results h2 {
  color: #004d40;
  margin-bottom: 15px;
  font-size: 2em;
  font-weight: 700;
}

.result-value {
  font-weight: bold;
  color: #004d40;
  font-size: 1.2em;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes formAppear {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes resultsFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
