#!/usr/bin/env node

import { Command } from "commander";
import { addAccount, listAccounts, switchAccount, cloneRepo } from "./index.js";
import chalk from "chalk";
import figlet from "figlet";
import pkg from "../package.json" with { type: "json" };

const program = new Command();

program
  .name(
    chalk.yellow(figlet.textSync("ghm cli tool", { horizontalLayout: "full" }))
  )
  .version(pkg.version)
  .description("CLI to Manage multiple GitHub accounts");

program
  .command("add <name> <email> <sshKeyPath>")
  .description("Add a new GitHub account")
  .action(addAccount);

program
  .command("list")
  .description("List all configured GitHub accounts")
  .action(listAccounts);

program
  .command("switch <name>")
  .description("Switch to a different GitHub account")
  .action(switchAccount);

program
  .command("clone <accountName> <repoUrl> [directory]")
  .description("Clone a repository using a specific account")
  .action(cloneRepo);

program.parse(process.argv);
