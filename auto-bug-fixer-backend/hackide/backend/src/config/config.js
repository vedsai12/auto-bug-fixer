require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  ibm: {
    apiKey: process.env.IBM_API_KEY,
    projectId: process.env.IBM_PROJECT_ID,
    spaceId: process.env.IBM_SPACE_ID,
    region: process.env.IBM_REGION || 'us-south',
    modelId: process.env.IBM_MODEL_ID || 'ibm/granite-3-8b-instruct',
    iamUrl: process.env.IBM_IAM_URL || 'https://iam.cloud.ibm.com/identity/token',
    watsonxUrl: process.env.IBM_WATSONX_URL || 'https://us-south.ml.cloud.ibm.com',
  },
  upload: {
    maxSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '5'),
    dir: process.env.UPLOAD_DIR || 'uploads',
  },
};
