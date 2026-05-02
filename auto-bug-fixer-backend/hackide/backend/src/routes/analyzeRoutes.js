const express = require('express');
const router = express.Router();
const { analyzeBugs, fixCode, refactor, explain, fullAnalysis } = require('../controllers/analyzeController');
const { handleValidationErrors, codeBodyRules, fixBodyRules } = require('../middleware/validateRequest');

// Detect bugs in code
router.post('/bugs', codeBodyRules, handleValidationErrors, analyzeBugs);

// Fix detected bugs (pass issues array from /bugs response)
router.post('/fix', fixBodyRules, handleValidationErrors, fixCode);

// Refactor code for quality & performance
router.post('/refactor', codeBodyRules, handleValidationErrors, refactor);

// Explain what the code does
router.post('/explain', codeBodyRules, handleValidationErrors, explain);

// Full pipeline: bugs + fix + refactor + explain in one call
router.post('/full', codeBodyRules, handleValidationErrors, fullAnalysis);

module.exports = router;
