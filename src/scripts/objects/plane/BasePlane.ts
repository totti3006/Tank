import PlaneAnimation from '../../animations/PlaneAnimation'
import IPlane from '../../interfaces/IPlane'
import MortalObject from '../MortalObject'
import LifeBar from '../tanks/tankComponents/LifeBar'

abstract class BasePlane extends MortalObject implements IPlane {
  color: string
  shootingRate: number
  lastShoot: number
  speed: number
  rotateSpeed: number
  lifeBar: LifeBar
  bullets: Phaser.GameObjects.Group
  fireSound: Phaser.Sound.BaseSound
  states: any
  animation: PlaneAnimation

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets
  }

  public getColor(): string {
    return this.color
  }

  handleShooting(): void {}
  gotHitByBullet(damage: number): void {}
  die(): void {}
}

export default BasePlane
