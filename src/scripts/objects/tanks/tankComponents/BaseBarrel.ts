import IBarrel from '../../../interfaces/IBarrel'
import BaseTank from '../BaseTank'

abstract class BaseBarrel extends Phaser.GameObjects.Image implements IBarrel {
  tank: BaseTank
  echoShootingTime: number
  pauseTime: number

  rotateToTarget(target?: any): void {}
  handleShoot(): void {}
  playShootingSound(): void {}
  pause(): void {}
  resume(): void {}
}

export default BaseBarrel
