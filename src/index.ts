import * as Figma from 'figma-js';
import path from 'path';
import { ExporterConfig } from './types/config';
import { createComponents } from './lib/create-components';
import { downloadFiles } from './lib/download-files';
import { importFiles } from './lib/import-files';
import { processFiles } from './lib/process-files';
import { generateFileNamesUnionType } from './lib/types-generator';

export async function exportFiles(token: string, config: ExporterConfig) {
  const client = Figma.Client({
    personalAccessToken: token,
  });

  const outputDir = path.resolve(config.outputDir);

  const filesData = await importFiles(client, config);

  await downloadFiles(filesData, { outputDir, clearOutputDir: config.clearOutputDir });

  await processFiles(outputDir);

  await createComponents(outputDir, 'vue');

  await generateFileNamesUnionType('SvgIcons', outputDir);

  process.exit(0);
}
