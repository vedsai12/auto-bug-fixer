const { detectBugs, fixBugs, refactorCode, explainCode } = require('../services/codeAnalysisService');
const { generateCodeDiff } = require('../utils/diffUtil');

// POST /api/analyze/bugs
async function analyzeBugs(req, res, next) {
  try {
    const { code, language } = req.body;
    const result = await detectBugs(code, language);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// POST /api/analyze/fix
async function fixCode(req, res, next) {
  try {
    const { code, language, issues } = req.body;
    const fixedCode = await fixBugs(code, language, issues || []);
    res.json({
      success: true,
      data: {
        original: code,
        fixed: fixedCode,
        diff: generateCodeDiff(code, fixedCode),
        language,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/analyze/refactor
async function refactor(req, res, next) {
  try {
    const { code, language } = req.body;
    const result = await refactorCode(code, language);
    res.json({
      success: true,
      data: {
        original: code,
        ...result,
        diff: generateCodeDiff(code, result.refactoredCode || code),
        language,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/analyze/explain
async function explain(req, res, next) {
  try {
    const { code, language } = req.body;
    const result = await explainCode(code, language);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// POST /api/analyze/full  — runs bug detection + fix + refactor in one shot
async function fullAnalysis(req, res, next) {
  try {
    const { code, language } = req.body;

    const [bugsResult, refactorResult, explanationResult] = await Promise.all([
      detectBugs(code, language),
      refactorCode(code, language),
      explainCode(code, language),
    ]);

    // Generate fixes based on detected bugs
    const fixedCode = bugsResult.totalIssues > 0
      ? await fixBugs(code, language, bugsResult.issues)
      : code;

    res.json({
      success: true,
      data: {
        language,
        original: code,
        bugs: bugsResult,
        fixed: fixedCode,
        fixDiff: generateCodeDiff(code, fixedCode),
        refactored: refactorResult,
        refactorDiff: generateCodeDiff(code, refactorResult.refactoredCode || code),
        explanation: explanationResult,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeBugs, fixCode, refactor, explain, fullAnalysis };
