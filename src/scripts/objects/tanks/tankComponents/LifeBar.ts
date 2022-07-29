import BaseTank from '../BaseTank'

class LifeBar extends Phaser.GameObjects.Graphics {
  private tank: BaseTank

  constructor(tank: BaseTank) {
    super(tank.scene)

    this.tank = tank
    this.scene.add.existing(this)
  }

  public drawLifebar(): void {
    this.clear()
    this.fillStyle(0xe66a28, 1)
    this.fillRect(
      -this.tank.width / 2,
      this.tank.height / 2,
      this.tank.width * (this.tank.remainingHealth / this.tank.baseHealth),
      15
    )
    this.lineStyle(2, 0xffffff)
    this.strokeRect(-this.tank.width / 2, this.tank.height / 2, this.tank.width, 15)
    this.setDepth(1)
  }

  update(): void {
    this.x = this.tank.x
    this.y = this.tank.y
  }
}

export default LifeBar
