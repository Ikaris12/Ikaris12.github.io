import * as p5 from "p5"
import { HeaderButton } from "./classes/HeaderButton"
import { Header } from "./classes/Header"
import { Controller } from "./classes/Controller"
import { drawPortfolio } from "./functions/portfolio"

export var mpd: number //diagonal - fast responsive
export var mpx: number //width
export var mpy: number //height
export var ikariGreen: p5.Color
export var ikariGray: p5.Color
export var controller: Controller
export var portfolioImg: any = []
var header: Header
var img: p5.Image | p5.Element | p5.Framebuffer
export const sketch = (p: p5) => {
  var cnv
  controller = new Controller()
  ikariGreen = p.color(63, 173, 78)
  ikariGray = p.color(59, 59, 59)
  var pageId: number = 0
  // p.preload = () => {
  //   img = p.loadImage("../dist/assets/Sprite-0001.png")
  // }

  p.setup = () => {
    cnv = p.createCanvas(p.windowWidth, p.windowHeight)
    cnv.style("display", "block")
    // p.loadImage("../dist/assets/Sprite-0001.png", (img) => {
    //   p.image(img, 0, 0)
    // })
    setResponsive()
    header = new Header(32, 64)
    header.addButton(new HeaderButton(0, 32, 200, 0, ikariGreen, "Home"))
    header.addButton(new HeaderButton(0, 32, 200, 0, ikariGreen, "Portfolio"))
  }

  p.draw = () => {
    p.background(ikariGray)
    header.drawHeader()
    controller.mousePress()
    p.fill(255, 255, 0)
    setPage()
    // p.image(img, 200, 200)
    p.text(Math.ceil(p.frameRate()), 300 * mpd, 100 * mpd)
  }

  p.windowResized = () => {
    cnv = p.resizeCanvas(p.windowWidth, p.windowHeight)
    setResponsive()
  }

  p.mouseReleased = () => {
    controller.reset()
  }

  function setPage() {
    switch (pageId) {
      case 1:
        drawPortfolio()
        break
    }
  }
  function setResponsive() {
    mpd =
      Math.sqrt(Math.pow(p.windowWidth, 2) + Math.pow(p.windowHeight, 2)) / 1690 // 1/1690 of diagonal
    mpd = Math.round(mpd * 100) / 100 //rounds
    mpx = p.windowWidth / 1536 // 1/1536 of width
    mpx = Math.round(mpx * 100) / 100
    mpy = p.windowHeight / 715 // 1/715 of height
    mpy = Math.round(mpy * 100) / 100
  }
}

export const myp5 = new p5(sketch, document.body)
