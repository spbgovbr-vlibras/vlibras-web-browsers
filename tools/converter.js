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

if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

try {
	const files = fs.readdirSync(ICONS_DIR);

	for (const file of files) {
		const ext = path.extname(file).toLowerCase();

		if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

		const inputPath = path.join(ICONS_DIR, file);
		const name = path.basename(file, ext);
		const outputPath = path.join(OUTPUT_DIR, `${name}.webp`);

		try {
			let pipeline;

			if (ext === ".svg") {
				const svgContent = fs.readFileSync(inputPath, "utf8");
				pipeline = sharp(Buffer.from(svgContent)).resize(SIZE, SIZE).ensureAlpha();
			} else {
				pipeline = sharp(inputPath).resize(SIZE, SIZE).ensureAlpha();
			}

			const alphaMaskBuffer = await pipeline.clone().extractChannel("alpha").threshold(128).png().toBuffer();

			const rawPngBuffer = await pipeline
				.clone()
				.composite([{ input: alphaMaskBuffer, blend: "dest-in" }])
				.png()
				.toBuffer();

			const indexedPngBuffer = execSync(`"${pngquant}" ${COLORS} --nofs -`, {
				input: rawPngBuffer,
				maxBuffer: 1024 * 1024 * 10,
			});

			await sharp(indexedPngBuffer).webp({ lossless: true, effort: 6 }).toFile(outputPath);

			const sizeBytes = fs.statSync(outputPath).size;
			console.log(`${GREEN}✔${RESET} ${outputPath} ${DIM}(${sizeBytes} bytes)${RESET}`);
		} catch (err) {
			console.error(`❌ Erro ao processar ${file}:`, err.message);
		}
	}
} catch (err) {
	console.error("❌ Erro ao ler a pasta de ícones:", err.message);
}
