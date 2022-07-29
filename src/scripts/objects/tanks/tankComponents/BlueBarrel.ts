import Player from '../Player'
import BaseBarrel from './BaseBarrel'
import BlueBullet from './BlueBullet'

class BlueBarrel extends BaseBarrel {
  tank: Player

  private pauseTime: number

  constructor(tank: Player) {
    super(tank.scene, tank.x, tank.y, `barrel${tank.getColor()}`)

    this.setOrigin(0.5, 1).setDepth(1).setAngle(180)

    this.echoShootingTime = 100
    this.tank = tank
    this.scene.add.existing(this)
  }

  update(): void {
    this.x = this.tank.x
    this.y = this.tank.y
  }

  public rotateToTarget(): void {
    let pointerAngle: number = this.calculatePointerAngle()

    this.angle = (pointerAngle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
  }

  public handleShoot(): void {
    if (this.scene.time.now > this.tank.lastShoot + this.tank.shootingRate) {
      this.shoot()
    } else if (this.scene.time.now - this.tank.lastShoot > this.echoShootingTime) {
      this.loading()
    }
  }

  public pause(): void {
    this.pauseTime = this.scene.time.now
  }

  public resume(): void {
    this.tank.lastShoot += this.scene.time.now - this.pauseTime
  }

  private calculatePointerAngle(): number {
    return Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.tank.getPointer().x + this.scene.cameras.main.scrollX,
      this.tank.getPointer().y + this.scene.cameras.main.scrollY
    )
  }

  private shoot(): void {
    this.scene.cameras.main.shake(20, 0.005)

    for (let bullet of this.tank.bullets.getChildren()) {
      if (!(bullet instanceof BlueBullet)) return

      if (bullet.state === 'idle') {
        this.playShootingSound()
        this.tank.lastShoot = this.scene.time.now
        bullet.fly(this.tank.x, this.tank.y)
        return
      }
    }
  }

  private playShootingSound(): void {
    if (!this.scene.sound.mute) {
      this.tank.fireSound.play()
    }
  }

  private loading(): void {
    if (!this.scene.sound.mute) {
      this.tank.fireSound.pause()
    }
  }
}

export default BlueBarrel
