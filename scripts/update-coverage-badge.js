import fs from "fs";
import path from "path";
import readline from "readline";
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

const ANSI_RESET = "\x1b[0m";
const ANSI_GREEN = "\x1b[32;1m";
const ANSI_RED = "\x1b[31;1m";

function colorize(text, ansiCode) {
  if (!process.stdout.isTTY) return text;
  return `${ansiCode}${text}${ANSI_RESET}`;
}

function askYesNo(question) {
  if (!process.stdin.isTTY) return Promise.resolve(false);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(`${question} (s/N) `, (answer) => {
      rl.close();
      resolve(/^s(im)?$/i.test(answer.trim()));
    });
  });
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
  /https:\/\/img\.shields\.io\/badge\/Cobertura-(\d+(?:\.\d+)?)%25-\w+/;

const match = readme.match(badgePattern);

if (!match) {
  console.error(
    "Não encontrei a badge de cobertura no README.md para atualizar. Verifique se ela ainda existe e segue o formato esperado.",
  );
  process.exit(1);
}

const currentPct = Number(match[1]);

if (currentPct === pct) {
  console.log(
    `Cobertura segue em ${pct}% — README já está atualizado, nada para commitar.`,
  );
  process.exit(0);
}

fs.writeFileSync(readmePath, readme.replace(badgePattern, badgeUrl));

const trendAnsi = pct > currentPct ? ANSI_GREEN : ANSI_RED;
console.log(
  `Badge de cobertura atualizada: ${colorize(`${currentPct}%`, trendAnsi)} ${colorize(`→ ${pct}%`, trendAnsi)}.`,
);

const shouldCommit = await askYesNo("Commitar a atualização do README?");

if (!shouldCommit) {
  console.log("README atualizado, mas a alteração não foi commitada.");
  process.exit(0);
}

const commitMessage = `docs(readme): update coverage badge to ${pct}%`;

try {
  execSync(`git add ${JSON.stringify(readmePath)}`, {
    cwd: rootDir,
    stdio: "inherit",
  });
  execSync(`git commit -m ${JSON.stringify(commitMessage)}`, {
    cwd: rootDir,
    stdio: "inherit",
  });
  console.log(`Commit criado: "${commitMessage}"`);
} catch {
  console.error(
    "Não consegui criar o commit. Verifique o git status e commite manualmente se necessário.",
  );
  process.exit(1);
}
