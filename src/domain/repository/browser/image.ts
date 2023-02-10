import imageCompression from 'browser-image-compression';

export namespace _BrowserRepository_Image {
  export const loadFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.addEventListener('load', e => {
        resolve((e.target?.result as string) || '');
      });

      reader.readAsDataURL(file);
    });
  };
  export const compressFileIfLarge = async (
    file: File,
    maxFileSizeMb = 0.8 /* 800kB */,
  ): Promise<{ file: File; dataUrl: string }> => {
    const limitSize = maxFileSizeMb * 10 ** 6;
    if (file.size < limitSize) {
      // 100kb未満はそのまま
      const dataUrl = await loadFileAsDataUrl(file);
      return { file, dataUrl };
    } else {
      console.warn(`compress ${file.size} to ${limitSize}`);
      // 100kb以上は圧縮する
      const newFileBlob = await imageCompression(file, {
        // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
        // maxWidthOrHeight: 400,
        maxSizeMB: maxFileSizeMb,
      });
      const newFileDataUrl = await imageCompression.getDataUrlFromFile(newFileBlob);
      await imageCompression.getFilefromDataUrl(newFileDataUrl, 'new');
      return {
        file: newFileBlob,
        dataUrl: newFileDataUrl,
      };
    }
  };
}
