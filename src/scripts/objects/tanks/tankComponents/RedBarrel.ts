import BaseTank from '../BaseTank'
import Player from '../Player'
import BaseBarrel from './BaseBarrel'
import RedBullet from './RedBullet'

class RedBarrel extends BaseBarrel {
  private pauseTime: number

  constructor(tank: BaseTank) {
    super(tank.scene, tank.x, tank.y, `barrel${tank.getColor()}`)

    this.setOrigin(0.5, 1).setDepth(1).setAngle(180)
    this.echoShootingTime = 100
    this.tank = tank
    this.pauseTime = 0
    this.scene.add.existing(this)
  }

  public rotateToTarget(player: Player): void {
    let angle = Phaser.Math.Angle.Between(this.tank.body.x, this.tank.body.y, player.body.x, player.body.y)

    this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
  }

  public handleShoot(): void {
    if (this.scene.time.now > this.tank.lastShoot + this.tank.shootingRate) {
      for (let bullet of this.tank.bullets.getChildren()) {
        if (!(bullet instanceof RedBullet)) return

        if (bullet.state === 'idle') {
          this.playShootingSound()
          this.tank.lastShoot = this.scene.time.now
          bullet.fly(this.tank.x, this.tank.y)
          return
        }
      }
    }
  }

  public update(): void {
    this.x = this.tank.x
    this.y = this.tank.y
  }

  public pause(): void {
    this.pauseTime = this.scene.time.now
  }

  public resume(): void {
    this.tank.lastShoot += this.scene.time.now - this.pauseTime
  }

  private playShootingSound(): void {
    if (!this.scene.sound.mute) {
      this.tank.fireSound.play()
    }
  }
}

export default RedBarrel
