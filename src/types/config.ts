import type { Node } from 'figma-js';

type NodeFilterFunction = (node: Node) => boolean;
type NodeFilterParam = string | NodeFilterFunction;

export type ExporterConfig = {
  outputDir: string;
  fileId: string;
  canvas?: string;
  frame?: string;
  entityTypeForExport?: 'components' | 'instances';
  component?: NodeFilterParam;
  batchSize?: number;
  clearOutputDir?: boolean;
};

export type DownloadConfig = Pick<ExporterConfig, 'clearOutputDir' | 'outputDir'>;
