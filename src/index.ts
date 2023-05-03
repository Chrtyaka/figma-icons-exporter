import * as Figma from 'figma-js';
import path from 'path';
import { ExporterConfig } from './types/config';
import { createComponents } from './lib/create-components';
import { downloadFiles } from './lib/download-files';
import { importFiles } from './lib/import-files';
import { processFiles } from './lib/process-files';
import { generateFileNamesUnionType } from './lib/types-generator';

export async function exportFiles(token: string, config: ExporterConfig) {
  console.log('Start export...');
  console.log('Create figma client');

  const client = Figma.Client({
    personalAccessToken: token,
  });

  console.log('Figma client created');

  const outputDir = path.resolve(config.outputDir);

  console.log(`Ouptut dir: ${outputDir}`);

  console.log('Start import files...');

  const filesData = await importFiles(client, config);

  console.log('File links generated');

  console.log('Start download files');

  await downloadFiles(filesData, { outputDir, clearOutputDir: config.clearOutputDir });

  await processFiles(outputDir);

  // await createComponents(outputDir, 'vue');
  //
  // await generateFileNamesUnionType('SvgIcons', outputDir);
  //
  process.exit(0);
}
