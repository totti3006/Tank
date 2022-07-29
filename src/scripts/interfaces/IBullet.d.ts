import BulletAnimation from '../animations/BulletAnimation'
import BaseTank from '../objects/tanks/BaseTank'

interface IBullet {
  tank: BaseTank
  speed: number
  damage: number
  color: string
  animation: BulletAnimation
  states: any
  explode(): void
  fly(x: number, y: number): void
  stop(): void
}

export default IBullet
