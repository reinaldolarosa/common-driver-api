require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/common_driver',
  JWT_SECRET: process.env.JWT_SECRET || 'secret_key',
};

module.exports = env;