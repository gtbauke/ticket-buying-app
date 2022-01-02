import { spawn } from 'child_process';

const main = async () => {
  const argv = process.argv.slice(2);
  const [packageName, command, ...args] = argv;

  if (!packageName || !command) {
    console.error('Usage: yarn package <package-name> <command>');
    process.exit(1);
  }

  const packagePath = `packages/${packageName}`;
  const proc = spawn(`yarn`, [command, ...args], {
    cwd: packagePath,
    shell: true,
    stdio: 'inherit',
  });

  proc.on('spawn', () => {
    console.log(`Spawned ${packageName} ${command}`);
  });

  proc.on('exit', () => {
    console.info(`${packageName} ${command} exited with code ${proc.exitCode}`);
  });
};

main();
