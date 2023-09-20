import { myp5 } from ".."

export function checkHover(
  x: number,
  y: number,
  w: number,
  h: number
): boolean {
  if (
    myp5.mouseX > x &&
    myp5.mouseX < w + x &&
    myp5.mouseY > y &&
    myp5.mouseY < h + y
  ) {
    return true
  } else {
    return false
  }
}
