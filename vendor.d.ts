declare module 'docxtemplater-image-module-free' {
  interface ImageModuleOptions {
    centered?: boolean;
    getImage: (tagValue: string, tagName: string) => ArrayBuffer;
    getSize: (image: unknown, tagValue: string, tagName: string) => number[];
  }

  export default class ImageModule {
    constructor(options: ImageModuleOptions);
  }
}
