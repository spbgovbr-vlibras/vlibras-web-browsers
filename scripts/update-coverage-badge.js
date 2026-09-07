import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const summaryPath = path.join(rootDir, "coverage", "coverage-summary.json");
const readmePath = path.join(rootDir, "README.md");

function colorFor(pct) {
  if (pct >= 80) return "brightgreen";
  if (pct >= 60) return "green";
  if (pct >= 40) return "yellow";
  if (pct >= 20) return "orange";
  return "red";
}

console.log("Rodando a suíte com cobertura...");
try {
  execSync("pnpm test:coverage", { cwd: rootDir, stdio: "inherit" });
} catch {
  console.warn(
    "A suíte de testes (ou os thresholds de cobertura) falhou — atualizando a badge com o resultado mesmo assim.",
  );
}

if (!fs.existsSync(summaryPath)) {
  console.error(
    `Não encontrei ${summaryPath}. Confirme que "json-summary" está entre os reporters de coverage no vitest.config.ts.`,
  );
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
const pct = Math.round(summary.total.lines.pct);
const color = colorFor(pct);
const badgeUrl = `https://img.shields.io/badge/Cobertura-${pct}%25-${color}`;

const readme = fs.readFileSync(readmePath, "utf8");
const badgePattern =
  /https:\/\/img\.shields\.io\/badge\/Cobertura-\d+(?:\.\d+)?%25-\w+/;

if (!badgePattern.test(readme)) {
  console.error(
    "Não encontrei a badge de cobertura no README.md para atualizar. Verifique se ela ainda existe e segue o formato esperado.",
  );
  process.exit(1);
}

fs.writeFileSync(readmePath, readme.replace(badgePattern, badgeUrl));

console.log(`Badge de cobertura atualizada: ${pct}% (${color}).`);
