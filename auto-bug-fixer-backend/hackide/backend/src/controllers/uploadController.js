const fs = require('fs');
const path = require('path');
const { detectBugs, fixBugs, refactorCode } = require('../services/codeAnalysisService');
const { generateCodeDiff } = require('../utils/diffUtil');

const LANGUAGE_MAP = {
  '.js': 'javascript',
  '.ts': 'typescript',
  '.py': 'python',
  '.java': 'java',
  '.go': 'go',
  '.rb': 'ruby',
  '.php': 'php',
  '.cpp': 'cpp',
  '.c': 'c',
  '.cs': 'csharp',
  '.rs': 'rust',
  '.kt': 'kotlin',
  '.swift': 'swift',
};

// POST /api/upload/file
async function uploadAndAnalyze(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const language = LANGUAGE_MAP[ext];

    if (!language) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: `Unsupported file type: ${ext}. Supported: ${Object.keys(LANGUAGE_MAP).join(', ')}`,
      });
    }

    const code = fs.readFileSync(req.file.path, 'utf-8');
    fs.unlinkSync(req.file.path); // clean up upload immediately

    const bugsResult = await detectBugs(code, language);
    const fixedCode = bugsResult.totalIssues > 0
      ? await fixBugs(code, language, bugsResult.issues)
      : code;
    const refactorResult = await refactorCode(code, language);

    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        language,
        original: code,
        bugs: bugsResult,
        fixed: fixedCode,
        fixDiff: generateCodeDiff(code, fixedCode),
        refactored: refactorResult,
        refactorDiff: generateCodeDiff(code, refactorResult.refactoredCode || code),
      },
    });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
}

module.exports = { uploadAndAnalyze };
