export type VueScriptLang = 'js' | 'ts';

export type VueTemplate = {
  templateInner: string;
  componentName: string;
  scriptLang: VueScriptLang;
};

export type VueTemplateScript = Omit<VueTemplate, 'templateInner'>;

const getTemplate = (data: string) => `<template> ${data} </template>`;

const getScript = (data: VueTemplateScript): string => {
  const outputScriptLang = data.scriptLang === 'ts' ? ' lang="ts"' : '';

  return `<script${outputScriptLang}> \n export default {\n name: '${data.componentName}' \n} \n </script>`;
};

export function generateVueTemplate({
  templateInner,
  componentName,
  scriptLang,
}: VueTemplate): string {
  return `${getTemplate(templateInner)} \n ${getScript({ componentName, scriptLang })}`;
}
