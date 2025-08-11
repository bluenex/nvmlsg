# nvmlsg

![Vibe Coding](https://img.shields.io/badge/vibe-coding-blue?style=for-the-badge&logo=sparkles&logoColor=white)

A CLI tool to list global npm packages for all Node.js versions installed in nvm.

## Installation

Install globally via npm:

```bash
npm install -g @bluenex/nvmlsg
```

Or use npx to run without installing:

```bash
npx @bluenex/nvmlsg
```

## Usage

### Default Command

Simply run the command without any arguments to list all global packages:

```bash
# If installed globally
nvmlsg

# Using npx
npx @bluenex/nvmlsg

# Or explicitly use the ls command
nvmlsg ls
npx @bluenex/nvmlsg ls
```

The tool will:

1. Scan all Node.js versions installed via nvm with progress indicators
2. List global npm packages for each version
3. Display the results in a clean format
4. Fall back to system Node.js if nvm is not available

## Features

- Detects all Node.js versions installed via nvm
- Lists global packages for each version
- Works with system Node.js when nvm is not available
- Clean, formatted output similar to `npm list -g`
- Progress indicators during scanning
- Built with Commander.js for extensibility
- No configuration required

## Example Output

```
Scanning for Node.js versions... ✔

/Users/username/.nvm/versions/node/v18.16.0/lib
├── corepack@0.17.0
├── typescript@5.4.2
└── npm@9.8.1

/Users/username/.nvm/versions/node/v20.11.0/lib
├── corepack@0.23.0
├── npm@10.8.1
└── typescript@5.4.2
```

## Requirements

- Node.js (any version)
- npm

## Publishing

### Prerequisites

```bash
# Create npm account (if you don't have one)
npm adduser

# Login to npm
npm login
```

### Publishing Steps

```bash
# 1. Build the project
npm run build

# 2. Test the package locally (optional but recommended)
npm pack
# This creates a .tgz file you can inspect

# 3. Publish to npm (--access public required for scoped packages)
npm publish --access public

# 4. Verify the publication works
npx @bluenex/nvmlsg --help
```

### Version Management

```bash
# For bug fixes (1.0.0 -> 1.0.1)
npm version patch
npm publish --access public

# For new features (1.0.0 -> 1.1.0)
npm version minor
npm publish --access public

# For breaking changes (1.0.0 -> 2.0.0)
npm version major
npm publish --access public
```

For GitHub releases, push to the repository and create a new release tag.

## License

MIT
