const { validationResult, body } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

const codeBodyRules = [
  body('code')
    .trim()
    .notEmpty().withMessage('code is required')
    .isLength({ max: 50000 }).withMessage('code must be under 50,000 characters'),
  body('language')
    .trim()
    .notEmpty().withMessage('language is required')
    .isLength({ max: 50 }).withMessage('language name too long'),
];

const fixBodyRules = [
  ...codeBodyRules,
  body('issues').optional().isArray().withMessage('issues must be an array'),
];

module.exports = { handleValidationErrors, codeBodyRules, fixBodyRules };
