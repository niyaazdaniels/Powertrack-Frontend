<template>
    <div class="content-wrapper">
      <img
        alt="background"
        :class="{ fadeIn: isImageLoaded }"
        src="../assets/pixelcut-export.jpeg"
        @load="startAnimation"
      />
      <div class="overlay"></div>
      <div class="contact-page">
        <section class="contact-info">
          <h1>Contact Us</h1>
          <div class="contact-details">
            <div class="contact-item">
              <h2>Email Us</h2>
              <p><a href="mailto:info@example.com">info@example.com</a></p>
            </div>
            <div class="contact-item">
              <h2>Call Us</h2>
              <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
            </div>
            <div class="contact-item">
              <h2>Our Location</h2>
              <p>123 Business Rd, Suite 456, City, Country</p>
              <div id="map" class="map"></div>
            </div>
          </div>
        </section>
        
        <section class="contact-form">
          <h1>Send Us a Message</h1>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" v-model="form.name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" required />
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" v-model="form.message" required></textarea>
            </div>
            <button type="submit">Send</button>
          </form>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          name: '',
          email: '',
          message: ''
        },
        isImageLoaded: false
      }
    },
    methods: {
      handleSubmit() {
        console.log('Form submitted:', this.form);
        this.resetForm();
      },
      resetForm() {
        this.form.name = '';
        this.form.email = '';
        this.form.message = '';
      },
      startAnimation() {
        this.isImageLoaded = true;
      },
      initMap() {
        // Initialize your map here, for example using Google Maps API
      }
    },
    mounted() {
      this.initMap();
    }
  }
  </script>
  
  <style scoped>
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
  .content-wrapper {
    position: relative;
    width: 100%;
    height: auto;
    overflow: hidden;
  }
  
  .content-wrapper img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: opacity 0.5s ease-in-out;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -2;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Darker overlay for better text visibility */
    z-index: -1;
  }
  
  .fadeIn {
    opacity: 1;
  }
  
  .contact-page {
    display: flex;
    min-height: 100vh;
    padding: 20px;
    color: #fff; /* White text color */
    position: relative;
    z-index: 1; /* Ensure content is above overlay */
  }
  
  .contact-info, .contact-form {
    background: rgba(0, 0, 0, 0.6); /* Slightly lighter than the overlay */
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    z-index: 2;
    width: 50%;
    height: max-content;
  }
  
  .contact-info h1, .contact-form h1 {
    font-size: 2em;
    margin-bottom: 20px;
    font-weight: bold;
  }
  
  .contact-details {
    display: flex;
    flex-direction: column;
  }
  
  .contact-item {
    margin-bottom: 15px;
  }
  
  .contact-item h2 {
    margin: 0;
    font-size: 1.3em;
    font-weight: bold;
  }
  
  .contact-item p {
    margin: 5px 0;
    font-size: 1em;
  }
  
  .contact-item a {
    color: #00bcd4; /* Highlight color */
    text-decoration: none;
  }
  
  .contact-item a:hover {
    text-decoration: underline;
  }
  
  .map {
    width: 100%;
    height: 300px;
    background-color: #eaeaea;
    border-radius: 8px;
  }
  
  .contact-form {
    border-top: 2px solid #444;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group textarea {
    width: 70%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-group textarea {
    height: 120px;
    resize: vertical;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  