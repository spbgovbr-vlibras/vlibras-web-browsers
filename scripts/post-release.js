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
  /<img src="https:\/\/img\.shields\.io\/badge\/Versão-[^"]+-blue" alt="Versão" \/>/;
const newVersionBadge = `<img src="https://img.shields.io/badge/Versão-${newVersion.replace(/-/g, "_")}-blue" alt="Versão" />`;
readmeContent = readmeContent.replace(versionRegexReadme, newVersionBadge);

const currentYear = new Date().getFullYear();
const yearRegexReadme = /(Suíte%20VLibras-)[^-]+(-green\.svg)/;
readmeContent = readmeContent.replace(yearRegexReadme, `$1${currentYear}$2`);

fs.writeFileSync(readmeFilePath, readmeContent, "utf8");
execSync("git add package.json README.md CHANGELOG.md", { stdio: "inherit" });
execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: "inherit" });
