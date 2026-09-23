#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import chalk from 'chalk';
import { createSharingServer } from '../src/server.js';
import { printSharingSession } from '../src/ui.js';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
const program = new Command();

program
  .name('quickshare')
  .description('⚡ Instant local Wi-Fi file sharing from terminal to phone via QR code.')
  .version(pkg.version)
  .argument('<file>', 'Path of the file you want to share')
  .option('-p, --port <number>', 'Custom port to run the server on (default: 3003 or next available)', '3003')
  .option('-o, --once', 'Automatically shut down the server after the first download completes')
  .action(async (filePath, options) => {
    const targetFile = path.resolve(filePath);

    // Validate file existence
    if (!fs.existsSync(targetFile)) {
      console.error(chalk.red(`\n❌ Error: File not found at path: ${targetFile}\n`));
      process.exit(1);
    }

    const stat = fs.statSync(targetFile);
    if (!stat.isFile()) {
      console.error(chalk.red(`\n❌ Error: Path is not a file: ${targetFile}\n`));
      process.exit(1);
    }

    let port = parseInt(options.port, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      port = 3003;
    }

    try {
      const { server, shareUrl, actualPort, hostIp } = await createSharingServer({
        filePath: targetFile,
        port,
        once: Boolean(options.once),
        onReady: (session) => {
          printSharingSession({
            url: session.url,
            fileName: session.fileName,
            fileSize: session.fileSize,
            hostIp: session.hostIp,
            port: session.port
          });
        }
      });

      // Handle clean shutdown
      const cleanExit = () => {
        console.log(chalk.yellow('\n\n  👋 QuickShare session closed. Goodbye!\n'));
        server.close(() => process.exit(0));
      };

      process.on('SIGINT', cleanExit);
      process.on('SIGTERM', cleanExit);
    } catch (err) {
      console.error(chalk.red(`\n❌ Failed to start QuickShare server: ${err.message}\n`));
      process.exit(1);
    }
  });

program.parse(process.argv);
