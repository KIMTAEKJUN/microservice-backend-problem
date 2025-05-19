module.exports = {
    apps: [
      {
        name: 'gateway-service',
        script: 'dist/apps/gateway/main.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
      {
        name: 'auth-service',
        script: 'dist/apps/auth/main.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
      {
        name: 'event-service',
        script: 'dist/apps/event/main.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
    ],
  };