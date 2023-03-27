import { generateVueTemplate } from '../templates/vue';
import { changeFileExtension, getFileContentsInDirectory, writeFiles } from '../utils/file-utils';
import type { ComponentsMap, Frameworks } from '../types/components';

const COMPONENTS_MAP: ComponentsMap = {
  vue: {
    extension: '.vue',
  },
};

const convertSVGToVue = async (directory: string): Promise<void> => {
  const files = await getFileContentsInDirectory(directory);

  const vueFilesContent = files.map(item => {
    const template = generateVueTemplate({
      templateInner: item.content,
      componentName: item.fileName.replace('.svg', ''),
      scriptLang: 'js',
    });

    return {
      ...item,
      content: template,
    };
  });

  await writeFiles(vueFilesContent);

  await changeFileExtension(vueFilesContent, COMPONENTS_MAP.vue.extension);
};

export function createComponents(outputDir: string, framework: Frameworks): Promise<void> {
  if (framework === 'vue') {
    return convertSVGToVue(outputDir);
  }

  return Promise.resolve();
}
