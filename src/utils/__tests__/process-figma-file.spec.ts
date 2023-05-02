import { describe, it, expect } from '@jest/globals';
import { findCanvas, findFrameInCanvas } from '../process-figma-file';
import { ProcessedFile } from 'figma-transformer';

const MOCKED_CANVAS: ProcessedFile = {
  name: 'CANVAS',
  thumbnailUrl: '',
  lastModified: '',
  version: '',
  children: [],
  shortcuts: {
    components: [],
    lines: [],
    instances: [],
    frames: [
      {
        id: 'someFrameId1',
        children: [],
        type: 'FRAME',
        backgroundColor: { r: 0, b: 0, g: 0, a: 0 },
        name: 'TEST_FRAME_1',
        background: [],
        fills: [],
        strokes: [],
        strokeAlign: 'CENTER',
        strokeWeight: 1,
        blendMode: 'COLOR',
        constraints: { vertical: 'BOTTOM', horizontal: 'CENTER' },
        absoluteBoundingBox: { x: 0, y: 0, width: 0, height: 0 },
        clipsContent: false,
        effects: [],
      },
      {
        id: 'someFrameId2',
        children: [],
        type: 'FRAME',
        backgroundColor: { r: 0, b: 0, g: 0, a: 0 },
        name: 'TEST_FRAME_2',
        background: [],
        fills: [],
        strokes: [],
        strokeAlign: 'CENTER',
        strokeWeight: 1,
        blendMode: 'COLOR',
        constraints: { vertical: 'BOTTOM', horizontal: 'CENTER' },
        absoluteBoundingBox: { x: 0, y: 0, width: 0, height: 0 },
        clipsContent: false,
        effects: [],
      },
    ],
    groups: [],
    vectors: [],
    booleans: [],
    stars: [],
    slices: [],
    styles: [],
    ellipses: [],
    regularPolygons: [],
    rectangles: [],
    texts: [],
    pages: [
      {
        id: 'someId',
        children: [],
        type: 'CANVAS',
        backgroundColor: { r: 0, b: 0, g: 0, a: 0 },
        name: 'TEST_CANVAS',
        prototypeStartNodeID: 'some node',
      },
      {
        id: 'someId2',
        children: [],
        type: 'CANVAS',
        backgroundColor: { r: 0, b: 0, g: 0, a: 0 },
        name: 'TEST_CANVAS_2',
        prototypeStartNodeID: 'some node2',
      },
    ],
  },
};

describe('process-figma-file.ts', () => {
  describe('findCanvas', () => {
    it('should find canvas', () => {
      const result = findCanvas(MOCKED_CANVAS, 'TEST_CANVAS_2');

      expect(result?.id).toBe('someId2');
      expect(result?.type).toBe('CANVAS');
    });
  });

  describe('findFrameInCanvas', () => {
    it('should find frame', () => {
      const result = findFrameInCanvas(MOCKED_CANVAS, 'TEST_FRAME_2');

      expect(result?.id).toEqual('someFrameId2');
      expect(result?.type).toEqual('FRAME');
    });
  });
});
