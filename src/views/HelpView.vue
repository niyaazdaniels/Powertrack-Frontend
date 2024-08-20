<template>
    <div class="home">
      <img
        alt="background"
        :class="{ fadeIn: isImageLoaded }"
        src="../assets/AdobeStock_519445978-scaled.jpeg.webp"
        @load="startAnimation"
      />
    </div>
    <div class="help-container">
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
  </template>
  
  <script>
  export default {
    name: "HelpSection",
    data() {
      return {};
    },
    methods: {
      startAnimation() {
        this.isImageLoaded = true;
      }
    },
    computed: {
      isImageLoaded() {
        return this.$data.isImageLoaded;
      }
    }
  };
  </script>
  
  <style scoped>
  .home {
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: -1; 
    overflow: hidden;
  }
  
  .home img {
    filter: grayscale(1);
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: opacity 0.5s ease-in-out;
  }
  
  .fadeIn {
    opacity: 1;
  }
  
  .help-container {
    position: relative;
    top: 100px;
    padding: 40px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    max-width: 700px;
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .help-container h2 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .help-container p {
    color: #666;
    line-height: 1.8;
    font-size: 1rem;
    margin-bottom: 20px;
  }
  
  .help-container ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .help-container li {
    margin-bottom: 15px;
    font-size: 1rem;
  }
  
  .help-container strong {
    color: #333;
  }
  
  .help-container a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .help-container a:hover {
    text-decoration: underline;
  }
  </style>
  