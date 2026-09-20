import qrcode from 'qrcode-terminal';
import chalk from 'chalk';

/**
 * Format bytes into readable format
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Render terminal QR code and connection instructions
 */
export function printSharingSession({ url, fileName, fileSize, hostIp, port }) {
  console.log('\n' + chalk.dim('╭─ ') + chalk.bold.cyan('⚡ QuickShare-QR ') + chalk.bgCyan.black(' READY ') + chalk.dim(' ' + '─'.repeat(24) + '╮'));
  console.log(chalk.dim('│') + `  📦 ${chalk.bold('File')}         : ${chalk.bold.white(fileName)}`);
  console.log(chalk.dim('│') + `  💾 ${chalk.bold('Size')}         : ${chalk.bold.green(formatBytes(fileSize))}`);
  console.log(chalk.dim('│') + `  🌐 ${chalk.bold('Direct URL')}   : ${chalk.bold.underline.cyan(url)}`);
  console.log(chalk.dim('│') + `  📶 ${chalk.bold('Local Wi-Fi')}  : ${chalk.dim('Phone and PC must be on same Wi-Fi')}`);
  console.log(chalk.dim('╰' + '─'.repeat(51) + '╯\n'));

  console.log(`  ${chalk.cyan('📱 Scan QR Code with your phone camera:')}\n`);

  // Generate QR code directly in terminal
  qrcode.generate(url, { small: true });

  console.log(`\n  ${chalk.dim('💡 Tip:')} Press ${chalk.red.bold('Ctrl+C')} to shut down server when finished.\n`);
}
