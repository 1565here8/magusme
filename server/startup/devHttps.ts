import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const TLS_DIR = path.resolve(process.cwd(), ".data", "dev-tls");
const KEY_FILE = path.join(TLS_DIR, "localhost-key.pem");
const CERT_FILE = path.join(TLS_DIR, "localhost-cert.pem");
const MARKER_FILE = path.join(TLS_DIR, "cert-source.txt");

export type DevTlsTrust = "trusted" | "self-signed" | "none";

function findMkcert(): string | null {
  const candidates = [process.env.MKCERT_PATH?.trim(), "mkcert"].filter(Boolean) as string[];
  for (const bin of candidates) {
    try {
      execFileSync(bin, ["-version"], { stdio: "ignore" });
      return bin;
    } catch {
      // try next
    }
  }
  return null;
}

function findOpenssl(): string | null {
  const candidates = [
    process.env.OPENSSL_PATH?.trim(),
    "openssl",
    "C:\\Program Files\\Git\\usr\\bin\\openssl.exe",
    "C:\\Program Files (x86)\\Git\\usr\\bin\\openssl.exe",
  ].filter(Boolean) as string[];

  for (const bin of candidates) {
    try {
      execFileSync(bin, ["version"], { stdio: "ignore" });
      return bin;
    } catch {
      // try next
    }
  }
  return null;
}

function writeMarker(source: "mkcert" | "selfsigned") {
  writeFileSync(MARKER_FILE, source, "utf8");
}

function generateMkcert(mkcert: string) {
  mkdirSync(TLS_DIR, { recursive: true });
  execFileSync(
    mkcert,
    ["-key-file", KEY_FILE, "-cert-file", CERT_FILE, "localhost", "127.0.0.1", "::1"],
    { stdio: "inherit" },
  );
  writeMarker("mkcert");
}

function generateDevCert(openssl: string) {
  mkdirSync(TLS_DIR, { recursive: true });
  execFileSync(
    openssl,
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-keyout",
      KEY_FILE,
      "-out",
      CERT_FILE,
      "-days",
      "825",
      "-subj",
      "/CN=localhost",
    ],
    { stdio: "ignore" },
  );
  writeMarker("selfsigned");
}

export function devTlsTrustLevel(): DevTlsTrust {
  if (!existsSync(CERT_FILE)) return "none";
  if (existsSync(MARKER_FILE)) {
    return readFileSync(MARKER_FILE, "utf8").trim() === "mkcert" ? "trusted" : "self-signed";
  }
  return "self-signed";
}

export function loadDevTlsCredentials(): { key: string; cert: string } {
  if (!existsSync(KEY_FILE) || !existsSync(CERT_FILE)) {
    const preferMkcert = process.env.VPNIX_DEV_TLS_TRUSTED?.trim().toLowerCase() === "true";
    const mkcert = findMkcert();
    if (preferMkcert && mkcert) {
      generateMkcert(mkcert);
    } else if (mkcert && process.env.VPNIX_DEV_TLS_TRUSTED?.trim().toLowerCase() !== "false") {
      try {
        generateMkcert(mkcert);
      } catch {
        const openssl = findOpenssl();
        if (!openssl) throw new Error("mkcert failed and openssl not found.");
        generateDevCert(openssl);
      }
    } else {
      const openssl = findOpenssl();
      if (!openssl) {
        throw new Error(
          "VPNIX_DEV_HTTPS=true but no dev certificate found. Install Git for Windows (includes openssl) or set OPENSSL_PATH.",
        );
      }
      generateDevCert(openssl);
    }
  }

  return {
    key: readFileSync(KEY_FILE, "utf8"),
    cert: readFileSync(CERT_FILE, "utf8"),
  };
}

export function applyDevHttpsEnv(port: number) {
  if (!process.env.VPNIX_PUBLIC_BASE_URL?.trim()) {
    process.env.VPNIX_PUBLIC_BASE_URL = `https://localhost:${port}`;
  }
  if (!process.env.VPNIX_FORCE_HTTPS?.trim()) {
    process.env.VPNIX_FORCE_HTTPS = "true";
  }
}
