import { Node, Canvas, Frame, Component, ComponentMetadata, Instance } from 'figma-js';
import { NodeWithShortcuts } from 'figma-transformer';

export type FindCanvasFilter = string;

export type FindFrameFilter = string;

export type FileChildrenNode<T extends Node> = NodeWithShortcuts<T>;
export type FileChildren<T extends Node> = Array<FileChildrenNode<T>>;

export type CanvasNode = FileChildrenNode<Canvas>;
export type CanvasNodes = Array<CanvasNode>;

export type FrameNode = FileChildrenNode<Frame>;
export type FrameNodes = Array<FileChildrenNode<Frame>>;

export type ExportableEntity =
  | NodeWithShortcuts<Component & ComponentMetadata>
  | NodeWithShortcuts<Instance>;
