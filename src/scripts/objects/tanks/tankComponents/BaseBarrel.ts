import IBarrel from '../../../interfaces/IBarrel'
import BaseTank from '../BaseTank'

abstract class BaseBarrel extends Phaser.GameObjects.Image implements IBarrel {
  tank: BaseTank
  echoShootingTime: number

  handleShoot(): void {}
  abstract rotateToTarget(target?: any): void
  pause(): void {}
  resume(): void {}
}

export default BaseBarrel
