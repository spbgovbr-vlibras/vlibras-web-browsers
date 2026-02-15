import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const cwd = process.cwd();

const packageJsonPath = path.join(cwd, "package.json");
const envFilePath = path.join(cwd, ".env");
const readmeFilePath = path.join(cwd, "README.md");

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const newVersion = packageJson.version;

let readmeContent = fs.readFileSync(readmeFilePath, "utf8");

const versionRegexReadme = /!\[Version\]\(https:\/\/img.shields.io\/badge\/version-[^ ]+-blue\)/;
const newVersionBadge = `![Version](https://img.shields.io/badge/version-${newVersion.replace(/-/g, "_")}-blue)`;
readmeContent = readmeContent.replace(versionRegexReadme, newVersionBadge);

const envContent = fs.readFileSync(envFilePath, "utf8");
const updatedEnvContent = envContent.replace(/VITE_APP_VERSION=[^ ]+/, `VITE_APP_VERSION=${newVersion}`);

if (!/VITE_APP_VERSION=/.test(envContent)) {
	fs.appendFileSync(envFilePath, `\nVITE_APP_VERSION=${newVersion}\n`);
} else {
	fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");
}

fs.writeFileSync(readmeFilePath, readmeContent, "utf8");
execSync("git add package.json README.md .env CHANGELOG.md", { stdio: "inherit" });
execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: "inherit" });
