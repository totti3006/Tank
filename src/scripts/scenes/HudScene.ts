import ButtonAnimation from '../animations/ButtonAnimation'
import PopupGameOver from '../gameUI/PopupGameOver'
import PopupPause from '../gameUI/PopupPause'
import ObjectsManager from '../objects/ObjectsManager'

class HudScene extends Phaser.Scene {
  private settingButton: ButtonAnimation

  private objectManager: ObjectsManager
  private popupPause: PopupPause
  private popupGameOver: PopupGameOver

  private textElements: Map<string, Phaser.GameObjects.Text>

  private gameOver: boolean

  constructor() {
    super({
      key: 'HUDScene'
    })
  }

  init(): void {
    this.objectManager = ObjectsManager.getInstance()
    this.gameOver = false
  }

  create(): void {
    this.createButton()
    this.createText()
    this.createEvents()
    this.createPopupPause()
    this.createPopupGameOver()
  }

  update(): void {
    let gameScene = this.scene.manager.getScene('GameScene')

    if (gameScene.scene.isPaused() || this.gameOver) {
      this.settingButton.setVisible(false)
    } else if (!this.settingButton.visible) {
      this.settingButton.setVisible(true)
    }
  }

  private createButton(): void {
    this.settingButton = new ButtonAnimation(this, this.sys.canvas.width - 100, 20, 'settings_button')
    this.settingButton
      .setOrigin(0)
      .setScale(3)
      .initButton(this.handleSettings)
      .setInteractive()
      .on('pointerup', pointer => {
        this.settingButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.objectManager.getPlayer().allowFire = false
        this.settingButton.playPointerMove()
      })
      .on('pointerout', pointer => {
        this.objectManager.getPlayer().allowFire = true
      })
  }

  private createText(): void {
    this.textElements = new Map([
      ['SCORE', this.addText(this.sys.canvas.width / 2 - 30, 30, `Score ${this.registry.get('score')}`)]
    ])
  }

  private createEvents(): void {
    const level = this.scene.get('GameScene')
    level.events.on('scoreChanged', this.updateScore, this)
    level.events.on('gameOver', this.handleGameOver, this)
  }

  private createPopupPause(): void {
    this.popupPause = new PopupPause(this)
    this.popupPause.setVisible(false)
  }

  private createPopupGameOver(): void {
    this.popupGameOver = new PopupGameOver(this)
    this.popupGameOver.setVisible(false)
  }

  private updateScore(): void {
    this.textElements
      .get('SCORE')
      ?.setText(`Score ${this.registry.get('score')}`)
      .setX(this.sys.canvas.width / 2 - 4 * (this.registry.get('score').toString().length - 1))
  }

  private addText(x: number, y: number, value: string): Phaser.GameObjects.Text {
    return this.add.text(x, y, value).setOrigin(0, 0).setFontSize(40)
  }

  private handleSettings = (): void => {
    let gameScene = this.scene.manager.getScene('GameScene')

    gameScene.scene.pause()
    this.popupPause.appear()
  }

  private handleGameOver(): void {
    this.gameOver = true
    this.popupGameOver.handleScoreAndHighScore()
    this.popupGameOver.appear()
  }
}

export default HudScene
