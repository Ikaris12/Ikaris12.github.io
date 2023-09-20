import { myp5 } from ".."
import { IkaButton } from "./IkaButton"

export class HeaderButton extends IkaButton {
  openAnimation() {
    this.h = Math.ceil(myp5.lerp(this.h, 32, 0.15))
    this.showMsg = true
  }
  closeAnimation() {
    this.h = Math.floor(myp5.lerp(this.h, 0, 0.15))
    this.showMsg = false
  }
}
