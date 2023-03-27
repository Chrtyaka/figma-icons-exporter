import path from 'path';

function checkPathStartsWithSingleDot(filePath: string): boolean {
  const firstTwoChars = filePath.slice(0, 2);

  return firstTwoChars === `.${path.sep}` || firstTwoChars === './';
}

export function replaceFileExtension(filePath: string, extension: string) {
  const newFileName = path.basename(filePath, path.extname(filePath)) + extension;
  const newFilePath = path.join(path.dirname(filePath), newFileName);

  if (checkPathStartsWithSingleDot(newFilePath)) {
    return `./${path.sep}${newFileName}`;
  }

  return newFilePath;
}
