import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const cwd = process.cwd();

const CHROME_MANIFEST = "extensions/chrome/manifest.json";
const FIREFOX_MANIFEST = "extensions/firefox/manifest.json";

const packageJsonPath = path.join(cwd, "package.json");
const readmeFilePath = path.join(cwd, "README.md");
const chromeManifestPath = path.join(cwd, CHROME_MANIFEST);
const firefoxManifestPath = path.join(cwd, FIREFOX_MANIFEST);

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const newVersion = packageJson.version;

for (const manifestPath of [chromeManifestPath, firefoxManifestPath]) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.version = newVersion;
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(manifest, null, "\t")}\n`,
    "utf8",
  );
}

let readmeContent = fs.readFileSync(readmeFilePath, "utf8");

const versionRegexReadme =
  /<img src="https:\/\/img\.shields\.io\/badge\/Versão-[^"]+-blue" alt="Versão" \/>/;
const newVersionBadge = `<img src="https://img.shields.io/badge/Versão-${newVersion.replace(/-/g, "_")}-blue" alt="Versão" />`;
readmeContent = readmeContent.replace(versionRegexReadme, newVersionBadge);

const currentYear = new Date().getFullYear();
const yearRegexReadme = /(Suíte%20VLibras-)[^-]+(-green\.svg)/;
readmeContent = readmeContent.replace(yearRegexReadme, `$1${currentYear}$2`);

fs.writeFileSync(readmeFilePath, readmeContent, "utf8");
execSync(
  `git add package.json README.md CHANGELOG.md ${CHROME_MANIFEST} ${FIREFOX_MANIFEST}`,
  { stdio: "inherit" },
);
execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: "inherit" });
