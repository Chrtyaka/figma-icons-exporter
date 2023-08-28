import type { ClientInterface } from 'figma-js';
import { ExporterConfig } from '../types/config';
import { ExporterSvgReturn, SvgItem } from '../types/svg';
import { processFile } from 'figma-transformer';
import type { ProcessedFile } from 'figma-transformer';
import { findCanvas, findFrameInCanvas } from '../utils/process-figma-file';
import { ExportableEntity } from '../types/figma-file';

const mapBatchImagesToNodes = (
  imageUrls: Record<string, string>,
  entities: ExportableEntity[],
): SvgItem[] => {
  return Object.keys(imageUrls).map(key => {
    const entity = entities.find(item => item.id === key);

    const id = entity?.id ?? '';
    const name = entity?.name ?? '';

    return {
      id,
      name,
      url: imageUrls[key],
    };
  });
};

export async function importFiles(
  client: ClientInterface,
  config: ExporterConfig,
): Promise<ExporterSvgReturn> {
  const { fileId, entityTypeForExport } = config;
  const entityForExport = entityTypeForExport || 'components';
  const batchSize = config.batchSize || 100;

  const fileData = await client.file(fileId);
  const { lastModified } = fileData.data;

  const processedFile: ProcessedFile = processFile(fileData.data, fileId);

  let canvas = config.canvas ? findCanvas(processedFile, config.canvas) : processedFile;

  if (canvas === undefined) {
    canvas = processedFile;
  }

  const frame = config.frame ? findFrameInCanvas(canvas, config.frame) : canvas;

  if (!frame) {
    return { items: [], lastModified };
  }

  const { shortcuts } = frame;

  if (!shortcuts) {
    return { items: [], lastModified };
  }

  const entities = Array.isArray(entityForExport)
    ? entityForExport.map(item => shortcuts[item]).flat()
    : shortcuts[entityForExport];

  const entityIds = entities.map(item => item.id);
  const batchCount = Math.ceil(entityIds.length / batchSize);

  const promises = Array.from(Array(batchCount), (_, i) =>
    client.fileImages(config.fileId, {
      format: 'svg',
      ids: entityIds.slice(i * batchSize, (i + 1) * batchSize),
    }),
  );

  const responses = await Promise.all(promises);

  const images = responses
    .map(item => item.data.images)
    .flat()
    .map(item => {
      return mapBatchImagesToNodes(item, entities);
    })
    .flat();

  return { items: images, lastModified };
}
