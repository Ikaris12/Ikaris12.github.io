import * as p5 from "p5"
import { controller, ikariGray, mpd, mpx, mpy, myp5 } from ".."
import { checkHover } from "../functions/checkhover"

export class IkaButton {
  x: number
  y: number
  w: number
  h: number
  msg: string
  darkAlpha: number = 100
  btnColor: p5.Color
  colorDark: p5.Color = myp5.color(0, 0, 0, this.darkAlpha)
  fontSize = 32
  showMsg: boolean = true
  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    btnColor: p5.Color,
    msg: string
  ) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.darkAlpha = 0
    this.btnColor = btnColor
    this.colorDark = myp5.color(0, 0, 0)
    this.msg = msg
    this.minimumSize()
  }
  setX(x: number) {
    this.x = x
  }
  setY(y: number) {
    this.y = y
  }
  setW(w: number) {
    this.w = w
  }
  setH(h: number) {
    this.h = h
  }

  getX(): number {
    return this.x
  }
  getY(): number {
    return this.y
  }
  getW(): number {
    return this.w
  }
  getH(): number {
    return this.h
  }
  onHover() {
    let maxDark: number = 50
    if (checkHover(this.x * mpx, this.y * mpy, this.w * mpx, this.h * mpy)) {
      this.darkAlpha = Math.ceil(myp5.lerp(this.darkAlpha, maxDark, 0.15))
    } else {
      this.darkAlpha = Math.floor(myp5.lerp(this.darkAlpha, 0, 0.15))
    }
  }

  drawBtn() {
    this.onHover()
    this.onButtonClick()
    myp5.push()
    myp5.fill(this.btnColor)
    myp5.rect(this.x * mpx, this.y * mpy, this.w * mpx, this.h * mpy)
    this.colorDark.setAlpha(this.darkAlpha)
    myp5.fill(this.colorDark)
    myp5.rect(this.x * mpx, this.y * mpy, this.w * mpx, this.h * mpy)
    if (this.showMsg) {
      myp5.fill(ikariGray)
      myp5.textAlign("center")
      myp5.textSize(this.fontSize * mpd)
      myp5.text(
        this.msg,
        this.x * mpx + (this.w * mpx) / 2,
        this.y * mpy * 0.9 + (this.h * mpy) / 2 + this.fontSize / 2
      )
    }

    myp5.pop()
  }
  minimumSize() {
    if (this.w < this.fontSize * this.msg.length) {
      this.w = this.fontSize * this.msg.length
    }
    if (this.h < this.fontSize) {
      this.h = this.fontSize * 2
    }
  }
  onButtonClick(): boolean {
    let clicked: boolean = false
    if (
      checkHover(this.x * mpx, this.y * mpy, this.w * mpx, this.h * mpy) &&
      controller.mouseLeft == 0
    ) {
      console.log(this.msg)
    }
    return clicked
  }
}
