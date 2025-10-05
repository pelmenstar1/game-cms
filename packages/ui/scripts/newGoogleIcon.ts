import fsp from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const url = process.argv[2];
  const iconName = process.argv[3];

  const { searchParams } = new URL(url);
  const selected = searchParams.get('selected');
  if (selected === null) {
    throw new Error('Invalid URL');
  }

  const [id] = selected.split(';');
  const parts = id.split(':');
  const type = parts[0].replaceAll(' ', '').toLowerCase();
  const name = parts[1];

  const response = await fetch(
    `https://fonts.gstatic.com/s/i/short-term/release/${type}/${name}/default/24px.svg`
  );
  if (!response.ok) {
    throw new Error(`Error: ${await response.text()}`);
  }

  const svgContent = await response.text();

  const matches = [...svgContent.matchAll(/<path d="(.*?)"/gi)];

  const data = matches[0][1];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (data === undefined) {
    throw new Error('No data');
  }

  const iconDirPath = path.join(import.meta.dirname, '../src/icons', iconName);

  await fsp.mkdir(iconDirPath);
  await fsp.writeFile(
    path.join(iconDirPath, 'index.tsx'),
    `import { googleIcon } from '../google';

export const ${iconName} = googleIcon('${data}');
`
  );

  const indexPath = path.join(import.meta.dirname, '../src/icons/index.ts');
  let indexContent = await fsp.readFile(indexPath, 'utf8');
  indexContent += `export * from './${iconName}';\n`;

  await fsp.writeFile(indexPath, indexContent, 'utf8');
}

void main();
