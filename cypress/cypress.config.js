const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://your-gateway.com",
    env: {
      CASCO_TOKEN: "Bearer YOUR_TOKEN",
      ESBD_TOKEN: "ESBD_AUTH_KEY",
    },
    setupNodeEvents(on, config) {
    },
  },
});