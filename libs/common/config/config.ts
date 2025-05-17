export default () => ({
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nexon-backend-problem',
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'nexon_backend_problem_secret_key',
      expiresIn: process.env.JWT_EXPIRATION || '1d',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  },
  setting: {
    serverURL: process.env.SERVER_URL || 'http://localhost:3000',
    port: parseInt(process.env.PORT || '3000', 10),
  },
});
