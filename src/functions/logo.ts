import { ikariGray, ikariGreen, mpd, mpx, mpy, myp5 } from ".."

export function drawLogo(
  ax: number,
  ay: number,
  radius: number,
  unresponsive?: boolean
) {
  if (!unresponsive) {
    radius = radius * mpd
  }
  ax = ax * mpx
  ay = ay * mpy

  myp5.push()
  myp5.noStroke()
  myp5.fill(ikariGreen)
  myp5.beginShape()
  myp5.endShape()
  myp5.fill(ikariGray)
  //arrow point 1
  let offx: number = radius * 0.15
  let offy: number = 0
  myp5.beginShape()
  myp5.vertex(ax + offx, ay + offy)
  offy = radius * 0.625
  myp5.vertex(ax + offx, ay + offy)
  offx += radius / 10
  offy = radius / 2
  myp5.vertex(ax + offx, ay + offy)
  offy = radius * 0.15
  myp5.vertex(ax + offx, ay + offy)
  myp5.endShape()
  offx = radius * 1.25
  offy = radius * 1.25
  //diagonal 1
  myp5.beginShape()
  myp5.vertex(ax + offx, ay + offy)
  offx = radius * 1.125
  myp5.vertex(ax + offx, ay + offy)
  offx = radius * 0.15
  offy = radius * 0.15
  myp5.vertex(ax + offx, ay + offy)
  myp5.vertex(ax + offx, ay)
  myp5.endShape()
  offy = radius * 1.25
  offx = radius * 1.75
  //diagonal 2
  myp5.beginShape()
  myp5.vertex(ax + offx, ay + offy)
  offx = radius * 1.625
  myp5.vertex(ax + offx, ay + offy)
  offx = radius / 2
  myp5.vertex(ax + offx, ay)
  offx = radius * 0.625
  myp5.vertex(ax + offx, ay)
  myp5.endShape()
  offy = radius * 0.8125
  offx = radius * 0.8375
  //central line
  myp5.beginShape()
  myp5.vertex(ax + offx, ay + offy)
  offx = radius * 1.35
  myp5.vertex(ax + offx, ay + offy)
  offy = radius * 0.9375
  myp5.vertex(ax + offx, ay + offy)
  offx = radius * 0.9375
  myp5.vertex(ax + offx, ay + offy)
  myp5.endShape()
  let diffy: number = radius / 10
  let diffx: number = radius / 8
  offx = radius * 1.75
  offy = radius * 1.25
  //arrow2
  myp5.beginShape()
  myp5.vertex(ax + offx, ay + offy + diffy)
  myp5.vertex(ax + offx, ay + offy)
  myp5.vertex(ax + offx - diffx * 2, ay + offy)
  myp5.vertex(ax + offx - diffx * 3, ay + offy + diffy)
  myp5.endShape()
  offx = radius * 1.6875
  diffx = radius / 10
  offy = radius * 1.35
  myp5.beginShape()
  myp5.vertex(ax + offx, ay + offy)
  myp5.vertex(ax + offx + diffx, ay + offy)
  offy = radius * 0.875
  diffy = radius / 8
  myp5.vertex(ax + offx + diffx, ay + offy)
  myp5.vertex(ax + offx, ay + offy + diffy)
  myp5.endShape()

  myp5.pop()
}
