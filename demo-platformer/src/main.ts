import { launchApp } from './app';

async function main() {
  const container = document.getElementById('game-container');
  if (container === null) {
    throw new Error('Container element not found');
  }

  await launchApp(container);
}

void main();
