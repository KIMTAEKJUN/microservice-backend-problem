export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice_mongodb',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'microservice_mongodb_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
