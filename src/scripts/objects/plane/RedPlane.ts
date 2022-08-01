import PlaneAnimation from '../../animations/PlaneAnimation'
import { IImageConstructor } from '../../interfaces/IImageConstructor'
import MortalObject from '../MortalObject'
import LifeBar from '../tanks/tankComponents/LifeBar'
import BasePlane from './BasePlane'
import PlaneBullet from './PlaneBullet'

class RedPlane extends BasePlane {
  private score: number
  private maxBullets: number
  private target: MortalObject
  private countFrames: number
  private rotateDirection: number
  private pauseVelocity: Phaser.Math.Vector2

  constructor(params: IImageConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)

    this.init()
    this.addPauseEvent()
    this.addResumeEvent()
    this.createBulletsPool()
  }

  private init(): void {
    this.color = 'Red'
    this.baseHealth = 200
    this.remainingHealth = this.baseHealth
    this.shootingRate = 10000
    this.lastShoot = 0
    this.speed = 400
    this.rotateSpeed = 0.01
    this.lifeBar = new LifeBar(this)
    this.lifeBar.drawLifebar()
    this.bullets = this.scene.add.group({
      classType: PlaneBullet,
      active: true,
      maxSize: 20,
      runChildUpdate: true
    })
    this.states = {
      idle: 'idle',
      flying: 'flying',
      pause: 'pause',
      dying: 'dying',
      die: 'die'
    }
    this.state = this.states.idle
    this.animation = new PlaneAnimation(this)
    this.score = 1000
    this.maxBullets = 1
    this.countFrames = 0
    this.rotateDirection = [1, -1][Phaser.Math.Between(0, 1)]
    this.pauseVelocity = new Phaser.Math.Vector2(0, 0)

    this.setDepth(5).setOrigin(0.5, 0.5)
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
  }

  update(): void {
    switch (this.state) {
      case this.states.idle:
        this.processIdle()
        break

      case this.states.flying:
        this.processFlying()
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

  public setIdle(): void {
    this.state = this.states.idle
    this.setVisible(false)
    this.lifeBar.setVisible(false)
    this.lifeBar.setActive(false)
    this.scene.physics.world.disable(this)
  }

  public startFlying(): void {
    const randomPosition = this.generateRandomSpawnPosition()
    const x: number = randomPosition.x
    const y: number = randomPosition.y

    this.state = this.states.flying
    this.setVisible(true)
    this.lifeBar.setVisible(true)
    this.lifeBar.setActive(true)
    this.scene.physics.world.enable(this)
    this.adjustPosition(x, y)
    this.rotateToTarget(this.target)
    this.scene.physics.velocityFromRotation(this.rotation, this.speed, this.body.velocity)
    this.rotation += Math.PI / 2
    this.animation.playFlyingEmit()
  }

  public handleShooting(): void {
    if (this.distanceToTarget() < 1200) {
      this.launchMissile()
    }
  }

  public gotHitByBullet(damage: number): void {
    this.remainingHealth -= damage

    if (this.remainingHealth <= 0) {
      this.remainingHealth = 0
      this.state = this.states.dying
      this.lifeBar.drawLifebar()
    } else {
      this.lifeBar.drawLifebar()
    }
  }

  public explode(): void {}

  public setTarget(target: MortalObject): void {
    this.target = target
  }

  public getTarget(): MortalObject {
    return this.target
  }

  private launchMissile(): void {
    if (this.scene.time.now > this.lastShoot + this.shootingRate) {
      for (let bullet of this.bullets.getChildren()) {
        if (!(bullet instanceof PlaneBullet)) return

        if (bullet.state === 'idle') {
          this.lastShoot = this.scene.time.now
          bullet.fly(this.x, this.y)
        }
      }
    }
  }

  private distanceToTarget(): number {
    return Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
  }

  private createBulletsPool(): void {
    for (let i = 0; i < this.maxBullets; i++) {
      let bullet = new PlaneBullet(this)
      bullet.setIdle()
      this.bullets.add(bullet)
    }
  }

  private adjustPosition(x: number, y: number): void {
    this.setPosition(x, y)
    this.body.position.x = x
    this.body.position.y = y
  }

  private processIdle(): void {}

  private processFlying(): void {
    this.lifeBar.update()
    this.handleShooting()
    this.checkLaunchMissile()
    this.checkFlyOutOfScreen()
  }

  private checkLaunchMissile(): void {
    if (this.scene.time.now > this.lastShoot + 300 && this.countFrames < 40 && this.lastShoot > 0) {
      this.countFrames += 1
      this.turnAway()
    }
  }

  private turnAway(): void {
    this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, this.speed, this.body.velocity)

    this.rotation += this.rotateSpeed * this.rotateDirection
  }

  private checkFlyOutOfScreen(): void {
    const mapWidth: number = this.scene.registry.get('mapSize').width
    const mapHeight: number = this.scene.registry.get('mapSize').height

    const leftBorder: number = -50
    const rightBorder: number = mapWidth + 50
    const topBorder: number = -50
    const bottomBorder: number = mapHeight + 50

    if (this.x < leftBorder || this.x > rightBorder || this.y < topBorder || this.y > bottomBorder) {
      this.recycle()
    }
  }

  private recycle(): void {
    this.body.setVelocity(0, 0)
    this.scene.physics.world.disable(this)
    this.setVisible(false)
    this.lifeBar.setVisible(false)
    this.lifeBar.setActive(false)
    this.remainingHealth = this.baseHealth
    this.lastShoot = 0
    this.countFrames = 0
    this.rotateDirection = [1, -1][Phaser.Math.Between(0, 1)]
    this.pauseVelocity = new Phaser.Math.Vector2(0, 0)
    this.lifeBar.drawLifebar()
    this.state = this.states.idle
  }

  private processPause(): void {}

  private processDying(): void {
    this.playDyingAnimation()
    this.setDie()
  }

  private setDie(): void {
    this.scene.events.emit('enemyDie', this.score)
    this.recycle()
  }

  private playDyingAnimation(): void {
    this.animation.playFireEmit()
    this.animation.playSmokeEmit()
    this.animation.stopFlyingEmit()
  }

  private addPauseEvent(): void {
    const hudScene = this.scene.scene.get('HUDScene')
    hudScene.events.on('pauseGame', this.handlePause, this)
  }

  private addResumeEvent(): void {
    const hudScene = this.scene.scene.get('HUDScene')
    hudScene.events.on('resumeGame', this.handleResume)
  }

  private handlePause = (): void => {
    this.pauseVelocity.x = this.body.velocity.x
    this.pauseVelocity.y = this.body.velocity.y
    this.body.setVelocity(0, 0)
    this.animation.stopFlyingEmit()

    this.bullets.getChildren().forEach(bullet => {
      if (!(bullet instanceof PlaneBullet)) return

      if (bullet.state === 'flying') {
        bullet.pause()
      }
    })

    this.state = this.states.pause
  }

  private handleResume = (): void => {
    this.body.setVelocity(this.pauseVelocity.x, this.pauseVelocity.y)
    this.animation.playFlyingEmit()

    this.bullets.getChildren().forEach(bullet => {
      if (!(bullet instanceof PlaneBullet)) return

      if (bullet.state === 'pause') {
        bullet.resume()
      }
    })

    this.state = this.states.flying
  }

  private rotateToTarget(target: MortalObject): void {
    let angle = Phaser.Math.Angle.Between(this.body.x, this.body.y, target.body.x, target.body.y)

    this.rotation = angle
    // this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
  }

  private generateRandomSpawnPosition(): { x: number; y: number } {
    const mapWidth: number = this.scene.registry.get('mapSize').width
    const mapHeight: number = this.scene.registry.get('mapSize').height

    let xBorder: number[] = [0, mapWidth]
    let yBorder: number[] = [0, mapHeight]

    let x: number = Phaser.Math.Between(0, mapWidth)
    let y: number

    if (!(x in xBorder)) {
      y = yBorder[Phaser.Math.Between(0, 1)]
    } else {
      y = Phaser.Math.Between(0, mapHeight)
    }

    return { x: x, y: y }
  }
}

export default RedPlane
