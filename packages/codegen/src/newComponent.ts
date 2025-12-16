import fsp from 'node:fs/promises';
import path from 'node:path';

type CreateNewComponentOptions = {
  storybook?: boolean;
  reExport?: boolean;
};

type StepContext = {
  componentName: string;
  options?: CreateNewComponentOptions;
};

type Step = {
  name: (context: StepContext) => string;
  content: (context: StepContext) => string;
  condition?: (context: StepContext) => boolean | undefined;
};

const steps: Step[] = [
  {
    name: ({ componentName }) => `${componentName}.tsx`,
    content: ({ componentName }) =>
      `import styles from './${componentName}.module.scss';

export interface ${componentName}Props {
  className?: string;
}

export function ${componentName}({ className }: ${componentName}Props) {
}

`,
  },
  {
    name: ({ componentName }) => `${componentName}.module.scss`,
    content: () => '',
  },
  {
    name: ({ componentName }) => `${componentName}.stories.tsx`,
    condition: ({ options }) => options?.storybook,
    content: ({ componentName }) =>
      `import preview from '#storybook/preview';

import { ${componentName} } from './${componentName}';

const meta = preview.meta({ component: ${componentName} });

export const Primary = meta.story({
  args: {
  },
});
`,
  },
  {
    name: () => 'index.ts',
    content: ({ componentName }) => `export * from './${componentName}';\n`,
  },
];

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
  const context: StepContext = { componentName, options };

  await fsp.mkdir(fullComponentPath);

  await Promise.all(
    steps.map(async (step) => {
      if (!step.condition || step.condition(context)) {
        const name = step.name(context);

        await fsp.writeFile(
          path.join(fullComponentPath, name),
          step.content(context)
        );
      }
    })
  );

  if (options?.reExport) {
    const indexFilePath = path.join(baseDir, '../src/components/index.ts');
    let indexContent = await fsp.readFile(indexFilePath, 'utf8');
    indexContent += `export * from './${componentName}';\n`;

    await fsp.writeFile(indexFilePath, indexContent);
  }
}
