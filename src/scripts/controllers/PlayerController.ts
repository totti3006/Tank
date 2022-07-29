class PlayerController {
  private scene: Phaser.Scene

  // pc
  private pointer: Phaser.Input.Pointer
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys

  // mobile
  private joyStickLeft: any
  private joyStickRight: any

  private isPC: boolean

  constructor(scene: Phaser.Scene) {
    this.scene = scene

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
      x: this.scene.cameras.main.width * 0.5 - 500,
      y: this.scene.cameras.main.height * 0.5 + 400,
      radius: 100
    })

    // @ts-ignore
    this.joyStickRight = this.scene.plugins.get('virtualJoystick').add(this.scene, {
      x: this.scene.cameras.main.width * 0.5 + 500,
      y: this.scene.cameras.main.height * 0.5 + 400,
      radius: 100
    })

    this.scene.input.addPointer(2)
  }
}

export default PlayerController
