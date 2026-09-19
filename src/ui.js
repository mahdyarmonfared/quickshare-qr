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
  console.log('\n' + chalk.bold.cyan('━'.repeat(55)));
  console.log(chalk.bold.cyan('  ⚡ QuickShare-QR • Local Wi-Fi File Transfer'));
  console.log(chalk.bold.cyan('━'.repeat(55)));

  console.log(`\n  📦 ${chalk.bold('File')}         : ${chalk.bold.yellow(fileName)}`);
  console.log(`  💾 ${chalk.bold('Size')}         : ${chalk.bold.green(formatBytes(fileSize))}`);
  console.log(`  🌐 ${chalk.bold('Local URL')}     : ${chalk.bold.underline.blue(url)}`);
  console.log(`  📶 ${chalk.bold('Network')}      : ${chalk.gray('Make sure your phone is on the same Wi-Fi')}\n`);

  console.log(chalk.gray('  Scan this QR Code with your mobile camera:\n'));

  // Generate QR code directly in terminal
  qrcode.generate(url, { small: true });

  console.log('\n' + chalk.gray('  Press ') + chalk.bold.red('Ctrl+C') + chalk.gray(' to stop the server when finished.\n'));
}
