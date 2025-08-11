# nvmlsg

A CLI tool to list global npm packages for all Node.js versions installed in nvm.

## Installation

```bash
npm install -g @bluenex/nvmlsg
```

## Usage

Simply run the command without any arguments:

```bash
nvmlsg
```

The tool will:
1. Scan all Node.js versions installed via nvm
2. List global npm packages for each version
3. Display the results in a clean format
4. Fall back to system Node.js if nvm is not available

## Features

- ✅ Detects all Node.js versions installed via nvm
- ✅ Lists global packages for each version
- ✅ Works with system Node.js when nvm is not available
- ✅ Clean, formatted output similar to `npm list -g`
- ✅ No configuration required

## Example Output

```
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

## License

MIT