/**
 * dump extension
 *
 * intercepts the request right before it's sent to the model,
 * dumps the complete JSON payload to stdout, and exits the process.
 *
 * this shows exactly what pi sends to the LLM, including:
 * - the full system prompt (all assembled context files, skills, etc.)
 * - all tool definitions
 * - the conversation history
 * - the current user message
 * - streaming/options settings
 *
 * Usage:
 *   pi --dump -p 'hello'
 *
 * The extension triggers on `before_provider_request` which fires
 * right after the provider payload is fully assembled.
 */
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { writeSync } from "node:fs";

export default function (pi: ExtensionAPI) {
	pi.registerFlag("dump", {
		description: "dump the complete request to stdout and exit",
		type: "boolean",
		default: false,
	});
	// intercept right before the LLM request is sent
	pi.on("before_provider_request", (event) => {
		// only act when the user explicitly requested a dump
		if (!pi.getFlag("dump")) return;
		// pi takes over stdout and redirects it to stderr, so we write
		// directly to raw file descriptor 1 (stdout) to bypass the takeover.
		writeSync(1, JSON.stringify(event.payload, null, 2) + "\n");
		// exit before the LLM call completes
		process.exit(0);
	});
}
