import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

function run(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function remoteBranchExists(branch) {
  return run(`git ls-remote --heads origin ${branch}`).length > 0;
}

function runAudit() {
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
}

try {
  const currentBranch = run("git rev-parse --abbrev-ref HEAD");

  const newVersion =
    process.argv[2] ||
    JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
    ).version;
  const targetBranch = `release/v${newVersion}`;

  if (currentBranch === targetBranch) {
    runAudit();
    console.log(
      `ℹ️  Já em '${targetBranch}'; reaproveitando a branch (fluxo de 'pnpm release:sync').`,
    );
  } else if (currentBranch === "dev") {
    runAudit();

    console.log(`🚀 Iniciando pre-release para a versão v${newVersion}...`);

    console.log("📥 Buscando atualizações e tags remotas...");
    execSync("git fetch --tags --all", { stdio: "inherit" });

    console.log("🔄 Atualizando a branch 'dev' local com o remoto...");
    execSync("git pull --ff-only origin dev", { stdio: "inherit" });

    const localBranches = run("git branch --list")
      .split("\n")
      .map((b) => b.trim().replace(/^\* /, ""));
    const existsLocally = localBranches.includes(targetBranch);
    const existsRemotely = remoteBranchExists(targetBranch);

    if (existsRemotely) {
      console.error(
        `❌ Erro: a branch '${targetBranch}' já foi publicada no remoto (provavelmente já existe um MR aberto para ela).`,
      );
      console.error(
        `Para incorporar novos commits da 'dev' nela, faça checkout de '${targetBranch}' e rode 'pnpm release:sync'.`,
      );
      process.exit(1);
    }

    if (existsLocally) {
      execSync(`git branch -D ${targetBranch}`, { stdio: "inherit" });
    }
    execSync(`git checkout -b ${targetBranch}`, { stdio: "inherit" });
  } else if (/^release\/v/.test(currentBranch)) {
    console.error(
      `❌ Erro: os commits novos mudam a versão a ser lançada de '${currentBranch}' para '${targetBranch}'.`,
    );
    console.error(
      "Isso costuma acontecer quando um commit 'feat' (ou breaking change) entrou onde antes só havia 'fix'.",
    );
    console.error(
      "Esse caso não é resolvido automaticamente — a branch/MR precisa ser recriada com o novo número de versão:",
    );
    console.error(`  git branch -m ${currentBranch} ${targetBranch}`);
    console.error(`  git push -u origin ${targetBranch}`);
    console.error(
      `Depois feche manualmente o MR antigo de '${currentBranch}'.`,
    );
    process.exit(1);
  } else {
    console.error(
      "❌ Erro: o processo de release deve ser iniciado a partir da branch 'dev', ou de uma 'release/vX.Y.Z' existente (via 'pnpm release:sync').",
    );
    console.error(`Branch atual: ${currentBranch}`);
    process.exit(1);
  }
} catch (error) {
  console.error(
    "❌ Ocorreu um erro durante a execução do pre-release:",
    error.message,
  );
  process.exit(1);
}
