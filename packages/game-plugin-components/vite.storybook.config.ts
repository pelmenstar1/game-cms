import { viteConfig } from '@game-cms/storybook-config';
import { libraryWatcherPlugin } from '@game-cms/vite-plugins';

export default viteConfig([libraryWatcherPlugin(['ui'])]);
