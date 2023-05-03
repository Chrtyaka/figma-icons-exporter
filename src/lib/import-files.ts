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

  console.log(`Import params: \n entity:${entityForExport}, \n batchSize: ${batchSize}`);

  console.log('Find file...');

  const fileData = await client.file(fileId);
  const { lastModified } = fileData.data;

  console.log(`File founded. Last modified: ${lastModified} `);

  const processedFile: ProcessedFile = processFile(fileData.data, fileId);

  console.log('File processed');

  let canvas = config.canvas ? findCanvas(processedFile, config.canvas) : processedFile;

  console.log(`Find canvas: ${canvas}`);

  if (canvas === undefined) {
    console.log('Canvas not founded. Set base file as canvas');

    canvas = processedFile;
  }

  const frame = config.frame ? findFrameInCanvas(canvas, config.frame) : canvas;

  if (!frame?.shortcuts) {
    console.log('No items found in canvas');
    return { items: [], lastModified };
  }

  console.log('Found frame', frame.name);

  const entities = frame.shortcuts[entityForExport];

  if (!entities.length) {
    throw new Error(`Can not find entities in framse with type ${entityForExport}`);
  }

  console.log(`Found ${entities.length} entities (type: ${entities})`);

  const entityIds = entities.map(item => item.id);

  const batchCount = Math.ceil(entityIds.length / batchSize);

  const promises = Array.from(Array(batchCount), (_, i) =>
    client.fileImages(config.fileId, {
      format: 'svg',
      ids: entityIds.slice(i * batchSize, (i + 1) * batchSize),
    }),
  );

  console.log(`Making ${promises.length} requests`);

  const responses = await Promise.all(promises);

  const images = responses
    .map(item => item.data.images)
    .flat()
    .map(item => {
      return mapBatchImagesToNodes(item, entities);
    })
    .flat();

  console.log('Bind images to nodes');

  return { items: images, lastModified };
}
