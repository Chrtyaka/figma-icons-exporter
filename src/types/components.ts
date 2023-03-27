export type Frameworks = 'vue';
export type FrameworkExtensions = '.vue';

export type ComponentsMap = {
  [key in Frameworks]: {
    extension: FrameworkExtensions;
  };
};
