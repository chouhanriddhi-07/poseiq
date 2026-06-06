import Anthropic from '@anthropic-ai/sdk'
import type { IncomingMessage, ServerResponse } from 'http'

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

interface CoachRequest {
    poseName: string
    score: number
    failingChecks: string[]
}

// Helper to read the raw body from Node's IncomingMessage
function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = ''
        req.on('data', chunk => body += chunk.toString())
        req.on('end', () => resolve(body))
        req.on('error', reject)
    })
}

export default async function handler(
    req: IncomingMessage,
    res: ServerResponse
) {

    console.log('-----------------> API KEY:', process.env.ANTHROPIC_API_KEY ? 'FOUND' : 'UNDEFINED')
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
    }

    if (req.method !== 'POST') {
        res.writeHead(405)
        res.end('Method not allowed')
        return
    }

    try {
        const raw = await readBody(req)
        const { poseName, score, failingChecks } =
            JSON.parse(raw) as CoachRequest;

        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
        })

        // Stream response from Claude
        const stream = await client.messages.stream({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 150,
            system: `You are a concise yoga instructor giving real-time coaching.
Give exactly 1-2 sentences. Be warm and encouraging but specific.
Focus only on the single most important correction.
If the score is above 80, give a brief encouragement instead.`,
            messages: [{
                role: 'user',
                content: `Pose: ${poseName}
Score: ${score}/100
Issues: ${failingChecks.join(', ')}`
            }]
        })


        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta'
                && chunk.delta.type === 'text_delta') {
                res.write(chunk.delta.text)
            }
        }

        res.end()

    } catch (err) {
        console.error('Coach API error:', err)
        // Only write error headers if we haven't started responding yet
        if (!res.headersSent) {
            res.writeHead(500)
            res.end('API error')
        } else {
            res.end()
        }
    }
}