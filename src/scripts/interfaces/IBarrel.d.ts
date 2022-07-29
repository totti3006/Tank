import BaseTank from '../objects/tanks/BaseTank'

interface IBarrel {
  tank: BaseTank
  echoShootingTime: number

  handleShoot(): void
}

export default IBarrel
