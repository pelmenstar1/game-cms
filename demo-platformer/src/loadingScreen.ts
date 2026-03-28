const ACTIVE_CLASS_NAME = 'loading-screen-spinner-block-active';

export class LoadingScreen {
  private spinner: HTMLElement;

  constructor(spinner: HTMLElement) {
    this.spinner = spinner;
  }

  setProgress(value: number) {
    const blockCount = this.spinner.children.length;
    const activeBlocks = Math.round(value * blockCount);

    for (let i = 0; i < blockCount; i++) {
      const block = this.spinner.children[i] as HTMLElement;

      block.classList.toggle(ACTIVE_CLASS_NAME, i <= activeBlocks);
    }
  }
}
