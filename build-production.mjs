#!/usr/bin/env node

// Production build script that skips problematic static generation
import { execSync } from "child_process";

console.log("🚀 Starting production build...");

try {
  // Build with specific flags to avoid prerendering issues
  execSync("NEXT_PRIVATE_SKIP_STATIC_GEN=1 npm run build -- --no-lint", {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  });

  console.log(" Production build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
