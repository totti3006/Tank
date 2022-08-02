import TankExplodeAnimation from '../../animations/TankExplodeAnimation'
import { IImageConstructor } from '../../interfaces/IImageConstructor'
import BaseTank from './BaseTank'
import BaseBarrel from './tankComponents/BaseBarrel'
import LifeBar from './tankComponents/LifeBar'
import RedBarrel from './tankComponents/RedBarrel'
import RedBullet from './tankComponents/RedBullet'

class RedTank extends BaseTank {
  private score: number
  private maxBullets: number
  private moveTween: Phaser.Tweens.Tween

  constructor(params: IImageConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)

    this.init()
    this.initMove()
    this.addPauseEvent()
    this.addResumeEvent()
    this.createBulletsPool()
  }

  private init(): void {
    this.color = 'Red'
    this.baseHealth = 1000
    this.remainingHealth = this.baseHealth
    this.shootingRate = 400
    this.lastShoot = 0
    this.speed = 200
    this.rotateSpeed = 0.02
    this.barrel = new RedBarrel(this)
    this.lifeBar = new LifeBar(this)
    this.lifeBar.drawLifebar()
    this.bullets = this.scene.add.group({
      classType: RedBullet,
      active: true,
      maxSize: 10,
      runChildUpdate: true
    })
    this.fireSound = this.scene.sound.add('barrel_shoot')
    this.explodeAnimation = new TankExplodeAnimation(this)
    this.states = {
      alive: 'alive',
      pause: 'pause',
      dying: 'dying',
      die: 'die'
    }
    this.state = this.states.alive
    this.score = 1000
    this.maxBullets = 5
    this.setDepth(0)
    this.scene.add.existing(this)
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

  public handleShooting(): void {
    this.barrel.handleShoot()
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

  private createBulletsPool(): void {
    for (let i = 0; i < this.maxBullets; i++) {
      let bullet = new RedBullet(this)
      bullet.setIdle()
      this.bullets.add(bullet)
    }
  }

  private addPauseEvent(): void {
    const hudScene = this.scene.scene.get('HUDScene')
    hudScene.events.on('pauseGame', this.handlePause, this)
  }

  private addResumeEvent(): void {
    const hudScene = this.scene.scene.get('HUDScene')
    hudScene.events.on('resumeGame', this.handleResume)
  }

  private processDying(): void {
    // console.log('dying state')

    this.playDyingAnimation()
    this.setDie()
  }

  private processAlive(): void {
    // console.log('alive state')
    this.barrel.update()
    this.lifeBar.update()
    this.handleShooting()
  }

  private processPause(): void {
    // console.log('pause state')
  }

  private handlePause = (): void => {
    // console.log(this.bullets)
    this.bullets.getChildren().forEach(bullet => {
      if (!(bullet instanceof RedBullet)) return

      if (bullet.state === 'flying') {
        bullet.pause()
      }
    })

    if (this.state === this.states.alive) {
      this.barrel.pause()
      this.moveTween.pause()
      this.state = this.states.pause
    }
  }

  private handleResume = (): void => {
    this.bullets.getChildren().forEach(bullet => {
      if (!(bullet instanceof RedBullet)) return

      if (bullet.state === 'pause') {
        bullet.resume()
      }
    })

    if (this.state === this.states.pause) {
      this.barrel.resume()
      this.moveTween.resume()
      this.state = this.states.alive
    }
  }

  private playDyingAnimation(): void {
    this.explodeAnimation.playFireEmit()
    this.explodeAnimation.playSmokeEmit()
  }

  private setDie(): void {
    this.scene.events.emit('enemyDie', this.score)
    this.state = this.states.die
    this.setVisible(false)
    this.scene.physics.world.disable(this)
    this.setActive(false)
    this.barrel.setVisible(false)
    this.barrel.setActive(false)
    this.lifeBar.setVisible(false)
    this.lifeBar.setActive(false)
  }

  private initMove(): void {
    this.moveTween = this.scene.tweens.add({
      targets: this,
      props: { y: this.y - 200 },
      delay: 0,
      duration: 2000,
      ease: 'Linear',
      easeParams: null,
      hold: 0,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true
    })
  }
}

export default RedTank
