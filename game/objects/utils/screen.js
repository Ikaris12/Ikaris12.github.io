export let W = 0;
export let H = 0;
export let rW = 0;
export let rH = 0;
export function updateScreenSize(width, height) {
  W = width;
  H = height;
  rW = W / 1920;
  rH = H / 1080;
}
