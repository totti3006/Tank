import { IBulletConstructor } from '../interfaces/bullet.interface'

export class Bullet extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body

  private bulletSpeed: number
  private flyingEmitter: Phaser.GameObjects.Particles.ParticleEmitter
  private explodeEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture)

    this.rotation = aParams.rotation
    this.initImage()
    this.scene.add.existing(this)

    this.createParticle()
  }

  private initImage(): void {
    // variables
    this.bulletSpeed = 1000

    // image
    this.setOrigin(0.5, 0.5)
    this.setDepth(2)

    // physics
    this.scene.physics.world.enable(this)
    this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, this.bulletSpeed, this.body.velocity)
  }

  private createParticle(): void {
    let particle = this.scene.add.particles('star')

    this.flyingEmitter = particle.createEmitter({
      lifespan: 200,
      speed: 100,
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      follow: this
    })

    this.explodeEmitter = particle.createEmitter({
      x: this.x,
      y: this.y,
      lifespan: 500,
      speed: 200,
      angle: { start: 0, end: 360, steps: 32 },
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      on: false
    })
  }

  update(): void {}

  explode(): void {
    this.flyingEmitter.stop()

    this.body.setVelocity(0, 0)
    this.scene.physics.world.disable(this)
    this.setVisible(false)

    this.explodeEmitter.explode(32, this.x, this.y)

    this.scene.time.delayedCall(500, () => {
      this.destroy()
    })
  }
}
