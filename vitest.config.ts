import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsConfigPaths()],
    test: {
        globals: true,
        include: ['**/*.test.ts', '**/*.spec.ts'],
    }
})
