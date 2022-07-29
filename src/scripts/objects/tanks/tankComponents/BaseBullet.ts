import BulletAnimation from '../../../animations/BulletAnimation'
import IBullet from '../../../interfaces/IBullet'
import BaseTank from '../BaseTank'

abstract class BaseBullet extends Phaser.GameObjects.Image implements IBullet {
  body: Phaser.Physics.Arcade.Body

  tank: BaseTank
  speed: number
  damage: number
  color: string
  animation: BulletAnimation
  states: any

  explode(): void {}
  fly(x: number, y: number): void {}
  stop(): void {}
  pause(): void {}
  resume(): void {}

  public getDamage(): number {
    return this.damage
  }
}

export default BaseBullet
