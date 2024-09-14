import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { type SimpleGit, simpleGit } from 'simple-git';

const configPath = path.join(process.env.HOME || '', '.ghm.json');

//TODO: delete added account


interface Account {
  email: string;
  sshKeyPath: string;
}

interface Config {
  accounts: Record<string, Account>;
}

function loadConfig(): Config {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return { accounts: {} };
}

function saveConfig(config: Config): void {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function addAccount(name: string, email: string, sshKeyPath: string): void {
  const config = loadConfig();
  config.accounts[name] = { email, sshKeyPath };
  saveConfig(config);
  console.log(chalk.green(`Account "${name}" added successfully.`));
}

export function listAccounts(): void {
  const config = loadConfig();
  console.log(chalk.blue('Configured accounts:'));
  Object.entries(config.accounts).forEach(([name, details]) => {
    console.log(`${chalk.yellow(name)}:`);
    console.log(`  Email: ${details.email}`);
    console.log(`  SSH Key: ${details.sshKeyPath}`);
  });
}

export function switchAccount(name: string): void {
  const config = loadConfig();
  const account = config.accounts[name];
  
  if (!account) {
    console.error(chalk.red(`Account "${name}" not found.`));
    return;
  }

  try {
    execSync(`git config --global user.email "${account.email}"`);
    execSync(`git config --global core.sshCommand "ssh -i ${account.sshKeyPath}"`);
    console.log(chalk.green(`Switched to account: ${name}`));
  } catch (error) {
    console.error(chalk.red('Error switching account:'), (error as Error).message);
  }
}

export async function cloneRepo(accountName: string, repoUrl: string, directory?: string): Promise<void> {
  const config = loadConfig();
  const account = config.accounts[accountName];

  if (!account) {
    console.error(chalk.red(`Account "${accountName}" not found.`));
    return;
  }

  const git: SimpleGit = simpleGit();

  try {
    console.log(chalk.blue(`Cloning repository with account: ${accountName}`));
    await git.env('GIT_SSH_COMMAND', `ssh -i ${account.sshKeyPath}`).clone(repoUrl, directory!);
    console.log(chalk.green('Repository cloned successfully.'));

    if (directory) {
      process.chdir(directory);
      execSync(`git config user.email "${account.email}"`);
      console.log(chalk.green('Local git config set for the cloned repository.'));
    }
  } catch (error) {
    console.error(chalk.red('Error cloning repository:'), (error as Error).message);
  }
}
