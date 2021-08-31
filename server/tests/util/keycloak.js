const axios = require('axios');
const querystring = require('querystring');
const logger = require('../../logger');

const superuser = {
  username: 'test-superuser',
  password: process.env.KC_TEST_SUPER_USER_PWD || 'password',
};
const employer = {
  username: 'test-employer',
  password: process.env.KC_TEST_EMPLOYER_PWD || 'password',
};

const participant = {
  username: 'test-participant',
  password: 'password',
};

const getKeycloakToken = async ({ username, password }) => {
  try {
    const data = querystring.stringify({
      grant_type: 'password',
      client_id: process.env.KEYCLOAK_FE_CLIENTID,
      username,
      password,
    });
    const url = `${process.env.KEYCLOAK_AUTH_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    const response = await axios.post(url, data, config);
    return { Authorization: `Bearer ${response.data.access_token}` };
  } catch (error) {
    logger.error('KC Token fetch error', {
      context: `keycloak get token: ${error}`,
      user: {
        username,
        password,
      },
      error,
      resp: {
        statusText: error?.response?.statusText,
      },
    });
    throw error;
  }
};
module.exports = { superuser, participant, employer, getKeycloakToken };
