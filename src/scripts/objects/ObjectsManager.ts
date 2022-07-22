import { GameScene } from '../scenes/game-scene'
import { Enemy } from './enemy'
import { Obstacle } from './obstacles/obstacle'
import { Player } from './player'

class ObjectsManager {
  private static instance: ObjectsManager

  private scene: GameScene

  // game objects
  private player: Player
  private enemies: Phaser.GameObjects.Group
  private obstacles: Phaser.GameObjects.Group
  private layer: Phaser.Tilemaps.TilemapLayer

  constructor() {}

  public static getInstance(): ObjectsManager {
    if (!ObjectsManager.instance) {
      ObjectsManager.instance = new ObjectsManager()
    }
    return ObjectsManager.instance
  }

  public init(scene: GameScene): ObjectsManager {
    this.scene = scene

    this.enemies = this.scene.add.group({
      runChildUpdate: true
    })

    this.obstacles = this.scene.add.group({
      runChildUpdate: true
    })

    return ObjectsManager.instance
  }

  public createLayer(map: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset): Phaser.Tilemaps.TilemapLayer {
    this.layer = map.createLayer('tileLayer', tileset, 0, 0)
    this.layer.setCollisionByProperty({ collide: true })

    return this.layer
  }

  public createPlayer(x: number, y: number): Player {
    let player: Player = new Player({
      scene: this.scene,
      x: x,
      y: y,
      texture: 'tankBlue'
    })

    this.player = player

    return player
  }

  public createEnemy(x: number, y: number): Enemy {
    let enemy: Enemy = new Enemy({
      scene: this.scene,
      x: x,
      y: y,
      texture: 'tankRed'
    })

    this.enemies.add(enemy)

    return enemy
  }

  public createObstacles(x: number, y: number, type: string): Obstacle {
    let obstacle = new Obstacle({
      scene: this.scene,
      x: x,
      y: y - 40,
      texture: type
    })

    this.obstacles.add(obstacle)

    return obstacle
  }

  public getPlayer(): Player {
    return this.player
  }

  public getObstacles(): Phaser.GameObjects.Group {
    return this.obstacles
  }

  public getEnemies(): Phaser.GameObjects.Group {
    return this.enemies
  }

  public getLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.layer
  }
}

export default ObjectsManager
