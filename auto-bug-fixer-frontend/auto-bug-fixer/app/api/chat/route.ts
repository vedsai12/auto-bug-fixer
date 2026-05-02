import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, codeContext, analysisContext } = await req.json()

    const systemPrompt = `You are AutoFix AI, an expert software engineer assistant specializing in bug detection, code refactoring, and optimization. You are helping developers understand and fix issues in their code.

${codeContext ? `Current code being analyzed:\n\`\`\`\n${codeContext}\n\`\`\`` : ''}

${analysisContext ? `Previous analysis results:\n${JSON.stringify(analysisContext, null, 2)}` : ''}

Be concise, technical, and helpful. Use code examples when relevant. Format code with backticks.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Chat request failed' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ content: data.content[0]?.text || '' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
