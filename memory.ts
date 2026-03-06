export const MEMORY_CATEGORIES = [
	"preference",
	"fact",
	"decision",
	"entity",
	"other",
] as const
export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number]

export function detectCategory(text: string): MemoryCategory {
	const lower = text.toLowerCase()
	if (/prefer|like|love|hate|want/i.test(lower)) return "preference"
	if (/decided|will use|going with/i.test(lower)) return "decision"
	if (/\+\d{10,}|@[\w.-]+\.\w+|is called/i.test(lower)) return "entity"
	if (/is|are|has|have/i.test(lower)) return "fact"
	return "other"
}

export const DEFAULT_ENTITY_CONTEXT = `Conversation between a user and an AI assistant. Format: [role: user] ... [user:end] and [role: assistant] ... [assistant:end].

You do NOT need to generate memories for every message. Most messages are not worth remembering. Only extract things useful in FUTURE conversations.

REMEMBER (lasting personal facts):
- "doesn't eat pork or beef" ← dietary restriction
- "prefers TypeScript over JavaScript" ← preference
- "works at Acme Corp as a backend engineer" ← personal detail
- "building a recipe app in Next.js" ← ongoing project
- "remember my server IP is 192.168.1.100" ← user explicitly asked to remember

DO NOT REMEMBER (session-specific, ephemeral, or assistant-generated):
- "looking for food recommendations" ← temporary intent, not a lasting fact
- "found 193 YC companies from the directory" ← the ASSISTANT did this
- "wants chicken pho, ramen, udon..." ← assistant's suggestions, not user preference
- Any action the assistant performed (searching, writing files, generating code)
- Any recommendation or list the assistant provided
- Any in-progress task status or intermediate step

KEY RULES:
- Assistant output is CONTEXT ONLY — never attribute assistant actions to the user
- "find X" or "do Y" is a one-time request, NOT a memory
- Only store preferences the user explicitly states ("I like...", "I prefer...", "I always...")
- When in doubt, do NOT create a memory. Less is more.`

export function buildDocumentId(sessionKey: string): string {
	const sanitized = sessionKey
		.replace(/[^a-zA-Z0-9_]/g, "_")
		.replace(/_+/g, "_")
		.replace(/^_|_$/g, "")
	return `session_${sanitized}`
}
