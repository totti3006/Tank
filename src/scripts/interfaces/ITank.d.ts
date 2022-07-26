import TankExplodeAnimation from '../animations/TankExplodeAnimation'
import BaseBarrel from '../objects/tanks/tankComponents/BaseBarrel'
import LifeBar from '../objects/tanks/tankComponents/LifeBar'

interface ITank {
  color: string
  shootingRate: number
  lastShoot: number
  speed: number
  rotateSpeed: number
  barrel: BaseBarrel
  bullets: Phaser.GameObjects.Group
  fireSound: Phaser.Sound.BaseSound
  explodeAnimation: TankExplodeAnimation
  states: any

  handleShooting(): void
  gotHitByBullet(damage: number): void
}

export default ITank
