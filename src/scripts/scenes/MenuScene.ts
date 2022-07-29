import AnimatedButton from '../animations/AnimatedButton'

export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = []
  private playButton: AnimatedButton

  constructor() {
    super({
      key: 'MenuScene'
    })
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.startKey.isDown = false

    this.initGlobalData()
  }

  create(): void {
    this.displayText()
    this.createPlayButton()
  }

  private displayText(): void {
    // this.bitmapTexts.push(
    //   this.add.bitmapText(this.sys.canvas.width / 2 - 120, this.sys.canvas.height / 2, 'font', 'PRESS S TO PLAY', 30)
    // )

    this.bitmapTexts.push(
      this.add.bitmapText(this.sys.canvas.width / 2 - 140, this.sys.canvas.height / 2 - 100, 'font', 'TANK', 100)
    )
  }

  private createPlayButton(): void {
    this.playButton = new AnimatedButton(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 100,
      'play_button'
    )
    this.playButton
      .setScale(4)
      .setScaleAnimationRatio(4.2)
      .init(this.handleClickPlayButton)
      .setInteractive()
      .playScale()
      .on('pointerup', pointer => {
        this.playButton.playPointerUp().stopScale()
      })
      .on('pointermove', pointer => {
        this.playButton.playPointerMove()
      })
  }

  private initGlobalData(): void {
    this.registry.set('score', 0)
  }

  private handleClickPlayButton = (): void => {
    this.scene.start('GameScene')
    this.scene.start('HUDScene')
    this.scene.bringToTop('HUDScene')
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('GameScene')
      this.scene.start('HUDScene')
      this.scene.bringToTop('HUDScene')
    }
  }
}
