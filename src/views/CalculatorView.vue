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
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Header styling */
header {
  text-align: center;
  margin-bottom: 20px;
}

header h1 {
  color: #333;
  font-size: 2em;
  margin: 0;
}

/* Form styling */
.calculator-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #2e8b57;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
}

input::placeholder {
  color: #aaa;
}

/* Button styling */
.calculate-button {
  background-color: #2e8b57;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
}

.calculate-button:hover {
  background-color: #256d4a;
}

/* Results styling */
.results {
  margin-top: 20px;
  text-align: center;
}

.results h2 {
  color: #2e8b57;
}

.result-value {
  font-weight: bold;
  color: #2e8b57;
}
</style>
