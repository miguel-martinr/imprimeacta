import type { Ref } from 'vue';

export const processImage = (
  _mainCanvas: Ref<HTMLCanvasElement>,
  _canvasResult: Ref<HTMLCanvasElement>,
  _image: HTMLImageElement,
  _imageActaResult: Ref<HTMLImageElement>,
  _linkToDownloadActaRef: Ref<HTMLAnchorElement>,
) => {  
  const mainCanvas = _mainCanvas.value;
  const canvasResult = _canvasResult.value;
  const image = _image;
  const imageActaResult = _imageActaResult.value;
  const linkToDownloadActaRef = _linkToDownloadActaRef.value

  const ctx = mainCanvas.getContext('2d');
  if (!ctx) return;    

  mainCanvas.width = image.width;
  mainCanvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const stripCanvas = canvasResult;
  const stripCtx = stripCanvas.getContext('2d');
  if (!stripCtx) return;

  stripCtx.clearRect(0, 0, stripCanvas.width, stripCanvas.height);

  //       drawImage(image, sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight)
  stripCtx.drawImage(image, 0, 0, 656, 1766, 0, 0, 328, 883);
  stripCtx.drawImage(image, 0, 1766, 656, 1766, 329, 0, 328, 883);
  stripCtx.drawImage(image, 0, 3532, 656, 1766, 657, 0, 328, 883);
  stripCtx.drawImage(image, 0, 5298, 656, 1766, 985, 0, 328, 883);
  const actaDataURL = stripCanvas.toDataURL();
  imageActaResult.src = actaDataURL;
  linkToDownloadActaRef.href = actaDataURL;
  linkToDownloadActaRef.download = 'acta.png';
  linkToDownloadActaRef.click();
}

export const stripImage = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const stripCanvas = document.createElement('canvas');
  const stripCtx = stripCanvas.getContext('2d');
  if (!stripCtx) return;

  stripCtx.clearRect(0, 0, stripCanvas.width, stripCanvas.height);

  //       drawImage(image, sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight)
  stripCtx.drawImage(image, 0, 0, 656, 1766, 0, 0, 328, 883);
  stripCtx.drawImage(image, 0, 1766, 656, 1766, 329, 0, 328, 883);
  stripCtx.drawImage(image, 0, 3532, 656, 1766, 657, 0, 328, 883);
  stripCtx.drawImage(image, 0, 5298, 656, 1766, 985, 0, 328, 883);
  const strippedImage = new Image();
  strippedImage.src = stripCanvas.toDataURL();
  return strippedImage;
}

export const downloadImage = (image: HTMLImageElement, name: string) => {  
  const link = document.createElement('a');
  link.href = image.src;
  link.download = name;
  link.click();
  link.remove();
}

export function convert(oldImag: HTMLImageElement, callback: CallableFunction) {
  var img = new Image();
  img.onload = function(){
      callback(img)
  }
  img.setAttribute('crossorigin', 'anonymous');
  img.src = oldImag.src;
}
export function getBase64Image(img: HTMLImageElement, callback: CallableFunction) {
  convert(img, function(newImg: HTMLImageElement){
      var canvas = document.createElement("canvas");
      canvas.width = newImg.width;
      canvas.height = newImg.height;
      var ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(newImg, 0, 0);
      var base64=canvas.toDataURL("image/png");
      callback(base64)
  })
}

export const drawImageInCanvas = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);  
}
