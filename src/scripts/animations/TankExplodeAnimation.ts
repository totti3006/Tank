class TankExplodeAnimation {
  private scene: Phaser.Scene
  private target: Phaser.GameObjects.Image

  private fireEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager
  private smokeEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager

  private fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter
  private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(target: Phaser.GameObjects.Image) {
    this.target = target
    this.scene = target.scene

    this.init()

    this.createFireEmiiter()
    this.createSmokeEmitter()
  }

  public playFireEmit(): void {
    this.fireEmitter.explode(30, this.target.x, this.target.y)
  }

  public playSmokeEmit(): void {
    this.smokeEmitter.explode(20, this.target.x, this.target.y)
  }

  private init(): void {
    this.fireEmitterManager = this.scene.add.particles('explode')
    this.smokeEmitterManager = this.scene.add.particles('cloud')
  }

  private createFireEmiiter(): void {
    this.fireEmitter = this.fireEmitterManager.createEmitter({
      x: this.target.x,
      y: this.target.y,
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
      x: this.target.x,
      y: this.target.y,
      speed: { min: -800, max: 100 },
      angle: { min: 0, max: 360 },
      alpha: { start: 1, end: 0 },
      blendMode: 'SCREEN',
      lifespan: 500,
      on: false
    })
  }
}

export default TankExplodeAnimation
