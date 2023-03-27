import { optimize } from 'svgo';
import { getFileContentsInDirectory, writeFiles } from '../utils/file-utils';
import type { SavedFile } from '../types/files';

const FILL_REGEX = /fill="#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})"/gm;

export type FilesData = {
  path: string;
  content: string;
};

const replaceFill = (files: SavedFile[]): SavedFile[] => {
  return files.map(item => {
    const content = item.content.replace(FILL_REGEX, 'fill="currentColor"');

    return {
      ...item,
      content,
    };
  });
};

const optimizeFiles = (files: SavedFile[]): SavedFile[] => {
  return files.map(item => {
    const { data } = optimize(item.content, {
      path: item.filePath,
      multipass: true,
      plugins: [
        'cleanupAttrs',
        'cleanupEnableBackground',
        'cleanupIds',
        'cleanupListOfValues',
        'cleanupNumericValues',
        'collapseGroups',
        'convertEllipseToCircle',
        'convertPathData',
        'convertShapeToPath',
        'convertTransform',
        'sortDefsChildren',
        'sortAttrs',
        'reusePaths',
        'removeXMLNS',
        'removeUselessStrokeAndFill',
        'removeUselessDefs',
        'removeUnusedNS',
        'removeUnknownsAndDefaults',
        'removeTitle',
        'removeStyleElement',
        'removeRasterImages',
        'removeEmptyText',
        'removeOffCanvasPaths',
        'removeDoctype',
        'mergePaths',
        'minifyStyles',
      ],
    });

    return {
      ...item,
      content: data,
    };
  });
};

export async function processFiles(dirPath: string): Promise<void[]> {
  const fileContents = await getFileContentsInDirectory(dirPath);

  const replacedFillContent = replaceFill(fileContents);

  const clearedContent = optimizeFiles(replacedFillContent);

  return writeFiles(clearedContent);
}
