<template>
    <div class="app">
      <div class="home">
        <img
          alt="background"
          :class="{ fadeIn: isImageLoaded }"
          src="../assets/login-background-image-K8_367G8r-transformed.jpeg"
          @load="startAnimation"
        />
        <div class="login-container container">
          <h2>Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="Enter your username"
                required
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div class="button-group">
              <button type="submit">Login</button>
            </div>
            <div class="work">Dont have an account? <router-link to="/signup">Sign Up</router-link></div>
            <div v-if="loginError" class="error">{{ loginError }}</div>
          </form>
        </div>
      </div>
    </div>
  </template>

<!-- script -->
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        loginError: '',
        isImageLoaded: false,
      };
    },
    methods: {
      startAnimation() {
        this.isImageLoaded = true;
      },
      handleLogin() {
        if (this.username === '' || this.password === '') {
          this.loginError = 'Please enter both username and password.';
          return;
        }
        this.loginError = ''; 
      },
    },
  };
  </script>
  
  <!-- style -->
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
  
  .login-container {
    position: relative;
    background-color: rgba(255, 255, 255, 0.95); 
    padding: 40px; 
    border-radius: 20px;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3); 
    max-width: 500px;
    width: 90%;
    margin: 40px auto; 
    z-index: 1;
    text-align: left; 
    backdrop-filter: blur(15px); 
  }
  
  .login-container h2 {
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
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
    outline: none;
  }
  
  .button-group {
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
  
  .error {
    margin-top: 20px;
    font-size: 14px;
    color: #e74c3c;
    font-weight: 600;
  }
  .work{
    padding-top: 15px;
  }
  
  @media (max-width: 768px) {
    .login-container {
      padding: 20px;
      margin: 20px; 
    }
  
    .login-container h2 {
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
  