export type SvgItem = {
  id: string;
  url: string;
  name: string;
};

export type ExporterSvgReturn = {
  items: SvgItem[];
  lastModified: string;
};
