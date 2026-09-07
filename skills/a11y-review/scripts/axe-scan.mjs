#!/usr/bin/env node
/**
 * Generic accessibility scanner: runs axe-core against a live URL via
 * Playwright and prints violations grouped by severity, plus items axe
 * flagged as "needs review" (can't auto-verdict).
 *
 * This script is self-contained and portable — it doesn't assume it's
 * running inside any particular project. Run it from anywhere that has
 * Node.js and the two peer packages below installed.
 *
 * One-time setup (in whichever environment you're executing this from):
 *   npm install --no-save playwright axe-core
 *   npx playwright install chromium
 *
 * Usage:
 *   node axe-scan.mjs <url> [options]
 *
 * Options:
 *   --selector <css>   Scan only this element (e.g. a widget's root
 *                       container) instead of the whole document.
 *   --wait <ms>         Wait this many ms after load before scanning
 *                       (default 500) — useful for widgets that render
 *                       asynchronously or animate in.
 *   --viewport <WxH>    Viewport size, default 1280x800.
 *   --tags <list>       Comma-separated axe rule tags, default
 *                       "wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa"
 *   --out <path>        Write full JSON results to this file.
 *
 * Exit code is 0 regardless of findings (this is a reporting tool, not a
 * CI gate) — the caller reads the printed summary / JSON output.
 */

import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function parseArgs(argv) {
	const args = { url: null, selector: null, wait: 500, viewport: "1280x800", tags: "wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa", out: null };
	const rest = [...argv];
	args.url = rest.shift();
	while (rest.length) {
		const flag = rest.shift();
		switch (flag) {
			case "--selector":
				args.selector = rest.shift();
				break;
			case "--wait":
				args.wait = Number(rest.shift());
				break;
			case "--viewport":
				args.viewport = rest.shift();
				break;
			case "--tags":
				args.tags = rest.shift();
				break;
			case "--out":
				args.out = rest.shift();
				break;
			default:
				console.error(`Unknown option: ${flag}`);
				process.exit(1);
		}
	}
	return args;
}

function loadDeps() {
	let chromium;
	let axeSource;
	try {
		({ chromium } = require("playwright"));
	} catch {
		console.error(
			"Missing dependency: playwright.\n" +
				"Install it in this environment with:\n" +
				"  npm install --no-save playwright && npx playwright install chromium",
		);
		process.exit(1);
	}
	try {
		const axePath = require.resolve("axe-core/axe.min.js");
		axeSource = require("node:fs").readFileSync(axePath, "utf8");
	} catch {
		console.error("Missing dependency: axe-core.\nInstall it with:\n  npm install --no-save axe-core");
		process.exit(1);
	}
	return { chromium, axeSource };
}

function severityRank(impact) {
	return { critical: 0, serious: 1, moderate: 2, minor: 3 }[impact] ?? 4;
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (!args.url) {
		console.error("Usage: node axe-scan.mjs <url> [--selector css] [--wait ms] [--viewport WxH] [--tags a,b,c] [--out file.json]");
		process.exit(1);
	}

	const { chromium, axeSource } = loadDeps();
	const [width, height] = args.viewport.split("x").map(Number);

	const browser = await chromium.launch();
	try {
		const page = await browser.newPage({ viewport: { width: width || 1280, height: height || 800 } });
		await page.goto(args.url, { waitUntil: "networkidle" });
		if (args.wait > 0) await page.waitForTimeout(args.wait);

		await page.addScriptTag({ content: axeSource });

		const results = await page.evaluate(
			async ({ selector, tags }) => {
				const context = selector || document;
				// eslint-disable-next-line no-undef
				return await axe.run(context, { runOnly: { type: "tag", values: tags.split(",") } });
			},
			{ selector: args.selector, tags: args.tags },
		);

		if (args.out) {
			writeFileSync(args.out, JSON.stringify(results, null, 2));
			console.log(`Full results written to ${args.out}\n`);
		}

		const violations = [...results.violations].sort((a, b) => severityRank(a.impact) - severityRank(b.impact));
		const incomplete = results.incomplete;

		console.log(`Scanned: ${args.url}${args.selector ? ` (selector: ${args.selector})` : ""}`);
		console.log(`Rule tags: ${args.tags}`);
		console.log(`Violations: ${violations.length} | Needs review: ${incomplete.length} | Passes: ${results.passes.length}\n`);

		for (const v of violations) {
			console.log(`[${(v.impact || "unknown").toUpperCase()}] ${v.id} — ${v.help}`);
			console.log(`  ${v.helpUrl}`);
			for (const node of v.nodes) {
				console.log(`  - ${node.target.join(" ")}`);
				if (node.failureSummary) {
					console.log(
						`    ${node.failureSummary.split("\n").join("\n    ")}`,
					);
				}
			}
			console.log("");
		}

		if (incomplete.length) {
			console.log("--- Needs manual review (axe could not auto-verdict) ---\n");
			for (const item of incomplete) {
				console.log(`[REVIEW] ${item.id} — ${item.help}`);
				console.log(`  ${item.helpUrl}`);
				for (const node of item.nodes) {
					console.log(`  - ${node.target.join(" ")}`);
				}
				console.log("");
			}
		}

		if (violations.length === 0 && incomplete.length === 0) {
			console.log("No automated violations found. This does NOT mean the target is accessible —");
			console.log("axe-core catches a subset of WCAG failures. Continue with the manual checklist.");
		}
	} finally {
		await browser.close();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
