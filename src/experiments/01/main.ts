const getContext = () => {
  const canvas = document.querySelector("#app");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new TypeError("canvas must be HTMLCanvasElement");
  }

  const ctx = canvas.getContext("2d");

  if (ctx === null) throw new TypeError("ctx not found");
  return ctx;
};

const getImage = () => {
  const image = document.getElementById("image");
  if (image === null) throw new TypeError("image not found");
  if (!(image instanceof HTMLImageElement)) {
    throw new TypeError("image must be HTMLImageElement");
  }
  return image;
};

let ignore = false;
const deltas: number[] = [];

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

const draw = async (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  i: number,
) => {
  if (ignore) return;
  if (i >= 1280) return;

  //console.log("draw");
  const before = performance.now();

  ctx.drawImage(image, i, 0);

  const after = performance.now();
  deltas.push(after - before);

  await sleep(1000 / 60);
  await draw(ctx, image, i + 1);
};

const main = () => {
  const ctx = getContext();
  const image = getImage();

  draw(ctx, image, 0).then(() => {
    onrequestlog();
  });
};

const onstop = () => {
  ignore = true;
};

const sum = (array: number[]) =>
  array.reduce((accumlator, current) => accumlator + current);

const onrequestlog = () => {
  console.table(deltas);
  console.log(sum(deltas));
};

// @ts-ignore
window.onstop = onstop;
// @ts-ignore
window.onrequestlog = onrequestlog;

main();

export { onstop };
