module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  SESSION_SECRET: process.env.SESSION_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  NODE_MAILER_USER_NAME: process.env.NODE_MAILER_USER_NAME,
  NODE_MAILER_APP_PASSWORD: process.env.NODE_MAILER_APP_PASSWORD,
  NODE_MAILER_HOST: process.env.NODE_MAILER_HOST,
  PORT: process.env.PORT || 3000,
  PUPPETEER_EXC_PATH:
    process.env.PUPPETEER_EXC_PATH || "/usr/bin/chromium-browser",
};
