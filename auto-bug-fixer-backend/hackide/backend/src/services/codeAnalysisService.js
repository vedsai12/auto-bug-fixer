const { generateText } = require('./ibmWatsonxService');

function buildBugDetectionPrompt(code, language) {
  return `You are an expert ${language} developer and code reviewer.

Analyze the following ${language} code and identify ALL bugs, errors, and issues.

For each issue found, provide:
1. Line number (if identifiable)
2. Issue type (Bug / Logic Error / Security Risk / Performance Issue / Bad Practice)
3. Description of the problem
4. Severity: Critical | High | Medium | Low

Return your response as valid JSON only, in this exact format:
{
  "language": "${language}",
  "totalIssues": <number>,
  "issues": [
    {
      "id": 1,
      "line": <line number or null>,
      "type": "<issue type>",
      "severity": "<severity>",
      "description": "<clear description>",
      "snippet": "<the problematic code snippet>"
    }
  ],
  "summary": "<one paragraph overall assessment>"
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

JSON response:`;
}

function buildFixPrompt(code, language, issues) {
  const issueList = issues.map((i, idx) => `${idx + 1}. [${i.severity}] ${i.type}: ${i.description}`).join('\n');

  return `You are an expert ${language} developer.

Fix ALL of the following issues in the provided code:
${issueList}

Original code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the fixed code with no explanation, no markdown fences, no extra text. Just the raw fixed code.

Fixed code:`;
}

function buildRefactorPrompt(code, language) {
  return `You are a senior ${language} engineer specializing in clean code and best practices.

Refactor the following code to:
- Improve readability and maintainability
- Apply SOLID principles where applicable
- Remove code duplication
- Use idiomatic ${language} patterns
- Optimize performance where obvious

Return your response as valid JSON only:
{
  "refactoredCode": "<the complete refactored code>",
  "changes": [
    {
      "change": "<what was changed>",
      "reason": "<why it improves the code>"
    }
  ],
  "performanceImprovements": ["<improvement 1>", "<improvement 2>"]
}

Code to refactor:
\`\`\`${language}
${code}
\`\`\`

JSON response:`;
}

function buildExplainPrompt(code, language) {
  return `You are a technical documentation expert.

Explain the following ${language} code clearly:

\`\`\`${language}
${code}
\`\`\`

Return your response as valid JSON only:
{
  "overview": "<what the code does overall>",
  "breakdown": [
    {
      "section": "<section name or line range>",
      "explanation": "<what this part does>"
    }
  ],
  "complexity": "<time and space complexity if applicable>",
  "dependencies": ["<external dependency 1>"]
}

JSON response:`;
}

function safeParseJSON(text) {
  try {
    // Strip markdown fences if model wraps the JSON
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

async function detectBugs(code, language) {
  const prompt = buildBugDetectionPrompt(code, language);
  const raw = await generateText(prompt, { maxTokens: 2048 });
  const parsed = safeParseJSON(raw);
  if (!parsed) throw new Error('Bug detection returned unparseable response from AI model.');
  return parsed;
}

async function fixBugs(code, language, issues) {
  const prompt = buildFixPrompt(code, language, issues);
  const fixedCode = await generateText(prompt, { maxTokens: 3000 });
  return fixedCode;
}

async function refactorCode(code, language) {
  const prompt = buildRefactorPrompt(code, language);
  const raw = await generateText(prompt, { maxTokens: 3000 });
  const parsed = safeParseJSON(raw);
  if (!parsed) throw new Error('Refactor returned unparseable response from AI model.');
  return parsed;
}

async function explainCode(code, language) {
  const prompt = buildExplainPrompt(code, language);
  const raw = await generateText(prompt, { maxTokens: 1500 });
  const parsed = safeParseJSON(raw);
  if (!parsed) throw new Error('Explain returned unparseable response from AI model.');
  return parsed;
}

module.exports = { detectBugs, fixBugs, refactorCode, explainCode };
