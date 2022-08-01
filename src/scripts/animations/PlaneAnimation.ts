class PlaneAnimation {
  private scene: Phaser.Scene
  private source: Phaser.GameObjects.Image

  private fireEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager
  private smokeEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager
  private flyingEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager

  private fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter
  private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter
  private flyingEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(source: Phaser.GameObjects.Image) {
    this.source = source
    this.scene = source.scene

    this.init()

    this.createFireEmiiter()
    this.createSmokeEmitter()
    this.createFlyingEmitter()
  }

  public playFlyingEmit(): void {
    this.flyingEmitter.start()
  }

  public playFireEmit(): void {
    this.fireEmitter.explode(30, this.source.x, this.source.y)
  }

  public playSmokeEmit(): void {
    this.smokeEmitter.explode(20, this.source.x, this.source.y)
  }

  public stopFlyingEmit(): void {
    this.flyingEmitter.stop()
  }

  private init(): void {
    this.fireEmitterManager = this.scene.add.particles('explode')
    this.smokeEmitterManager = this.scene.add.particles('cloud')
    this.flyingEmitterManager = this.scene.add.particles('star')
  }

  private createFlyingEmitter(): void {
    this.flyingEmitter = this.flyingEmitterManager.createEmitter({
      lifespan: 200,
      speed: 100,
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      follow: this.source,
      on: false
    })
  }

  private createFireEmiiter(): void {
    this.fireEmitter = this.fireEmitterManager.createEmitter({
      x: this.source.x,
      y: this.source.y,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      blendMode: 'SCREEN',
      lifespan: 500,
      on: false
    })
  }

  private createSmokeEmitter(): void {
    this.smokeEmitter = this.smokeEmitterManager.createEmitter({
      x: this.source.x,
      y: this.source.y,
      speed: { min: -800, max: 100 },
      angle: { min: 0, max: 360 },
      alpha: { start: 1, end: 0 },
      blendMode: 'SCREEN',
      lifespan: 500,
      on: false
    })
  }
}

export default PlaneAnimation
