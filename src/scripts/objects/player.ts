import { Bullet } from './bullet'
import { IImageConstructor } from '../interfaces/image.interface'

export class Player extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body

  // variables
  private health: number
  private lastShoot: number
  private speed: number
  public allowFire: boolean

  // children
  private barrel: Phaser.GameObjects.Image
  private lifeBar: Phaser.GameObjects.Graphics

  // game objects
  private bullets: Phaser.GameObjects.Group

  // sound
  private fireSound: Phaser.Sound.BaseSound

  // input
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys

  // emitter
  private fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter
  private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets
  }

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.initImage()
    this.scene.add.existing(this)

    this.allowFire = true
    this.fireSound = this.scene.sound.add('gun_shooting')

    this.fireEmitter = this.scene.add.particles('explode').createEmitter({
      x: this.x,
      y: this.y,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      blendMode: 'SCREEN',
      lifespan: 500,
      on: false
    })

    this.smokeEmitter = this.scene.add.particles('cloud').createEmitter({
      x: this.x,
      y: this.y,
      speed: { min: -800, max: 100 },
      angle: { min: 0, max: 360 },
      alpha: { start: 1, end: 0 },
      blendMode: 'SCREEN',
      lifespan: 500,
      on: false
    })
  }

  private initImage() {
    // variables
    this.health = 1
    this.lastShoot = 0
    this.speed = 200

    // image
    this.setOrigin(0.5, 0.5)
    this.setDepth(0)
    this.angle = 180

    this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue')
    this.barrel.setOrigin(0.5, 1)
    this.barrel.setDepth(1)
    this.barrel.angle = 180

    this.lifeBar = this.scene.add.graphics()
    this.redrawLifebar()

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true
    })

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys()

    // physics
    this.scene.physics.world.enable(this)
  }

  update(): void {
    if (this.active) {
      this.barrel.x = this.x
      this.barrel.y = this.y
      this.lifeBar.x = this.x
      this.lifeBar.y = this.y
      this.handleInput()
      this.handleShooting()
    } else {
      this.fireEmitter.explode(30, this.x, this.y)
      this.smokeEmitter.explode(20, this.x, this.y)
      this.destroy()
      this.barrel.destroy()
      this.lifeBar.destroy()
    }
  }

  private handleInput() {
    // move tank forward
    // small corrections with (- MATH.PI / 2) to align tank correctly
    if (this.cursors.up.isDown) {
      this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, this.speed, this.body.velocity)
    } else if (this.cursors.down.isDown) {
      this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, -this.speed, this.body.velocity)
    } else {
      this.body.setVelocity(0, 0)
    }

    // rotate tank
    if (this.cursors.left.isDown) {
      this.rotation -= 0.02
    } else if (this.cursors.right.isDown) {
      this.rotation += 0.02
    }
  }

  private handleShooting(): void {
    const pointer = this.scene.input.activePointer

    let pointerAngle: number = Phaser.Math.Angle.Between(
      this.barrel.x,
      this.barrel.y,
      pointer.x + this.scene.cameras.main.scrollX,
      pointer.y + this.scene.cameras.main.scrollY
    )

    this.barrel.angle = (pointerAngle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG

    if (pointer.leftButtonDown() && this.scene.time.now > this.lastShoot && this.allowFire) {
      if (!this.scene.sound.mute) {
        this.fireSound.play()
      }
      this.scene.cameras.main.shake(20, 0.005)
      this.scene.tweens.add({
        targets: this,
        props: { alpha: 0.8 },
        delay: 0,
        duration: 5,
        ease: 'Power1',
        easeParams: null,
        hold: 0,
        repeat: 0,
        repeatDelay: 0,
        yoyo: true,
        paused: false
      })

      if (this.bullets.getLength() < 10) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            rotation: this.barrel.rotation,
            x: this.barrel.x,
            y: this.barrel.y,
            texture: 'bulletBlue'
          })
        )

        this.lastShoot = this.scene.time.now + 100
      }
    } else if (this.scene.time.now - this.lastShoot > 100) {
      if (!this.scene.sound.mute) {
        this.fireSound.pause()
      }
    }
  }

  private redrawLifebar(): void {
    this.lifeBar.clear()
    this.lifeBar.fillStyle(0xe66a28, 1)
    this.lifeBar.fillRect(-this.width / 2, this.height / 2, this.width * this.health, 15)
    this.lifeBar.lineStyle(2, 0xffffff)
    this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15)
    this.lifeBar.setDepth(1)
  }

  public updateHealth(): void {
    if (this.health > 0) {
      this.health -= 0.001
      this.redrawLifebar()
    } else {
      this.health = 0
      this.active = false
      this.scene.events.emit('gameOver')
    }
  }
}
