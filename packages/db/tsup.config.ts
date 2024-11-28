import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    format: ['esm'],
    entryPoints: ['index.ts'],
    dts: true,
    watch: process.env.WATCH === 'true', // Enable watch mode based on env var
    onSuccess: 'pnpm run on:build:success', // Optional: run something on successful build
  }
})
