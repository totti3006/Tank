interface IBullet {
  speed: number
  damage: number
  color: string
  states: any
  explode(): void
  fly(x: number, y: number): void
  stop(): void
}

export default IBullet
