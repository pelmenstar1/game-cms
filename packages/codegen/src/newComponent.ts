import fsp from 'node:fs/promises';
import path from 'node:path';

import json5 from 'json5';

type CreateNewComponentOptions = {
  storybook?: boolean;
  reExport?: boolean;
  rootDir?: string;
};

type StepContext = {
  componentName: string;
  jsImportSuffix: string;
  options?: CreateNewComponentOptions;
};

type Step = {
  name: (context: StepContext) => string;
  content: (context: StepContext) => string;
  condition?: (context: StepContext) => boolean | undefined;
};

type TsConfig = {
  extends?: string;
  compilerOptions?: {
    moduleResolution?: string;
  };
};

async function readTsConfig(filePath: string): Promise<TsConfig> {
  const content = await fsp.readFile(filePath, 'utf8');

  return json5.parse<TsConfig>(content);
}

async function getPackageModuleResolution(filePath: string) {
  const originTsConfig = await readTsConfig(filePath);
  const moduleResolution = originTsConfig.compilerOptions?.moduleResolution;

  if (moduleResolution) {
    return moduleResolution.toLowerCase();
  }

  if (originTsConfig.extends) {
    const extendedConfigPath = path.join(
      path.dirname(filePath),
      originTsConfig.extends
    );

    return getPackageModuleResolution(extendedConfigPath);
  }

  return 'nodenext';
}

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
    content: ({ componentName, jsImportSuffix }) =>
      `import preview from '#storybook/preview';

import { ${componentName} } from './${componentName}${jsImportSuffix}';

const meta = preview.meta({ component: ${componentName} });

export const Primary = meta.story({
  args: {
  },
});
`,
  },
  {
    name: () => 'index.ts',
    content: ({ componentName, jsImportSuffix }) =>
      `export * from './${componentName}${jsImportSuffix}';\n`,
  },
];

export async function createNewComponent(
  baseDir: string,
  options?: CreateNewComponentOptions
) {
  const componentPath = process.argv[2];

  const projectDir = path.join(baseDir, '../');
  const fullComponentPath = path.join(
    projectDir,
    options?.rootDir ?? 'src/components',
    componentPath
  );

  const componentName = path.basename(componentPath);

  const moduleResolution = await getPackageModuleResolution(
    path.join(projectDir, 'tsconfig.json')
  );
  const jsImportSuffix = moduleResolution === 'nodenext' ? '.js' : '';

  const context: StepContext = { componentName, jsImportSuffix, options };

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
    const indexFilePath = path.join(projectDir, 'src/components/index.ts');

    let indexContent = await fsp.readFile(indexFilePath, 'utf8');
    indexContent += `export * from './${componentName}${jsImportSuffix}';\n`;

    await fsp.writeFile(indexFilePath, indexContent);
  }
}
