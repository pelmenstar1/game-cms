import fsp from 'node:fs/promises';
import path from 'node:path';

type CreateNewComponentOptions = {
  storybook?: boolean;
  reExport?: boolean;
};

export async function createNewComponent(
  baseDir: string,
  componentPath: string,
  options?: CreateNewComponentOptions
) {
  const fullComponentPath = path.join(
    baseDir,
    '../src/components',
    componentPath
  );

  const componentName = path.basename(componentPath);

  await fsp.mkdir(fullComponentPath);
  await fsp.writeFile(
    path.join(fullComponentPath, `${componentName}.tsx`),
    `import styles from './${componentName}.module.scss';

export interface ${componentName}Props {
  className?: string;
}

export function ${componentName}({ className }: ${componentName}Props) {
}

`,
    'utf8'
  );

  await fsp.writeFile(
    path.join(fullComponentPath, `${componentName}.module.scss`),
    '',
    'utf8'
  );

  if (options?.storybook) {
    await fsp.writeFile(
      path.join(fullComponentPath, `${componentName}.stories.tsx`),
      `import type { Meta, StoryObj } from '@storybook/react';

import { ${componentName} } from './${componentName}';

export default {
  component: ${componentName},
} satisfies Meta<typeof ${componentName}>;

type Story = StoryObj<typeof ${componentName}>;

export const Primary: Story = {
  args: {
  },
};
`,
      'utf8'
    );
  }

  await fsp.writeFile(
    path.join(fullComponentPath, 'index.ts'),
    `export * from './${componentName}';\n`,
    'utf8'
  );

  if (options?.reExport) {
    const indexFilePath = path.join(
      import.meta.dirname,
      '../src/components/index.ts'
    );
    let indexContent = await fsp.readFile(indexFilePath, 'utf8');
    indexContent += `export * from './${componentName}';\n`;

    await fsp.writeFile(indexFilePath, indexContent);
  }
}
