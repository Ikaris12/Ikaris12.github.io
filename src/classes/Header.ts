import { ikariGray, ikariGreen, mpd, mpx, mpy, myp5 } from ".."
import { drawLogo } from "../functions/logo"
import { HeaderButton } from "./HeaderButton"

export class Header {
  headMin: number
  headMax: number
  actualH: number
  pageTitle: string = "Home"
  headerBtns: HeaderButton[] = []
  constructor(headMin: number, headMax: number) {
    this.headMin = headMin * mpy
    this.headMax = headMax * mpy
    this.actualH = headMin * mpy
  }
  addButton(button: HeaderButton) {
    button.setY(this.headMin)
    if (this.headerBtns.length > 0) {
      button.setX(
        this.headerBtns[this.headerBtns.length - 1].getW() +
          this.headerBtns[this.headerBtns.length - 1].getX()
      )
    }

    this.headerBtns.push(button)
  }
  drawButtons() {
    for (let btn of this.headerBtns) {
      btn.drawBtn()
    }
  }
  headerInteraction() {
    if (myp5.mouseY < this.actualH && myp5.mouseY > 0) {
      this.actualH = Math.ceil(
        myp5.lerp(Math.ceil(this.actualH), this.headMax, 0.15)
      )
      for (let btn of this.headerBtns) {
        btn.openAnimation()
      }
    } else {
      if (this.actualH >= this.headMin)
        this.actualH = Math.floor(myp5.lerp(this.actualH, 32, 0.15))
      for (let btn of this.headerBtns) {
        btn.closeAnimation()
      }
    }
  }
  drawHeader() {
    myp5.push()
    this.headerInteraction()
    myp5.noStroke()
    myp5.fill(ikariGreen)
    myp5.rect(0, 0, myp5.windowWidth, this.actualH)
    myp5.fill(175, 175, 175)
    myp5.textSize(this.headMin * mpd)
    myp5.text(this.pageTitle, 32 * mpx * 0.95, this.headMin * 0.7 * 0.95)
    myp5.fill(ikariGray)
    myp5.text(this.pageTitle, 32 * mpx, this.headMin * 0.7)
    this.drawButtons()
    drawLogo(1400 - this.actualH, 4, this.actualH * 0.6, true)

    myp5.pop()
  }
}
