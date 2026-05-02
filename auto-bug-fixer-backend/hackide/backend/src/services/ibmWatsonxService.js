const axios = require('axios');
const config = require('../config/config');

let cachedToken = null;
let tokenExpiry = null;

async function getIAMToken() {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  const response = await axios.post(
    config.ibm.iamUrl,
    new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: config.ibm.apiKey,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;
  return cachedToken;
}

async function generateText(prompt, options = {}) {
  const token = await getIAMToken();
  const endpoint = `${config.ibm.watsonxUrl}/ml/v1/text/chat?version=2023-05-29`;

  const payload = {
    model_id: config.ibm.modelId,
    space_id: config.ibm.spaceId,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: options.maxTokens || 2048,
    temperature: options.temperature || 0.2,
  };

  const response = await axios.post(endpoint, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.choices?.[0]?.message?.content?.trim() || '';
}

module.exports = { generateText };
