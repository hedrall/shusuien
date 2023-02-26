import imageCompression from 'browser-image-compression';

const dataURLtoFile = (dataurl: string, filename = 'temp'): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'unknown';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
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

  type Res = {
    file: File;
    dataUrl: string;
  };
  export const compressBase64Image = async (imageDataUrl: string, maxFileSizeKB: number): Promise<Res> => {
    const file = dataURLtoFile(imageDataUrl);
    return await compressFileIfLarge(file, maxFileSizeKB / 1000);
  };
  export const compressFileIfLarge = async (file: File, maxFileSizeMb = 0.8 /* 800kB */): Promise<Res> => {
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

  export const canvasImageCompressor = async (imageDataUrl: string, size = 240): Promise<string> => {
    const canvasの一辺 = size;

    return new Promise(resolve => {
      const img = new Image();
      img.onload = function () {
        // 画像のonloadで, width, heightが読み取れるようになっている
        const { width, height } = img;

        // Canvasを準備
        const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
        const canvasContext = canvas?.getContext('2d');
        if (!canvas || !canvasContext) {
          throw new Error('このページに <canvas id="canvas" /> を設置してください。');
        }

        // 正方形に切り抜きたいので、切り抜き開始位置を決定していく
        const 長編 = Math.min(width, height);
        const xの切り抜き開始位置 = width / 2 - 長編 / 2;
        const yの切り抜き開始位置 = height / 2 - 長編 / 2;

        // Canvasに描画する
        canvas.width = canvasの一辺;
        canvas.height = canvasの一辺;
        canvasContext.drawImage(
          img,
          xの切り抜き開始位置,
          yの切り抜き開始位置,
          長編,
          長編,
          0,
          0,
          canvasの一辺,
          canvasの一辺,
        );

        resolve(canvas.toDataURL());
      };

      img.src = imageDataUrl;
    });
  };
}
