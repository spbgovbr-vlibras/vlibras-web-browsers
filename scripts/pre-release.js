import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

function run(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

try {
  const currentBranch = run("git rev-parse --abbrev-ref HEAD");
  if (currentBranch !== "dev") {
    console.error(
      "❌ Erro: O processo de release deve ser iniciado a partir da branch 'dev'.",
    );
    console.error(`Branch atual: ${currentBranch}`);
    process.exit(1);
  }

  console.log("🔒 Verificando vulnerabilidades de segurança com pnpm audit...");
  try {
    execSync("pnpm audit --audit-level high", { stdio: "inherit" });
    console.log("✅ Nenhuma vulnerabilidade 'high' ou 'critical' encontrada.");
  } catch {
    console.error(
      "❌ Bloqueado: Vulnerabilidades de nível HIGH ou CRITICAL foram encontradas no projeto.",
    );
    console.error(
      "Execute 'pnpm audit' para mais detalhes e corrija-as antes de prosseguir com a release.",
    );
    process.exit(1);
  }

  const newVersion =
    process.argv[2] ||
    JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
    ).version;
  const targetBranch = `release/v${newVersion}`;

  console.log(`🚀 Iniciando pre-release para a versão v${newVersion}...`);

  console.log("📥 Buscando atualizações e tags remotas...");
  execSync("git fetch --tags --all", { stdio: "inherit" });

  console.log("🔄 Atualizando a branch 'dev' local com o remoto...");
  execSync("git pull --ff-only origin dev", { stdio: "inherit" });

  const localBranches = run("git branch --list")
    .split("\n")
    .map((b) => b.trim().replace(/^\* /, ""));
  const branchExists = localBranches.includes(targetBranch);

  if (branchExists) {
    execSync(`git branch -D ${targetBranch}`, { stdio: "inherit" });
  }
  execSync(`git checkout -b ${targetBranch}`, { stdio: "inherit" });
} catch (error) {
  console.error(
    "❌ Ocorreu um erro durante a execução do pre-release:",
    error.message,
  );
  process.exit(1);
}
