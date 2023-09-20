import { myp5 } from ".."

export class Controller {
  mouseLeft: number
  constructor() {
    this.mouseLeft = -2
  }
  mousePress() {
    if (myp5.mouseIsPressed === true) {
      switch (myp5.mouseButton) {
        case myp5.LEFT:
          this.mouseLeft++
      }
    }
  }
  reset() {
    this.mouseLeft = -1
  }
}
