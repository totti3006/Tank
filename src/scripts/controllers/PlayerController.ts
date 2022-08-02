import Player from '../objects/tanks/Player'

class PlayerController {
  private scene: Phaser.Scene
  private player: Player

  // pc
  private pointer: Phaser.Input.Pointer
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys

  // mobile
  private joyStickLeft: any
  private joyStickRight: any

  private isPC: boolean

  constructor(player: Player) {
    this.player = player
    this.scene = player.scene

    this.checkDevice()
    this.init()
  }

  public isUsingPC(): boolean {
    return this.isPC
  }

  public getPointer(): Phaser.Input.Pointer {
    return this.pointer
  }

  public getCursors(): Phaser.Types.Input.Keyboard.CursorKeys {
    return this.cursors
  }

  public getJoyStickLeft(): any {
    return this.joyStickLeft
  }

  public getJoyStickRight(): any {
    return this.joyStickRight
  }

  public handleInput(): void {
    this.handleMove()
    this.hanldeShoot()
  }

  public handleMove(): void {
    if (this.isUsingPC()) {
      this.handleMoveOnPC()
    } else {
      this.handleMoveOnJoyStick()
    }
  }

  public hanldeShoot(): void {
    if (this.isUsingPC()) {
      this.handleShootOnPC()
    } else {
      this.handleShootOnJoyStick()
    }
  }

  private handleMoveOnPC(): void {
    if (this.cursors.up.isDown) {
      this.player.move(this.player.rotation - Math.PI * 0.5, this.player.speed)
    } else if (this.cursors.down.isDown) {
      this.player.move(this.player.rotation - Math.PI * 0.5, -this.player.speed)
    } else {
      this.player.stop()
    }

    if (this.cursors.left.isDown) {
      this.player.rotate(this.player.rotation - this.player.rotateSpeed)
    } else if (this.cursors.right.isDown) {
      this.player.rotate(this.player.rotation + this.player.rotateSpeed)
    }
  }

  private handleMoveOnJoyStick(): void {
    if (this.joyStickLeft.force != 0) {
      this.player.move(this.joyStickLeft.rotation, this.player.speed)
      this.player.rotate(this.joyStickLeft.rotation + Math.PI * 0.5)
    } else {
      this.player.stop()
    }
  }

  private handleShootOnPC(): void {
    let rotateAngle: number = this.angleOfPointerAndPlayer() + Math.PI * 0.5
    this.player.rotateBarrel(rotateAngle)

    if (this.player.isAllowShoot() && this.pointer.leftButtonDown()) {
      this.player.shoot()
    }
  }

  private handleShootOnJoyStick(): void {
    if (this.joyStickRight.force != 0 && this.player.isAllowShoot()) {
      this.player.rotateBarrel(this.joyStickRight.rotation + Math.PI * 0.5)
      this.player.shoot()
    }
  }

  private angleOfPointerAndPlayer(): number {
    return Phaser.Math.Angle.Between(
      this.player.getBarrel().x,
      this.player.getBarrel().y,
      this.pointer.x + this.scene.cameras.main.scrollX,
      this.pointer.y + this.scene.cameras.main.scrollY
    )
  }

  private checkDevice(): void {
    if (this.scene.game.device.os.desktop) this.isPC = true
    else if (this.scene.game.device.os.android || this.scene.game.device.os.iOS) this.isPC = false
  }

  private init(): void {
    if (this.isPC) {
      this.initPC()
    } else {
      this.initMobile()
    }
  }

  private initPC(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.pointer = this.scene.input.activePointer
  }

  private initMobile(): void {
    // @ts-ignore
    this.joyStickLeft = this.scene.plugins.get('virtualJoystick').add(this.scene, {
      x: 0 + 300,
      y: this.scene.cameras.main.height * 0.5 + 300,
      radius: 200
    })

    // @ts-ignore
    this.joyStickRight = this.scene.plugins.get('virtualJoystick').add(this.scene, {
      x: this.scene.cameras.main.width - 300,
      y: this.scene.cameras.main.height * 0.5 + 300,
      radius: 200
    })

    this.scene.input.addPointer(2)
  }
}

export default PlayerController
