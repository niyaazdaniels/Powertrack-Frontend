<template>
  <Navbar />
  <router-view />
  <FooterComp/>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import FooterComp from "./components/FooterComp.vue";
export default {
  components: { Navbar, FooterComp },
};
</script>

<style>
#app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

body {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  
}

::-webkit-scrollbar {
  display: none;
}
</style>
