import { ikariGray, ikariGreen, mpd, mpx, mpy, myp5 } from ".."

export function drawLogo(ax: number, ay: number, radius: number) {
  ax = ax * mpd
  ay = ay * mpd
  radius = radius * mpd
  myp5.push()
  myp5.noStroke()
  myp5.fill(ikariGreen)
  myp5.beginShape()
  myp5.vertex(ax, ay - radius)
  myp5.vertex(ax + radius, ay)
  myp5.vertex(ax, ay + radius)
  myp5.vertex(ax - radius, ay)
  myp5.endShape()
  ax -= radius
  ay -= radius * 0.6875
  myp5.fill(255)
  //arrow1
  let offx: number = 960 / radius
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
  myp5.beginShape()
  myp5.vertex(ax + offx, ay + offy)
  offx = radius * 1.35
  myp5.vertex(ax + offx, ay + offy)
  offy = radius * 0.9375
  myp5.vertex(ax + offx, ay + offy)
  offx = radius * 0.8375
  myp5.vertex(ax + offx, ay + offy)
  myp5.endShape()
  let diffy: number = radius / 10
  let diffx: number = radius / 8
  offx = radius * 1.75
  offy = radius * 1.25
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
