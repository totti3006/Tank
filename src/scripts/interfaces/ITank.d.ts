import TankExplodeAnimation from '../animations/TankExplodeAnimation'
import Barrel from '../objects/tanks/tankComponents/Barrel'
import BaseBarrel from '../objects/tanks/tankComponents/BaseBarrel'
import LifeBar from '../objects/tanks/tankComponents/LifeBar'

interface ITank {
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

  handleShooting(): void
  gotHitByBullet(damage: number): void
  die(): void
}

export default ITank
