import BulletAnimation from '../../animations/BulletAnimation'
import IBullet from '../../interfaces/IBullet'
import BasePlane from './BasePlane'

abstract class BasePlaneBullet extends Phaser.GameObjects.Image implements IBullet {
  body: Phaser.Physics.Arcade.Body

  plane: BasePlane
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

export default BasePlaneBullet
