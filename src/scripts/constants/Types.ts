import AlignGrid from '../utils/AlignGrid'

export type GameObj = Phaser.Types.Physics.Arcade.GameObjectWithBody

export type Point = {
  x: number
  y: number
}

export type AlignGridConfig = {
  scene: Phaser.Scene
  width?: number
  height?: number
  rows?: number
  columns?: number
  startX?: number
  startY?: number
}

export type CellGridPosition = {
  x: number
  y: number
  startX: number
  startY: number
}

export type BaseUiConfig = {
  scene: Phaser.Scene
  x: number
  y: number
  grid: AlignGrid
  index: number
}
