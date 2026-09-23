#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { Command } from 'commander';
import chalk from 'chalk';
import { createSharingServer } from '../src/server.js';
import { printSharingSession, printWebHubSession } from '../src/ui.js';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
const program = new Command();

program
  .name('quickshare')
  .description('⚡ Instant local Wi-Fi file sharing from terminal to phone via QR code.')
  .version(pkg.version)
  .argument('[args...]', 'Path of the file or directory you want to share, or "web [port]"')
  .option('-p, --port <number>', 'Custom port to run the server on (default: 3003 or next available)', '3003')
  .option('-o, --once', 'Automatically shut down the server after the first download completes')
  .option('-d, --dir <folder>', 'Custom directory to save phone uploads (default: ~/Downloads)')
  .option('--web', 'Explicitly launch in Web Hub mode')
  .action(async (args, options) => {
    const rawArgs = Array.isArray(args) ? args : (args ? [args] : []);
    const firstArg = rawArgs[0];
    const secondArg = rawArgs[1];

    let port = 3003;
    if (options.port) {
      port = parseInt(options.port, 10);
    }
    if (firstArg === 'web' && secondArg && !isNaN(parseInt(secondArg, 10))) {
      port = parseInt(secondArg, 10);
    }
    if (isNaN(port) || port < 1 || port > 65535) {
      port = 3003;
    }

    const uploadDir = options.dir
      ? path.resolve(options.dir)
      : path.join(os.homedir(), 'Downloads');

    // 1. Web Hub Mode (if target is omitted, or target === 'web', or --web is passed)
    const isWebMode = options.web || !firstArg || firstArg === 'web';

    if (isWebMode) {
      try {
        const { server, shareUrl, actualPort, hostIp } = await createSharingServer({
          filePath: null,
          port,
          once: false,
          uploadDir,
          onReady: (session) => {
            const localUrl = `http://localhost:${session.port}`;
            printWebHubSession({
              url: session.url,
              localUrl,
              hostIp: session.hostIp,
              port: session.port
            });
          }
        });

        const cleanExit = () => {
          console.log(chalk.yellow('\n\n  👋 QuickShare Web Hub closed. Goodbye!\n'));
          server.close(() => process.exit(0));
        };

        process.on('SIGINT', cleanExit);
        process.on('SIGTERM', cleanExit);
        return;
      } catch (err) {
        console.error(chalk.red(`\n❌ Failed to start QuickShare Web Hub: ${err.message}\n`));
        process.exit(1);
      }
    }

    // 2. Direct File or Directory Share Mode
    const target = firstArg;
    const absoluteTarget = path.resolve(target);

    if (!fs.existsSync(absoluteTarget)) {
      console.error(chalk.red(`\n❌ Error: Target not found at path: ${absoluteTarget}\n`));
      process.exit(1);
    }

    const stat = fs.statSync(absoluteTarget);
    const isDirectory = stat.isDirectory();

    try {
      const { server, shareUrl, actualPort, hostIp } = await createSharingServer({
        filePath: absoluteTarget,
        port,
        once: Boolean(options.once),
        uploadDir,
        onReady: (session) => {
          printSharingSession({
            url: session.url,
            fileName: session.fileName,
            fileSize: session.fileSize,
            isDirectory: session.isDirectory,
            hostIp: session.hostIp,
            port: session.port
          });
        }
      });

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
