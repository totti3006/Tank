import TankExplodeAnimation from '../../animations/TankExplodeAnimation'
import ITank from '../../interfaces/ITank'
import MortalObject from '../MortalObject'
import BaseBarrel from './tankComponents/BaseBarrel'
import LifeBar from './tankComponents/LifeBar'

abstract class BaseTank extends MortalObject implements ITank {
  color: string
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

  public getBarrel(): BaseBarrel {
    return this.barrel
  }

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets
  }

  public getColor(): string {
    return this.color
  }
}

export default BaseTank
