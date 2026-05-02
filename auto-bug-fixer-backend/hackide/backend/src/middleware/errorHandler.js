function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);

  // IBM API errors
  if (err.response?.data) {
    const ibmError = err.response.data;
    return res.status(err.response.status || 502).json({
      success: false,
      message: 'IBM watsonx API error',
      detail: ibmError?.errors?.[0]?.message || ibmError?.error || 'Unknown IBM API error',
    });
  }

  // Auth errors
  if (err.message?.includes('401') || err.message?.toLowerCase().includes('unauthorized')) {
    return res.status(401).json({ success: false, message: 'IBM API key is invalid or expired.' });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = { errorHandler };
