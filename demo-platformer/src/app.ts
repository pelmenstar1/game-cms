import { Application } from 'pixi.js';

function observeResize(app: Application, container: HTMLElement) {
  const observer = new ResizeObserver(() => {
    const bounds = container.getBoundingClientRect();

    app.renderer.resize(bounds.width, bounds.height);
  });

  observer.observe(container);
}

export async function launchApp(container: HTMLElement) {
  const app = new Application();

  await app.init({
    background: '#1a1a2e',
  });

  observeResize(app, container);

  container.append(app.canvas);
}
