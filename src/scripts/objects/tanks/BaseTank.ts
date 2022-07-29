import TankExplodeAnimation from '../../animations/TankExplodeAnimation'
import ITank from '../../interfaces/ITank'
import BaseBarrel from './tankComponents/BaseBarrel'
import LifeBar from './tankComponents/LifeBar'

abstract class BaseTank extends Phaser.GameObjects.Image implements ITank {
  body: Phaser.Physics.Arcade.Body
  color: string
  baseHealth: number
  remainingHealth: number
  shootingRate: number
  lastShoot: number
  speed: number
  rotateSpeed: number
  barrel: BaseBarrel
  lifeBar: LifeBar
  bullets: Phaser.GameObjects.Group
  fireSound: Phaser.Sound.BaseSound
  explodeAnimation: TankExplodeAnimation
  states: any

  public handleShooting(): void {}
  public gotHitByBullet(damage: number): void {}
  public die(): void {}

  public setBaseHealth(value: number): void {
    this.baseHealth = value
  }

  public getBaseHealth(): number {
    return this.baseHealth
  }

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets
  }

  public getBarrel(): BaseBarrel {
    return this.barrel
  }

  public getColor(): string {
    return this.color
  }
}

export default BaseTank
