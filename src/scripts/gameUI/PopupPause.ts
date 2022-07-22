import ButtonAnimation from '../animations/ButtonAnimation'
import ObjectsManager from '../objects/ObjectsManager'
import HudScene from '../scenes/HudScene'

class PopupPause extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = []
  private closeButton: ButtonAnimation
  private restartButton: ButtonAnimation
  private volumeButton: ButtonAnimation

  private objectManager: ObjectsManager

  constructor(scene: HudScene) {
    super(scene)

    this.scene.add.existing(this)
    this.setPosition(this.scene.cameras.main.width * 0.5, this.scene.cameras.main.height).setScale(0.1)

    this.objectManager = ObjectsManager.getInstance()

    this.createBackground()
    this.createText()
    this.createCloseButton()
    this.createVolumeButton()
    this.createRestartButton()
  }

  private createBackground(): void {
    this.background = this.scene.add.image(0, 0, 'popup_pause')

    this.add(this.background)
  }

  private createText(): void {
    let text = this.scene.add.bitmapText(0, 0, 'font', 'Pause', 35)
    this.bitmapTexts.push(text)

    Phaser.Display.Align.In.TopCenter(text, this.background, 0, -20)

    text.setDepth(5)

    this.add(text)
  }

  private createCloseButton(): void {
    this.closeButton = new ButtonAnimation(this.scene, 0, 0, 'close_button')

    Phaser.Display.Align.In.TopRight(this.closeButton, this.background)

    this.closeButton
      .setScale(3)
      .initButton(this.handleClose)
      .setInteractive()
      .on('pointerup', pointer => {
        this.closeButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.closeButton.playPointerMove()
      })

    this.add(this.closeButton)
  }

  private createVolumeButton(): void {
    this.volumeButton = new ButtonAnimation(this.scene, 0, 0, 'volume_button')

    Phaser.Display.Align.In.Center(this.volumeButton, this.background, 50, 50)

    this.volumeButton
      .setScale(3)
      .initButton(this.handleVolume)
      .setInteractive()
      .on('pointerup', pointer => {
        this.volumeButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.volumeButton.playPointerMove()
      })

    let text = this.scene.add.bitmapText(0, 0, 'font', 'Volume', 30)
    this.bitmapTexts.push(text)

    Phaser.Display.Align.In.Center(text, this.background, -50, 50)

    this.add(text)
    this.add(this.volumeButton)
  }

  private createRestartButton(): void {
    this.restartButton = new ButtonAnimation(this.scene, 0, 0, 'restart_button')

    Phaser.Display.Align.In.Center(this.restartButton, this.background, 50, -50)

    this.restartButton
      .setScale(3)
      .initButton(this.handleRestart)
      .setInteractive()
      .on('pointerup', pointer => {
        this.restartButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.restartButton.playPointerMove()
      })

    let text = this.scene.add.bitmapText(0, 0, 'font', 'Restart', 30)
    this.bitmapTexts.push(text)

    Phaser.Display.Align.In.Center(text, this.background, -50, -50)

    this.add(text)
    this.add(this.restartButton)
  }

  private handleClose = (): void => {
    let gameScene = this.scene.scene.manager.getScene('GameScene')

    this.disappear()
    gameScene.scene.resume()
  }

  private handleRestart = (): void => {
    this.disappear()

    this.scene.time.delayedCall(400, () => {
      this.scene.scene.manager.getScene('GameScene').scene.restart()
      this.scene.registry.values.score = 0
      this.scene.registry.events.emit('scoreChanged')
      this.scene.scene.restart()
    })
  }

  private handleVolume = (): void => {
    if (!this.scene.sound.mute) {
      this.scene.sound.mute = true
      this.volumeButton.setTint(0xdcdcdc)
    } else {
      this.scene.sound.mute = false
      this.volumeButton.clearTint()
    }
  }

  public disappear(): void {
    this.scene.tweens.add({
      targets: this,
      props: {
        y: this.scene.cameras.main.height,
        scale: 0.1
      },
      duration: 300,
      ease: 'Expo.easeIn',
      onComplete: () => {
        this.setVisible(false)
      }
    })
  }

  public appear(): void {
    this.setVisible(true)

    this.scene.tweens.add({
      targets: this,
      props: {
        y: this.scene.cameras.main.height * 0.5,
        scale: 1
      },
      duration: 300,
      ease: 'Expo.easeOut'
    })
  }
}

export default PopupPause
