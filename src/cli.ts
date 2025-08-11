#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';

interface NodeVersionInfo {
  version: string;
  path: string;
  packages: string;
}

class NvmListGlobal {
  private async detectNodeVersions(): Promise<NodeVersionInfo[]> {
    const versions: NodeVersionInfo[] = [];

    // Check if nvm is available and has versions
    const nvmDir = join(homedir(), '.nvm', 'versions', 'node');

    if (existsSync(nvmDir)) {
      // Get all nvm node versions
      const nodeVersions = readdirSync(nvmDir)
        .filter((dir) => {
          const fullPath = join(nvmDir, dir);
          return statSync(fullPath).isDirectory() && dir.startsWith('v');
        })
        .sort();

      for (const version of nodeVersions) {
        const nodePath = join(nvmDir, version, 'bin', 'node');
        const npmPath = join(nvmDir, version, 'bin', 'npm');

        if (existsSync(nodePath) && existsSync(npmPath)) {
          try {
            const packages = execSync(`"${npmPath}" list -g --depth=0`, {
              encoding: 'utf8',
              env: {
                ...process.env,
                PATH: `${join(nvmDir, version, 'bin')}:${process.env.PATH}`,
              },
            });

            versions.push({
              version,
              path: join(nvmDir, version),
              packages: packages.trim(),
            });
          } catch {
            console.warn(`Warning: Could not list packages for ${version}`);
          }
        }
      }
    }

    // If no nvm versions found or nvm not available, try system node
    if (versions.length === 0) {
      try {
        const nodePath = execSync('which node', { encoding: 'utf8' }).trim();
        const npmPath = execSync('which npm', { encoding: 'utf8' }).trim();

        if (nodePath && npmPath) {
          const packages = execSync('npm list -g --depth=0', {
            encoding: 'utf8',
          });
          const nodeVersion = execSync('node --version', {
            encoding: 'utf8',
          }).trim();

          versions.push({
            version: `system-${nodeVersion}`,
            path: resolve(nodePath, '..', '..'),
            packages: packages.trim(),
          });
        }
      } catch {
        console.error('Error: No Node.js installation found');
        process.exit(1);
      }
    }

    return versions;
  }

  private formatOutput(versions: NodeVersionInfo[]): string {
    let output = '';

    for (const { packages } of versions) {
      // Extract the package list part (everything after the first line which contains the path)
      const lines = packages.split('\n');
      const globalPath = lines[0];
      const packageList = lines.slice(1).join('\n');

      output += `${globalPath}\n${packageList}\n\n`;
    }

    return output.trim();
  }

  public async run(): Promise<void> {
    try {
      console.log('Scanning for Node.js versions and global packages...\n');

      const versions = await this.detectNodeVersions();

      if (versions.length === 0) {
        console.log('No Node.js installations found.');
        return;
      }

      const formattedOutput = this.formatOutput(versions);
      console.log(formattedOutput);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  }
}

// Run the CLI
const cli = new NvmListGlobal();
cli.run().catch(console.error);
