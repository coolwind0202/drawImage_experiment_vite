const getContext = () => {
  const canvas = document.querySelector("#app");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new TypeError("canvas must be HTMLCanvasElement");
  }

  const ctx = canvas.getContext("2d");

  if (ctx === null) throw new TypeError("ctx not found");
  return ctx;
};

const getVideo = () => {
  const video = document.getElementById("video");
  if (video === null) throw new TypeError("image not found");
  if (!(video instanceof HTMLVideoElement)) {
    throw new TypeError("video must be HTMLVideoElement");
  }
  return video;
};

const deltas: number[] = [];

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

const draw = async (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
) => {
  if (video.ended) return;

  const before = performance.now();

  ctx.drawImage(video, 0, 0);

  const after = performance.now();
  deltas.push(after - before);

  await sleep(1000 / 60);
  await draw(ctx, video);
};

const onplay = () => {
  const ctx = getContext();
  const video = getVideo();

  draw(ctx, video).then(() => {
    onrequestlog();
  });
};

const sum = (array: number[]) =>
  array.reduce((accumlator, current) => accumlator + current);

const onrequestlog = () => {
  console.table(deltas);
  console.log(sum(deltas));
  console.log(sum(deltas) / deltas.length);
};

const video = getVideo();
video.addEventListener("play", () => {
  onplay();
});

export {};
