import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin (and its native deps) must stay CommonJS on the server.
  // Turbopack mangles module IDs otherwise, producing
  // "Cannot find module 'firebase-admin-<hash>/app'" at runtime.
  serverExternalPackages: [
    'firebase-admin',
    '@google-cloud/firestore',
    'google-gax',
  ],
};

export default nextConfig;
