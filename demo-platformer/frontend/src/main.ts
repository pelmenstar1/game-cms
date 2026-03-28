import { LoadingScreen } from './loadingScreen';

const APP_BUNDLE_PROGRESS = 0.1;

function getElementByIdOrThrow(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (element === null) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element;
}

async function main() {
  const container = getElementByIdOrThrow('game-container');
  const loadingScreenElement = getElementByIdOrThrow('loading-screen');
  const loadingSpinnerElement = getElementByIdOrThrow('loading-screen-spinner');

  const loadingScreen = new LoadingScreen(loadingSpinnerElement);

  const { launchApp } = await import('./app');

  loadingScreen.setProgress(APP_BUNDLE_PROGRESS);
  await launchApp(container, (progress) => {
    const totalProgress =
      APP_BUNDLE_PROGRESS + progress * (1 - APP_BUNDLE_PROGRESS);

    loadingScreen.setProgress(totalProgress);
  });

  loadingScreenElement.remove();
}

void main();
