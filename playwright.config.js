// Proves del portal estàtic. El servidor és el mateix HTML servit tal qual; Commons
// es simula en tests/site.spec.js a partir dels fitxers d'un clon de Commons.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:18640', serviceWorkers: 'block' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'python3 -m http.server 18640 --bind 127.0.0.1',
    url: 'http://127.0.0.1:18640/index.html',
    reuseExistingServer: false,
    stderr: 'ignore',
  },
});
