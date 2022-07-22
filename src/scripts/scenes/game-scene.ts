import { Player } from '../objects/player'
import { Enemy } from '../objects/enemy'
import { Obstacle } from '../objects/obstacles/obstacle'
import { Bullet } from '../objects/bullet'
import ObjectsManager from '../objects/ObjectsManager'

type GameObj = Phaser.Types.Physics.Arcade.GameObjectWithBody

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap
  private tileset: Phaser.Tilemaps.Tileset

  private objectsManager: ObjectsManager

  private target: Phaser.Math.Vector2

  private hitSound: Phaser.Sound.BaseSound

  private winGame: boolean

  constructor() {
    super({
      key: 'GameScene'
    })
  }

  init(): void {
    this.objectsManager = ObjectsManager.getInstance()
    this.objectsManager.init(this)
  }

  create(): void {
    this.winGame = false

    // create tilemap from tiled JSON
    this.map = this.make.tilemap({ key: 'levelMap' })

    this.tileset = this.map.addTilesetImage('tiles')

    this.objectsManager.createLayer(this.map, this.tileset)

    this.convertObjects()

    // collider layer and obstacles
    this.physics.add.collider(this.objectsManager.getPlayer(), this.objectsManager.getLayer())
    this.physics.add.collider(this.objectsManager.getPlayer(), this.objectsManager.getObstacles())

    // collider for bullets
    this.physics.add.collider(
      this.objectsManager.getPlayer().getBullets(),
      this.objectsManager.getLayer(),
      this.bulletHitLayer
    )

    this.physics.add.collider(
      this.objectsManager.getPlayer().getBullets(),
      this.objectsManager.getObstacles(),
      this.bulletHitObstacles
    )

    this.objectsManager.getEnemies().children.each((enemy: Phaser.GameObjects.GameObject) => {
      if (!(enemy instanceof Enemy)) return

      this.physics.add.overlap(this.objectsManager.getPlayer().getBullets(), enemy, this.playerBulletHitEnemy)
      this.physics.add.overlap(enemy.getBullets(), this.objectsManager.getPlayer(), this.enemyBulletHitPlayer)

      this.physics.add.collider(enemy.getBullets(), this.objectsManager.getObstacles(), this.bulletHitObstacles)
      this.physics.add.collider(enemy.getBullets(), this.objectsManager.getLayer(), this.bulletHitLayer)
    }, this)

    // sound
    this.hitSound = this.sound.add('explosion')

    // camera
    this.cameras.main.startFollow(this.objectsManager.getPlayer())
  }

  update(): void {
    this.objectsManager.getPlayer().update()

    if (this.objectsManager.getEnemies().getChildren().length == 0 && !this.winGame) {
      this.events.emit('gameOver')
      this.winGame = true
    }

    this.objectsManager.getEnemies().children.each((enemy: Phaser.GameObjects.GameObject) => {
      if (!(enemy instanceof Enemy)) return

      enemy.update()
      if (this.objectsManager.getPlayer().active && enemy.active) {
        var angle = Phaser.Math.Angle.Between(
          enemy.body.x,
          enemy.body.y,
          this.objectsManager.getPlayer().body.x,
          this.objectsManager.getPlayer().body.y
        )

        enemy.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
      }
    }, this)
  }

  private convertObjects(): void {
    // find the object layer in the tilemap named 'objects'
    const objects = this.map.getObjectLayer('objects').objects as any[]

    objects.forEach(object => {
      if (object.type === 'player') {
        this.objectsManager.createPlayer(object.x, object.y)
      } else if (object.type === 'enemy') {
        this.objectsManager.createEnemy(object.x, object.y)
      } else {
        this.objectsManager.createObstacles(object.x, object.y, object.type)
      }
    })
  }

  private bulletHitLayer = (bullet: GameObj): void => {
    if (!(bullet instanceof Bullet)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.explode()
  }

  private bulletHitObstacles = (bullet: GameObj, obstacle: GameObj): void => {
    if (!(bullet instanceof Bullet && obstacle instanceof Obstacle)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.explode()
  }

  private enemyBulletHitPlayer = (bullet: GameObj, player: GameObj): void => {
    if (!(bullet instanceof Bullet && player instanceof Player)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.explode()
    player.updateHealth()
  }

  private playerBulletHitEnemy = (bullet: GameObj, enemy: GameObj): void => {
    if (!(bullet instanceof Bullet && enemy instanceof Enemy)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.explode()
    enemy.updateHealth()
  }
}
