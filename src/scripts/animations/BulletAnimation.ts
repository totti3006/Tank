class BulletAnimation {
  private scene: Phaser.Scene
  private source: Phaser.GameObjects.Image

  private emitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager

  private flyingEmitter: Phaser.GameObjects.Particles.ParticleEmitter
  private explodeEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(source: Phaser.GameObjects.Image) {
    this.source = source
    this.scene = source.scene

    this.init()

    this.createExplodeEmitter()
    this.createFlyingEmitter()
  }

  public playFlyingEmit(): void {
    this.flyingEmitter.start()
  }

  public playExplodeEmit(): void {
    this.explodeEmitter.explode(32, this.source.x, this.source.y)
  }

  public stopFlyingEmit(): void {
    this.flyingEmitter.stop()
  }

  private init(): void {
    this.emitterManager = this.scene.add.particles('star')
  }

  private createFlyingEmitter(): void {
    this.flyingEmitter = this.emitterManager.createEmitter({
      lifespan: 200,
      speed: 100,
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      follow: this.source,
      on: false
    })
  }

  private createExplodeEmitter(): void {
    this.explodeEmitter = this.emitterManager.createEmitter({
      x: this.source.x,
      y: this.source.y,
      lifespan: 500,
      speed: 200,
      angle: { start: 0, end: 360, steps: 32 },
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      on: false
    })
  }
}

export default BulletAnimation
