import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import pngquant from "pngquant-bin";
import sharp from "sharp";

const ICONS_DIR = "./icons";
const OUTPUT_DIR = "./webp";

if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

try {
	const files = fs.readdirSync(ICONS_DIR);
	let total = 0;

	for (const file of files) {
		if (path.extname(file).toLowerCase() === ".svg") {
			const inputPath = path.join(ICONS_DIR, file);
			const name = path.basename(file, ".svg");
			const outputPath = path.join(OUTPUT_DIR, `${name}.webp`);

			try {
				const svgContent = fs.readFileSync(inputPath, "utf8");

				const rawPngBuffer = await sharp(Buffer.from(svgContent))
					.resize(48, 48)
					.ensureAlpha()
					.threshold(128)
					.png()
					.toBuffer();

				const indexedPngBuffer = execSync(`"${pngquant}" 4 --nofs --posterize 4 -`, {
					input: rawPngBuffer,
					maxBuffer: 1024 * 1024 * 10,
				});

				await sharp(indexedPngBuffer).webp({ lossless: true, effort: 6 }).toFile(outputPath);

				console.log(`✅ ${file} -> webp/${name}.webp`);
				total++;
			} catch (err) {
				console.error(`❌ Erro ao processar ${file}:`, err.message);
			}
		}
	}

	console.log(`\n🎉 Pronto! ${total} ícones convertidos com sucesso.`);
} catch (err) {
	console.error("❌ Erro ao ler a pasta de ícones:", err.message);
}
