import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const appDir = path.join(rootDir, "app");
const extensionsDir = path.join(rootDir, "extensions");
const textCapturePath = path.join(__dirname, "text-capture.js");

const target = process.argv[2]; // 'firefox', 'chrome', or 'both'

if (!["firefox", "chrome", "both"].includes(target)) {
  console.error("Uso: node scripts/build-extension.js [firefox|chrome|both]");
  process.exit(1);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildExtension(extensionName) {
  const extensionDir = path.join(extensionsDir, extensionName);
  const targetAppDir = path.join(extensionDir, "app");
  const targetTextCapturePath = path.join(extensionDir, "text-capture.js");

  if (fs.existsSync(targetAppDir)) {
    fs.rmSync(targetAppDir, { recursive: true, force: true });
  }

  fs.mkdirSync(targetAppDir, { recursive: true });
  copyDirectory(appDir, targetAppDir);

  if (!fs.existsSync(textCapturePath)) {
    console.error(`Arquivo não encontrado: ${textCapturePath}`);
    process.exit(1);
  }
  fs.copyFileSync(textCapturePath, targetTextCapturePath);
}

if (target === "both") {
  buildExtension("firefox");
  buildExtension("chrome");
} else {
  buildExtension(target);
}
