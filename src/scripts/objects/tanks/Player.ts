import TankExplodeAnimation from '../../animations/TankExplodeAnimation'
import PlayerController from '../../controllers/PlayerController'
import { IImageConstructor } from '../../interfaces/IImageConstructor'
import BaseTank from './BaseTank'
import BlueBarrel from './tankComponents/BlueBarrel'
import BlueBullet from './tankComponents/BlueBullet'
import LifeBar from './tankComponents/LifeBar'

class Player extends BaseTank {
  // private pointer: Phaser.Input.Pointer
  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  // private joyStickLeft: any
  // private joyStickRight: any

  private controller: PlayerController
  private maxBullets: number
  private allowShoot: boolean

  constructor(params: IImageConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)

    this.init()
    this.addPauseEvent()
    this.addResumeEvent()
    this.addTouchingButtonEvent()
    this.createBulletsPool()
    this.createController()
    // this.createPCcontrol()
    // this.createJoyStick()
    this.scene.add.existing(this)
  }

  private init(): void {
    this.color = 'Blue'
    this.baseHealth = 1000
    this.remainingHealth = this.baseHealth
    this.shootingRate = 100
    this.lastShoot = 0
    this.speed = 200
    this.rotateSpeed = 0.02
    this.barrel = new BlueBarrel(this)
    this.lifeBar = new LifeBar(this)
    this.lifeBar.drawLifebar()
    this.bullets = this.scene.add.group({
      classType: BlueBullet,
      active: true,
      maxSize: 10,
      runChildUpdate: true
    })
    this.fireSound = this.scene.sound.add('gun_shooting')
    this.explodeAnimation = new TankExplodeAnimation(this)
    this.states = {
      alive: 'alive',
      pause: 'pause',
      dying: 'dying',
      die: 'die'
    }
    this.state = this.states.alive

    this.maxBullets = 10
    this.allowShoot = true
    this.setOrigin(0.5, 0.5).setDepth(0)
    // this.angle = 250
    this.scene.physics.world.enable(this)
  }

  update(): void {
    switch (this.state) {
      case this.states.alive:
        this.processAlive()
        break

      case this.states.pause:
        this.processPause()
        break

      case this.states.dying:
        this.processDying()
        break

      case this.states.die:
        this.die()
        break
    }
  }

  public getPointer(): Phaser.Input.Pointer {
    return this.controller.getPointer()
  }

  public handleShooting(): void {
    if (this.controller.isUsingPC()) {
      this.handleShootOnPC()
    } else {
      this.handleShootOnJoyStick()
    }
  }

  public gotHitByBullet(damage: number): void {
    this.remainingHealth -= damage

    if (this.remainingHealth < 0) {
      this.remainingHealth = 0
      this.state = this.states.dying
    } else {
      this.lifeBar.drawLifebar()
    }
  }

  public die(): void {
    // console.log('die state')
  }

  private handleInput(): void {
    if (this.controller.isUsingPC()) {
      this.handleMoveOnPC()
    } else {
      this.handleMoveOnJoyStick()
    }
  }

  private createBulletsPool(): void {
    for (let i = 0; i < this.maxBullets; i++) {
      let bullet = new BlueBullet(this)
      bullet.setIdle()
      this.bullets.add(bullet)
    }
  }

  private createController(): void {
    this.controller = new PlayerController(this.scene)
  }

  // private createPCcontrol(): void {
  //   this.cursors = this.scene.input.keyboard.createCursorKeys()
  //   this.pointer = this.scene.input.activePointer
  // }

  // private createJoyStick(): void {
  //   // @ts-ignore
  //   this.joyStickLeft = this.scene.plugins.get('virtualJoystick').add(this.scene, {
  //     x: this.scene.cameras.main.width * 0.5 - 500,
  //     y: this.scene.cameras.main.height * 0.5 + 450,
  //     radius: 100
  //   })

  //   // @ts-ignore
  //   this.joyStickRight = this.scene.plugins.get('virtualJoystick').add(this.scene, {
  //     x: this.scene.cameras.main.width * 0.5 + 500,
  //     y: this.scene.cameras.main.height * 0.5 + 450,
  //     radius: 100
  //   })
  // }

  private addPauseEvent(): void {
    const hudScene = this.scene.scene.get('HUDScene')
    hudScene.events.on('pauseGame', this.handlePause)
  }

  private addResumeEvent(): void {
    const hudScene = this.scene.scene.get('HUDScene')
    hudScene.events.on('resumeGame', this.handleResume)
  }

  private addTouchingButtonEvent(): void {
    const hudScene = this.scene.scene.get('HUDScene')
    hudScene.events.on('pointerInButton', this.disableShooting)
    hudScene.events.on('pointerOutButton', this.enableShooting)
  }

  private processAlive(): void {
    // console.log('alive state')

    this.barrel.update()
    this.lifeBar.update()
    this.handleInput()
    this.handleShooting()
  }

  private processPause(): void {
    // console.log('pause state')
  }

  private processDying(): void {
    // console.log('dying state')

    this.playDyingAnimation()
    this.setDie()
  }

  private handlePause = (): void => {
    this.bullets.getChildren().forEach(bullet => {
      if (!(bullet instanceof BlueBullet)) return

      if (bullet.state === 'flying') {
        bullet.pause()
      }
    })

    this.barrel.pause()
    this.state = this.states.pause
  }

  private handleResume = (): void => {
    this.bullets.getChildren().forEach(bullet => {
      if (!(bullet instanceof BlueBullet)) return

      if (bullet.state === 'pause') {
        bullet.resume()
      }
    })

    this.barrel.resume()
    this.state = this.states.alive
  }

  private disableShooting = (): void => {
    this.allowShoot = false
  }

  private enableShooting = (): void => {
    this.allowShoot = true
  }

  private playDyingAnimation(): void {
    this.explodeAnimation.playFireEmit()
    this.explodeAnimation.playSmokeEmit()
  }

  private setDie(): void {
    this.scene.events.emit('playerDie')
    this.state = this.states.die
    this.setVisible(false)
    this.scene.physics.world.disable(this)
    this.setActive(false)
    this.barrel.setVisible(false)
    this.barrel.setActive(false)
    this.lifeBar.setVisible(false)
    this.lifeBar.setActive(false)
  }

  private handleMoveOnPC(): void {
    this.handleMove()
    this.handleRotate()
  }

  private handleShootOnPC(): void {
    this.barrel.rotateToTarget()
    if (this.allowShoot && this.controller.getPointer().leftButtonDown()) {
      this.barrel.handleShoot()
    }
  }

  private handleMove(): void {
    if (this.controller.getCursors().up.isDown) {
      this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, this.speed, this.body.velocity)
    } else if (this.controller.getCursors().down.isDown) {
      this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, -this.speed, this.body.velocity)
    } else {
      this.body.setVelocity(0, 0)
    }
  }

  private handleRotate(): void {
    if (this.controller.getCursors().left.isDown) {
      this.rotation -= this.rotateSpeed
    } else if (this.controller.getCursors().right.isDown) {
      this.rotation += this.rotateSpeed
    }
  }

  private handleMoveOnJoyStick(): void {
    if (this.controller.getJoyStickLeft().force != 0) {
      this.scene.physics.velocityFromRotation(
        this.controller.getJoyStickLeft().rotation,
        this.speed,
        this.body.velocity
      )
      this.rotation = this.controller.getJoyStickLeft().rotation + Math.PI / 2
    } else {
      this.body.setVelocity(0, 0)
    }
  }

  private handleShootOnJoyStick(): void {
    if (this.controller.getJoyStickRight().force != 0) {
      this.barrel.rotation = this.controller.getJoyStickRight().rotation + Math.PI / 2
      if (this.allowShoot) {
        this.barrel.handleShoot()
      }
    }
  }
}

export default Player
