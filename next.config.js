/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["langchain", "@langchain/langgraph", "@langchain/core", "@langchain/openai"]
  },
  serverExternalPackages: ["langchain", "@langchain/langgraph"]
}
module.exports = nextConfig
