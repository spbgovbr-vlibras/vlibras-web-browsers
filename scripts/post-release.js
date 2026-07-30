import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const cwd = process.cwd();

const packageJsonPath = path.join(cwd, "package.json");
const readmeFilePath = path.join(cwd, "README.md");

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const newVersion = packageJson.version;

let readmeContent = fs.readFileSync(readmeFilePath, "utf8");

const versionRegexReadme =
  /!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[^)]+-blue\)/;
const newVersionBadge = `![Version](https://img.shields.io/badge/version-${newVersion.replace(/-/g, "_")}-blue)`;
readmeContent = readmeContent.replace(versionRegexReadme, newVersionBadge);

fs.writeFileSync(readmeFilePath, readmeContent, "utf8");
execSync("git add package.json README.md CHANGELOG.md", { stdio: "inherit" });
execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: "inherit" });
