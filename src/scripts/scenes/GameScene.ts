import Player from '../objects/tanks/Player'
import RedTank from '../objects/tanks/RedTank'
import { Obstacle } from '../objects/obstacles/Obstacle'
import { GameObj } from '../constants/Types'
import BaseBullet from '../objects/tanks/tankComponents/BaseBullet'
import RedPlane from '../objects/plane/RedPlane'
import MortalObject from '../objects/MortalObject'
import BasePlaneBullet from '../objects/plane/BasePlaneBullet'

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap
  private tileset: Phaser.Tilemaps.Tileset

  // game objects
  private player: Player
  private redTanks: Phaser.GameObjects.Group
  private redPlanes: Phaser.GameObjects.Group
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

    this.createPlanes()

    this.createCollide()

    this.addEventListener()

    this.addTimeEvent()

    this.addCustomCursor()

    // sound
    this.hitSound = this.sound.add('explosion')

    // camera
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

    // save map info
    this.registry.set('mapSize', { width: this.map.widthInPixels, height: this.map.heightInPixels })
  }

  update(): void {
    this.player.update()

    if (this.checkGameOver() && !this.winGame) {
      this.events.emit('gameOver')
      this.winGame = true
    }

    this.redTanks.children.each((tank: Phaser.GameObjects.GameObject) => {
      if (!(tank instanceof RedTank)) return

      tank.update()
      if (this.player.active && tank.active && this.player.state !== 'pause') {
        tank.getBarrel().rotateToTarget(this.player)
      }
    }, this)
  }

  private initObjectsGroup(): void {
    this.redTanks = this.add.group({
      runChildUpdate: true
    })

    this.redPlanes = this.add.group({
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

  private createRedTank(x: number, y: number): void {
    let tank: RedTank = new RedTank({
      scene: this,
      x: x,
      y: y,
      texture: 'tankRed'
    })

    this.redTanks.add(tank)
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
        this.createRedTank(object.x, object.y)
      } else {
        this.createObstacles(object.x, object.y, object.type)
      }
    })
  }

  private createPlanes(): void {
    for (let i = 0; i < 5; i++) {
      this.createPlane()
    }
  }

  private createPlane(): void {
    let plane = new RedPlane({
      scene: this,
      x: -50,
      y: -50,
      texture: 'plane-red'
    })

    this.redPlanes.add(plane)
    plane.setTarget(this.player)
    plane.setIdle()
  }

  private createCollide(): void {
    // collider layer and obstacles
    this.physics.add.collider(this.player, this.layer)
    this.physics.add.collider(this.player, this.obstacles)

    // collider for bullets
    this.physics.add.collider(this.player.getBullets(), this.layer, this.bulletHitLayer)

    this.physics.add.collider(this.player.getBullets(), this.obstacles, this.bulletHitObstacles)

    this.redTanks.children.each((tank: Phaser.GameObjects.GameObject) => {
      if (!(tank instanceof RedTank)) return

      this.physics.add.overlap(this.player.getBullets(), tank, this.playerBulletHitEnemy)
      this.physics.add.overlap(tank.getBullets(), this.player, this.enemyBulletHitPlayer)

      this.physics.add.collider(tank.getBullets(), this.obstacles, this.bulletHitObstacles)
      this.physics.add.collider(tank.getBullets(), this.layer, this.bulletHitLayer)
    }, this)

    this.redPlanes.children.each(plane => {
      if (!(plane instanceof RedPlane)) return

      this.physics.add.overlap(this.player.getBullets(), plane, this.playerBulletHitEnemy)
      this.physics.add.overlap(plane.getBullets(), this.player, this.planeMissileHitPlayer)
    })
  }

  private addEventListener(): void {
    this.events.on('enemyDie', this.handleEnemyKilled)
  }

  private addTimeEvent(): void {
    this.time.addEvent({ delay: 3000, callback: this.generateRedPlane, repeat: -1 })
  }

  private addCustomCursor(): void {
    this.input.setDefaultCursor('url(assets/cursors/Aim.cur), pointer')
  }

  private generateRedPlane = (): void => {
    for (let plane of this.redPlanes.getChildren()) {
      if (!(plane instanceof RedPlane)) return

      if (plane.state === 'idle') {
        plane.startFlying()
        return
      }
    }
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

  private planeMissileHitPlayer = (bullet: GameObj, player: GameObj): void => {
    if (!(bullet instanceof BasePlaneBullet && player instanceof Player)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.stop()
    player.gotHitByBullet(bullet.getDamage())
  }

  private playerBulletHitEnemy = (bullet: GameObj, enemy: GameObj): void => {
    if (!(bullet instanceof BaseBullet && enemy instanceof MortalObject)) return

    if (!this.sound.mute) {
      this.hitSound.play()
    }
    bullet.stop()
    enemy.gotHitByBullet(bullet.getDamage())
  }

  private checkGameOver(): boolean {
    if (this.numOfEnemyKilled == 15) return true
    return false
  }

  private handleEnemyKilled = (): void => {
    this.numOfEnemyKilled += 1
  }
}
