import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import pngquant from "pngquant-bin";
import sharp from "sharp";

const args = process.argv.slice(2);
let SIZE = 64;
let COLORS = 2;

for (let i = 0; i < args.length; i++) {
	if (args[i] === "--size" || args[i] === "-s") {
		SIZE = Number.parseInt(args[i + 1], 10) || SIZE;
		i++;
	} else if (args[i] === "--colors" || args[i] === "-c") {
		COLORS = Number.parseInt(args[i + 1], 10) || COLORS;
		i++;
	}
}

const ICONS_DIR = "./icons";
const OUTPUT_DIR = "./webp";
const ALLOWED_EXTENSIONS = [".svg", ".webp", ".png", ".jpg", ".jpeg"];

const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = fs.readdirSync(ICONS_DIR);

for (const file of files) {
	const ext = path.extname(file).toLowerCase();
	if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

	const inputPath = path.join(ICONS_DIR, file);
	const outputPath = path.join(OUTPUT_DIR, `${path.parse(file).name}.webp`);

	try {
		const pipeline = sharp(inputPath).resize(SIZE, SIZE);

		const binaryAlphaBuffer = await pipeline.clone().ensureAlpha().threshold(128).png().toBuffer();

		const indexedPng = execSync(`"${pngquant}" ${COLORS} --nofs -`, {
			input: binaryAlphaBuffer,
			maxBuffer: 1024 * 1024 * 10,
		});

		await sharp(indexedPng).webp({ lossless: true }).toFile(outputPath);

		const sizeBytes = fs.statSync(outputPath).size;
		console.log(`${GREEN}✔${RESET} ${outputPath} ${DIM}(${sizeBytes} bytes)${RESET}`);
	} catch (err) {
		console.error(`❌ Erro em ${file}: ${err.message}`);
	}
}
