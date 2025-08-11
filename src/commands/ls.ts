import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import ora, { Ora } from 'ora';

interface NodeVersionInfo {
  version: string;
  path: string;
  packages: string;
}

export async function lsCommand(): Promise<void> {
  const spinner = ora('Scanning for Node.js versions...').start();

  try {
    const versions = await detectNodeVersions(spinner);

    if (versions.length === 0) {
      spinner.stop();
      console.log('No Node.js installations found.');
      return;
    }

    spinner.stop();
    const formattedOutput = formatOutput(versions);
    console.log(formattedOutput);
  } catch (error) {
    spinner.stop();
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

async function detectNodeVersions(spinner: Ora): Promise<NodeVersionInfo[]> {
  const versions: NodeVersionInfo[] = [];

  // Check if nvm is available and has versions
  const nvmDir = join(homedir(), '.nvm', 'versions', 'node');

  if (existsSync(nvmDir)) {
    spinner.text = 'Discovering nvm Node.js versions...';

    // Get all nvm node versions
    const nodeVersions = readdirSync(nvmDir)
      .filter((dir) => {
        const fullPath = join(nvmDir, dir);
        return statSync(fullPath).isDirectory() && dir.startsWith('v');
      })
      .sort();

    for (const version of nodeVersions) {
      spinner.text = `Scanning ${version} for global packages...`;

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
          console.warn(`\nWarning: Could not list packages for ${version}`);
        }
      }
    }
  }

  // If no nvm versions found or nvm not available, try system node
  if (versions.length === 0) {
    spinner.text = 'Checking system Node.js installation...';

    try {
      const nodePath = execSync('which node', { encoding: 'utf8' }).trim();
      const npmPath = execSync('which npm', { encoding: 'utf8' }).trim();

      if (nodePath && npmPath) {
        spinner.text = 'Scanning system Node.js for global packages...';

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
      throw new Error('No Node.js installation found');
    }
  }

  return versions;
}

function formatOutput(versions: NodeVersionInfo[]): string {
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
