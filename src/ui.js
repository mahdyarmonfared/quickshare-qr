import qrcode from 'qrcode-terminal';
import chalk from 'chalk';

/**
 * Format bytes into readable format
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Render terminal QR code and connection instructions for single file or directory
 */
export function printSharingSession({ url, fileName, fileSize, isDirectory }) {
  const sizeLabel = isDirectory ? 'Directory (Auto-Zip)' : formatBytes(fileSize);

  console.log('\n' + chalk.dim('╭─ ') + chalk.bold.cyan('⚡ QuickShare-QR ') + chalk.bgCyan.black(' READY ') + chalk.dim(' ' + '─'.repeat(24) + '╮'));
  console.log(chalk.dim('│') + `  📦 ${chalk.bold('Target')}       : ${chalk.bold.white(fileName)}${isDirectory ? chalk.cyan(' [FOLDER]') : ''}`);
  console.log(chalk.dim('│') + `  💾 ${chalk.bold('Size')}         : ${chalk.bold.green(sizeLabel)}`);
  console.log(chalk.dim('│') + `  🌐 ${chalk.bold('Direct URL')}   : ${chalk.bold.underline.cyan(url)}`);
  console.log(chalk.dim('│') + `  📶 ${chalk.bold('Local Wi-Fi')}  : ${chalk.dim('Phone and PC must be on same Wi-Fi')}`);
  console.log(chalk.dim('╰' + '─'.repeat(51) + '╯\n'));

  console.log(`  ${chalk.cyan('📱 Scan QR Code with your phone camera:')}\n`);

  // Generate QR code directly in terminal
  qrcode.generate(url, { small: true });

  console.log(`\n  ${chalk.dim('💡 Tip:')} Press ${chalk.red.bold('Ctrl+C')} to shut down server when finished.\n`);
}

/**
 * Render terminal banner for Web Hub mode
 */
export function printWebHubSession({ url, localUrl }) {
  console.log('\n' + chalk.dim('╭─ ') + chalk.bold.cyan('⚡ QuickShare-QR Web Hub ') + chalk.bgGreen.black(' ONLINE ') + chalk.dim(' ' + '─'.repeat(16) + '╮'));
  console.log(chalk.dim('│') + `  🖥️  ${chalk.bold('Laptop Web Hub')}: ${chalk.bold.underline.cyan(localUrl)}`);
  console.log(chalk.dim('│') + `  📱 ${chalk.bold('Mobile Wi-Fi')}  : ${chalk.bold.underline.green(url)}`);
  console.log(chalk.dim('│') + `  📂 ${chalk.bold('Downloads Dir')} : ${chalk.dim('~/Downloads')}`);
  console.log(chalk.dim('│') + `  📶 ${chalk.bold('Local Wi-Fi')}  : ${chalk.dim('Phone and PC must be on same Wi-Fi')}`);
  console.log(chalk.dim('╰' + '─'.repeat(51) + '╯\n'));

  console.log(`  ${chalk.cyan('📱 Scan QR Code with your phone camera to connect:')}\n`);
  qrcode.generate(url, { small: true });

  console.log(`\n  ${chalk.dim('💡 Tip:')} Open ${chalk.cyan(localUrl)} in your browser to drag & drop files.`);
  console.log(`  ${chalk.dim('🛑 Stop:')} Press ${chalk.red.bold('Ctrl+C')} to shut down.\n`);
}
