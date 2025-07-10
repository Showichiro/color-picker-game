# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Install dependencies (using Bun)
bun install

# Start development server with hot reload
bun run dev

# Run all checks before committing
bun run all

# Build for production
bun run build

# Preview production build
bun run preview
```

### Code Quality Commands
```bash
# Run Biome linter and formatter with auto-fix
bun run check

# Run TypeScript type checking
bun run type-check

# Run tests
bun run test

# Run tests in watch mode
bun run test:watch
```

## Project Architecture

This is a Vite + React + TypeScript project for a color picker game. The codebase uses:

- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: React 19 with TypeScript for type safety
- **Testing**: Vitest for unit testing
- **Code Quality**: Biome for linting/formatting, Husky for pre-commit hooks
- **Package Manager**: Bun (note the bun.lock file)

### Key Directories
- `src/`: All application source code
  - `App.tsx`: Main application component
  - `main.tsx`: Application entry point
- `public/`: Static assets served directly

### TypeScript Configuration
The project uses strict TypeScript with project references:
- `tsconfig.json`: Base configuration
- `tsconfig.app.json`: Application-specific config with strict mode enabled

### Code Style
- Biome handles both linting and formatting
- Pre-commit hooks via Husky ensure code quality
- Use `bun run check` to auto-fix style issues

## Development Workflow

1. Always run `bun run type-check` before committing to catch type errors
2. The pre-commit hook will run Biome checks automatically
3. Use `bun run all` to run all checks (linting, tests, type-check) before major changes
4. Tests should be placed alongside components with `.test.tsx` extension