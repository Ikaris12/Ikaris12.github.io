import { mpx, mpy, myp5, portfolioImg } from ".."

export function drawPortfolio() {
  for (let i of portfolioImg) {
    myp5.image(i, 160 * mpx, 160 * mpy)
    myp5.loadImage("assets/Sprite-0001.png", (i) => {
      myp5.image(i, 0, 0)
    })
  }
}
