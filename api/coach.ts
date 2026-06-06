import Anthropic from '@anthropic-ai/sdk'


const client = new Anthropic({
    apiKey: process.env.VITE_ANTHROPIC_API_KEY,
})

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    try {
        const { poseName, score, failingChecks } = await req.json();

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
                content: `Pose: ${poseName}, Score: ${score}, Issues: ${failingChecks.join(', ')}`
            }]
        })

        // Convert to a readable stream for the browser
        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                        controller.enqueue(new TextEncoder().encode(chunk.delta.text))
                    }
                }
                controller.close()
            }
        })

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                // Allow browser to call this from localhost
                'Access-Control-Allow-Origin': '*',
            }
        })
    } catch (error) {
        console.error('Error in /api/coach:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}