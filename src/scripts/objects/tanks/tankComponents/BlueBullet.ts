import BulletAnimation from '../../../animations/BulletAnimation'
import BaseTank from '../BaseTank'
import BaseBullet from './BaseBullet'

class BlueBullet extends BaseBullet {
  private pauseVelocity: Phaser.Math.Vector2

  constructor(tank: BaseTank) {
    super(tank.scene, tank.x, tank.y, `bullet${tank.getColor()}`)

    this.tank = tank
    this.init()
  }

  private init(): void {
    this.speed = 1000
    this.damage = 50
    this.color = this.tank.getColor()
    this.animation = new BulletAnimation(this)
    this.states = {
      idle: 'idle',
      pause: 'pause',
      flying: 'flying'
    }
    this.pauseVelocity = new Phaser.Math.Vector2(0, 0)

    this.setOrigin(0.5, 0.5).setDepth(2)
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
  }

  update(): void {}

  public setIdle(): void {
    this.state = this.states.idle
    this.setVisible(false)
    this.scene.physics.world.disable(this)
  }

  public fly(x: number, y: number): void {
    this.state = this.states.flying
    this.setVisible(true)
    this.scene.physics.world.enable(this)
    this.setPosition(x, y)
    this.rotation = this.tank.barrel.rotation
    this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, this.speed, this.body.velocity)
    this.animation.playFlyingEmit()
  }

  public stop(): void {
    this.explode()
  }

  public explode(): void {
    this.animation.stopFlyingEmit()

    this.body.setVelocity(0, 0)
    this.scene.physics.world.disable(this)
    this.setVisible(false)

    this.animation.playExplodeEmit()

    this.scene.time.delayedCall(500, () => {
      this.state = this.states.idle
    })
  }

  public pause(): void {
    this.state = this.states.pause
    this.pauseVelocity.x = this.body.velocity.x
    this.pauseVelocity.y = this.body.velocity.y
    this.body.setVelocity(0, 0)
    this.animation.stopFlyingEmit()
  }

  public resume(): void {
    this.state = this.states.flying
    this.body.setVelocity(this.pauseVelocity.x, this.pauseVelocity.y)
    this.animation.playFlyingEmit()
  }
}

export default BlueBullet
