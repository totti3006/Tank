import MortalObject from '../../MortalObject'

class LifeBar extends Phaser.GameObjects.Graphics {
  private obj: MortalObject

  constructor(obj: MortalObject) {
    super(obj.scene)

    this.obj = obj
    this.scene.add.existing(this)
  }

  public drawLifebar(): void {
    this.clear()
    this.fillStyle(0xe66a28, 1)
    this.fillRect(
      -this.obj.width / 2,
      this.obj.height / 2,
      this.obj.width * (this.obj.getRemainingHealth() / this.obj.getBaseHealth()),
      15
    )
    this.lineStyle(2, 0xffffff)
    this.strokeRect(-this.obj.width / 2, this.obj.height / 2, this.obj.width, 15)
    this.setDepth(1)
  }

  update(): void {
    this.x = this.obj.x
    this.y = this.obj.y
  }
}

export default LifeBar
