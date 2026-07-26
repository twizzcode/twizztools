module.exports = {
  apps: [
    {
      name: "twizztools",
      cwd: "/var/www/twizztools",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        HOSTNAME: "localhost",
      },
    },
  ],
}
