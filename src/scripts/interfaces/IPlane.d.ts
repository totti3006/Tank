import LifeBar from '../objects/tanks/tankComponents/LifeBar'

interface IPlane {
  color: string
  shootingRate: number
  lastShoot: number
  speed: number
  bullets: Phaser.GameObjects.Group
  fireSound: Phaser.Sound.BaseSound
  states: any

  handleShooting(): void
  gotHitByBullet(damage: number): void
}

export default IPlane
