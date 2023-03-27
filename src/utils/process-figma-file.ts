import { ProcessedFile } from 'figma-transformer';
import { CanvasNode, FindCanvasFilter, FindFrameFilter, FrameNode } from '../types/figma-file';

export function findCanvas(file: ProcessedFile, filter: FindCanvasFilter): CanvasNode | undefined {
  const children = file.shortcuts.pages;

  if (typeof filter === 'string') {
    return children.find(item => item.name === filter);
  }
}

export function findFrameInCanvas(
  canvas: CanvasNode | ProcessedFile,
  filter: FindFrameFilter,
): FrameNode | undefined {
  const children = canvas.shortcuts?.frames;

  if (children === undefined) {
    return undefined;
  }

  if (typeof filter === 'string') {
    return children.find(item => item.name === filter);
  }
}
