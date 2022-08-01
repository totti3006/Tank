import BulletAnimation from '../../animations/BulletAnimation'
import BasePlaneBullet from './BasePlaneBullet'
import RedPlane from './RedPlane'

class PlaneBullet extends BasePlaneBullet {
  private pauseVelocity: Phaser.Math.Vector2
  plane: RedPlane

  constructor(plane: RedPlane) {
    super(plane.scene, plane.x, plane.y, 'missile')

    this.plane = plane
    this.init()
  }

  private init(): void {
    this.speed = 1000
    this.damage = 50
    this.color = this.plane.getColor()
    this.animation = new BulletAnimation(this)
    this.states = {
      idle: 'idle',
      pause: 'pause',
      flying: 'flying'
    }
    this.pauseVelocity = new Phaser.Math.Vector2(0, 0)

    this.setOrigin(0.5, 0.5).setDepth(5)
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
  }

  public update(): void {
    this.checkAutoExplode()
  }

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
    this.rotation = this.plane.rotation
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

  private checkAutoExplode(): void {
    if (this.state === this.states.flying) {
      if (this.distanceToTarget() > 1500) {
        this.explode()
      }
    }
  }

  private distanceToTarget(): number {
    return Phaser.Math.Distance.Between(this.x, this.y, this.plane.getTarget().x, this.plane.getTarget().y)
  }
}

export default PlaneBullet
