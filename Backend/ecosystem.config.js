module.exports = {
  apps: [
    {
      name: "api",
      script: "./dist/main.js",
      watch: false,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 20000,
      max_memory_restart: "2G",
      autorestart: false,
      env: {
        PORT: 3000,
        NODE_ENV: "prod",
        TZ: "Z",
      },
    },
  ],
};
