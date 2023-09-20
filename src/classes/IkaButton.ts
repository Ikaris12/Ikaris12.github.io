import * as p5 from "p5"
import { ikariGray, mpd, mpx, mpy, myp5 } from ".."
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
  fontSize = 32 * mpd
  showMsg: boolean = true
  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    btnColor: p5.Color,
    msg: string
  ) {
    this.x = x * mpx
    this.y = y * mpy
    this.w = w * mpx
    this.h = h * mpy
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
    if (checkHover(this.x, this.y, this.w, this.h)) {
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
    myp5.rect(this.x, this.y, this.w, this.h)
    this.colorDark.setAlpha(this.darkAlpha)
    myp5.fill(this.colorDark)
    myp5.rect(this.x, this.y, this.w, this.h)
    if (this.showMsg) {
      myp5.fill(ikariGray)
      myp5.textAlign("center")
      myp5.textSize(this.fontSize)
      myp5.text(
        this.msg,
        this.x + this.w / 2,
        this.y + this.h / 2 + this.fontSize / 2
      )
    }

    myp5.pop()
  }
  drawBtnPos(x: number, y: number, w: number, h: number): void {
    this.resizeBtn(x, y, w, h)
    this.drawBtn()
  }
  resizeBtn(x: number, y: number, w: number, h: number) {
    this.x = x * mpx
    this.y = y * mpy
    this.w = w * mpx
    this.h = h * mpy
    this.minimumSize()
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
    if (checkHover && myp5.mouseIsPressed === true) {
      clicked = true //to update
    }
    return clicked
  }
}
