import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN の IP アドレス（例: スマホから）で開発サーバーへアクセスするために許可する
  allowedDevOrigins: ["192.168.11.11"],
};

export default nextConfig;
