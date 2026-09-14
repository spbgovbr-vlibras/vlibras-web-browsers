import { execSync } from "node:child_process";

function run(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

const RELEASE_BRANCH_RE = /^release\/v(.+)$/;

try {
  const currentBranch = run("git rev-parse --abbrev-ref HEAD");
  const match = currentBranch.match(RELEASE_BRANCH_RE);
  if (!match) {
    console.error(
      "❌ Erro: 'pnpm release:sync' deve ser rodado de dentro de uma branch 'release/vX.Y.Z'.",
    );
    console.error(`Branch atual: ${currentBranch}`);
    process.exit(1);
  }
  const oldVersion = match[1];

  const status = run("git status --porcelain");
  if (status) {
    console.error(
      "❌ Erro: há alterações não commitadas nessa branch. Commit, stash ou descarte antes de sincronizar.",
    );
    process.exit(1);
  }

  const tipMessage = run("git log -1 --pretty=%s");
  if (!tipMessage.startsWith("chore: release v")) {
    console.error(
      `❌ Erro: o commit no topo da branch não parece ser um commit de release ("${tipMessage}").`,
    );
    console.error(
      "'release:sync' espera encontrar exatamente o commit gerado pelo 'post-release.js' no topo, para poder descartá-lo e regerá-lo. Resolva manualmente.",
    );
    process.exit(1);
  }

  console.log("📥 Buscando atualizações da 'dev' no remoto...");
  execSync("git fetch origin dev", { stdio: "inherit" });

  console.log(
    `🔄 Descartando o commit de release antigo ("v${oldVersion}") e trazendo a 'dev' atualizada...`,
  );
  execSync("git reset --hard origin/dev", { stdio: "inherit" });

  // Se os novos commits mudaram o tipo do bump (ex.: entrou um 'feat' onde só
  // havia 'fix'), o 'pre-release.js' detecta que '${targetBranch}' calculado
  // não bate com a branch atual e aborta com instruções — o que faz esse
  // 'pnpm release' falhar e cair no catch abaixo, sem chegar no push.
  console.log("🚀 Recalculando a versão e regerando o commit de release...");
  execSync("pnpm release", { stdio: "inherit" });

  console.log(
    `✅ Versão mantida em 'v${oldVersion}'. Atualizando o MR existente...`,
  );
  execSync(`git fetch origin ${currentBranch}`, { stdio: "inherit" });
  execSync(`git push --force-with-lease origin ${currentBranch}`, {
    stdio: "inherit",
  });

  console.log("✅ Sincronização concluída.");
} catch (error) {
  console.error(
    "❌ Ocorreu um erro durante a execução do release:sync. Veja a mensagem acima para detalhes.",
    error.message,
  );
  process.exit(1);
}
