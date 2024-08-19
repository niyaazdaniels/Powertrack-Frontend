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
        <strong>Step 1:</strong> Check our <a href="/faq">FAQ page</a> for
        common questions.
      </li>
      <li>
        <strong>Step 2:</strong> Visit our
        <a href="/contact">Contact Us</a> page to get in touch with support.
      </li>
      <li>
        <strong>Step 3:</strong> Refer to the
        <a href="/user-guide">User Guide</a> for detailed instructions.
      </li>
    </ul>
    <p>For any urgent issues, please reach out to our support team directly.</p>
  </div>
</template>

<script>
export default {
  name: "HelpSection",
  data() {
    return {
      // Add any data properties here if needed
    };
  },
  methods: {
    // Define any methods here if needed
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

.help-container {
  position: relative;
  align-items: center;
  top: 150px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-width: 600px;
  margin: 0 auto;
  justify-content: center;
}

.help-container h2 {
  color: #333;
}

.help-container p {
  line-height: 1.6;
}

.help-container ul {
  list-style-type: none;
  padding: 0;
}

.help-container li {
  margin-bottom: 10px;
}

.help-container a {
  color: #007bff;
  text-decoration: none;
}

.help-container a:hover {
  text-decoration: underline;
}
</style>
