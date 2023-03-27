export type SavedFile = {
  fileName: string;
  filePath: string;
  content: string;
};

export type SavedFileWithoutContent = Omit<SavedFile, 'content'>;

export type FetchedFile = {
  data: string;
  name: string;
};
