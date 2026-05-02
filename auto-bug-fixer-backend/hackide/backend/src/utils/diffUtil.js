const Diff = require('diff');

function generateCodeDiff(oldCode, newCode) {
  try {
    const changes = Diff.diffLines(oldCode, newCode);
    return changes.map((change) => ({
      value: change.value,
      added: change.added || false,
      removed: change.removed || false,
    }));
  } catch (err) {
    console.error('[ERROR] Diff generation failed:', err.message);
    return [];
  }
}

module.exports = { generateCodeDiff };
