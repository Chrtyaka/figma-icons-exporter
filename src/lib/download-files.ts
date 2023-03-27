import { ExporterSvgReturn, SvgItem } from '../types/svg';

import fetch from 'node-fetch';
import { DownloadConfig } from '../types/config';
import { createDirectory, cleanDirectory, writeFiles } from '../utils/file-utils';
import { FetchedFile, SavedFile } from '../types/files';

const download = async (items: SvgItem[]): Promise<FetchedFile[]> => {
  return Promise.all(
    items.map(async (data): Promise<FetchedFile> => {
      const downloadedSvg = await fetch(data.url);

      const body = await downloadedSvg.text();

      return {
        data: body,
        name: data.name,
      };
    }),
  );
};

export async function downloadFiles(filesData: ExporterSvgReturn, config: DownloadConfig) {
  await createDirectory(config.outputDir);

  if (config.clearOutputDir) {
    cleanDirectory(config.outputDir);
  }

  const imageFiles = await download(filesData.items);

  const filesToSave: SavedFile[] = imageFiles.map(item => {
    return {
      fileName: item.name,
      content: item.data,
      filePath: `${config.outputDir}/${item.name}.svg`,
    };
  });

  try {
    await writeFiles(filesToSave);
  } catch (e) {
    console.log(e);
    return;
  }
}
