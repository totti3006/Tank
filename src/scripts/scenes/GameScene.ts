import Player from '../objects/tanks/Player'
import RedTank from '../objects/tanks/RedTank'
import { Obstacle } from '../objects/obstacles/Obstacle'
import { GameObj } from '../constants/Types'
import BaseBullet from '../objects/tanks/tankComponents/BaseBullet'

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap
  private tileset: Phaser.Tilemaps.Tileset

  // game objects
  private player: Player
  private enemies: Phaser.GameObjects.Group
  private obstacles: Phaser.GameObjects.Group
  private layer: Phaser.Tilemaps.TilemapLayer

  private hitSound: Phaser.Sound.BaseSound

  private winGame: boolean
  private numOfEnemyKilled: number

  constructor() {
    super({
      key: 'GameScene'
    })
  }

  init(): void {
    this.numOfEnemyKilled = 0
  }

  create(): void {
    this.winGame = false

    // create tilemap from tiled JSON
    this.map = this.make.tilemap({ key: 'levelMap' })

    this.tileset = this.map.addTilesetImage('tiles')

    this.createLayer()

    this.initObjectsGroup()

    this.loadObjectsFromTilemap()

    this.createCollide()

    this.addEventListener()

    // sound
    this.hitSound = this.sound.add('explosion')

    // camera
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

    // input
  }

  update(): void {
    this.player.update()

    if (this.checkGameOver() && !this.winGame) {
      this.events.emit('gameOver')
      this.winGame = true
    }

    this.enemies.children.each((enemy: Phaser.GameObjects.GameObject) => {
      if (!(enemy instanceof RedTank)) return

      enemy.update()
      if (this.player.active && enemy.active && this.player.state !== 'pause') {
        enemy.getBarrel().rotateToTarget(this.player)
      }
    }, this)
  }

  private initObjectsGroup(): void {
    this.enemies = this.add.group({
      runChildUpdate: true
    })

    this.obstacles = this.add.group({
      runChildUpdate: true
    })
  }

  private createLayer(): void {
    this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0)
    this.layer.setCollisionByProperty({ collide: true })
  }

  private createPlayer(x: number, y: number): void {
    this.player = new Player({
      scene: this,
      x: x,
      y: y,
      texture: 'tankBlue'
    })
  }

  private createEnemy(x: number, y: number): void {
    let enemy: RedTank = new RedTank({
      scene: this,
      x: x,
      y: y,
      texture: 'tankRed'
    })

    this.enemies.add(enemy)
  }

  private createObstacles(x: number, y: number, type: string): void {
    let obstacle = new Obstacle({
      scene: this,
      x: x,
      y: y - 40,
      texture: type
    })

    this.obstacles.add(obstacle)
  }

  private loadObjectsFromTilemap(): void {
    // find the object layer in the tilemap named 'objects'
    const objects = this.map.getObjectLayer('objects').objects as any[]

    objects.forEach(object => {
      if (object.type === 'player') {
        this.createPlayer(object.x, object.y)
      } else if (object.type === 'enemy') {
        this.createEnemy(object.x, object.y)
      } else {
        this.createObstacles(object.x, object.y, object.type)
      }
    })
  }

  private createCollide(): void {
    // collider layer and obstacles
    this.physics.add.collider(this.player, this.layer)
    this.physics.add.collider(this.player, this.obstacles)

    // collider for bullets
    this.physics.add.collider(this.player.getBullets(), this.layer, this.bulletHitLayer)

    this.physics.add.collider(this.player.getBullets(), this.obstacles, this.bulletHitObstacles)

    this.enemies.children.each((enemy: Phaser.GameObjects.GameObject) => {
      if (!(enemy instanceof RedTank)) return

      this.physics.add.overlap(this.player.getBullets(), enemy, this.playerBulletHitEnemy)
      this.physics.add.overlap(enemy.getBullets(), this.player, this.enemyBulletHitPlayer)

      this.physics.add.collider(enemy.getBullets(), this.obstacles, this.bulletHitObstacles)
      this.physics.add.collider(enemy.getBullets(), this.layer, this.bulletHitLayer)
    }, this)
  }

  private addEventListener(): void {
    this.events.on('enemyDie', this.handleEnemyKilled)
  }

  private bulletHitLayer = (bullet: GameObj): void => {
    if (!(bullet instanceof BaseBullet)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.stop()
  }

  private bulletHitObstacles = (bullet: GameObj, obstacle: GameObj): void => {
    if (!(bullet instanceof BaseBullet && obstacle instanceof Obstacle)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.stop()
  }

  private enemyBulletHitPlayer = (bullet: GameObj, player: GameObj): void => {
    if (!(bullet instanceof BaseBullet && player instanceof Player)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.stop()
    player.gotHitByBullet(bullet.getDamage())
  }

  private playerBulletHitEnemy = (bullet: GameObj, enemy: GameObj): void => {
    if (!(bullet instanceof BaseBullet && enemy instanceof RedTank)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.stop()
    enemy.gotHitByBullet(bullet.getDamage())
  }

  private checkGameOver(): boolean {
    if (this.numOfEnemyKilled == this.enemies.getChildren().length) return true
    return false
  }

  private handleEnemyKilled = (): void => {
    this.numOfEnemyKilled += 1
  }
}
