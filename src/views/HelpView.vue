<template>
  <div class="app">
    <div class="home">
      <img
        alt="background"
        :class="{ fadeIn: isImageLoaded }"
        src="../assets/pixelcut-export.jpeg"
        @load="startAnimation"
      />
      <div class="help-container container">
        <h2>Help & Support</h2>
        <p>If you need assistance, please follow these guidelines:</p>
        <ul>
          <li>
            <strong>Step 1:</strong> Check our <a href="/faq">FAQ page</a> for common questions.
          </li>
          <li>
            <strong>Step 2:</strong> Visit our <a href="/contact">Contact Us</a> page to get in touch with support.
          </li>
          <li>
            <strong>Step 3:</strong> Refer to the <a href="/user-guide">User Guide</a> for detailed instructions.
          </li>
        </ul>
        <p>For any urgent issues, please reach out to our support team directly.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelpSection",
  data() {
    return {
      isImageLoaded: false,
    };
  },
  methods: {
    startAnimation() {
      this.isImageLoaded = true;
    }
  }
};
</script>

<style scoped>
html, body {
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
.help-container {
  position: relative;
  background-color: #ffffff; 
  padding: 40px; 
  border-radius: 20px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3); 
  max-width: 900px;
  width: 90%;
  margin: 40px auto; 
  z-index: 1;
  text-align: left; 
  background: rgba(255, 255, 255, 0.95); 
  backdrop-filter: blur(15px); 
  border: 1px solid rgba(0, 0, 0, 0.1); 
}

.help-container h2 {
  color: #2c3e50; 
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 800;
  border-bottom: 2px solid #3498db; 
  padding-bottom: 10px; 
}

.help-container p {
  color: #7f8c8d; 
  line-height: 1.8;
  font-size: 1.2rem; 
  margin-bottom: 24px; 
  text-align: justify; 
}

.help-container ul {
  list-style: none; 
  padding: 0; 
  margin: 0; 
}

.help-container li {
  margin-bottom: 20px; 
  font-size: 1.15rem;
  line-height: 1.7;
  position: relative;
  padding-left: 40px; 
}

.help-container li::before {
  content: '•'; 
  color: #3498db; 
  font-size: 1.5rem;
  position: absolute;
  left: 10px; 
  top: 0;
}

.help-container strong {
  color: #34495e; 
  font-weight: 600; 
}

.help-container a {
  color: #3498db; 
  text-decoration: none; 
  font-weight: 500; 
  transition: color 0.3s ease, text-decoration 0.3s ease; 
}

.help-container a:hover {
  color: #1d7dff; 
  text-decoration: underline; 
}

@media (max-width: 768px) {
  .help-container {
    padding: 20px;
    margin: 20px; 
  }

  .help-container h2 {
    font-size: 2rem; 
  }

  .help-container p {
    font-size: 1rem; 
  }

  .help-container li {
    font-size: 1rem;
  }
}
</style>
