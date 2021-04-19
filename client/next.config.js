require('dotenv').config({ path: `./config/.env.${process.env.NODE_ENV}` });

module.exports = {
    env: {
        SERVER_URL: process.env.SERVER_URL,
        SERVER_INTER_URL: process.env.SERVER_INTER_URL,
        DOMAIN: process.env.DOMAIN,
        FB_APP_ID: process.env.FB_APP_ID,
    },
};
