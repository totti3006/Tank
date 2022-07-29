import ButtonAnimation from '../animations/AnimatedButton'
import PopupGameOver from '../gameUI/PopupGameOver'
import PopupPause from '../gameUI/PopupPause'

class HudScene extends Phaser.Scene {
  private settingButton: ButtonAnimation

  private popupPause: PopupPause
  private popupGameOver: PopupGameOver

  private textElements: Map<string, Phaser.GameObjects.Text>

  private isPointerOutButton: boolean

  constructor() {
    super({
      key: 'HUDScene'
    })
  }

  init(): void {
    this.isPointerOutButton = true
  }

  create(): void {
    this.createButton()
    this.createText()
    this.createEvents()
    this.createPopupPause()
    this.createPopupGameOver()
  }

  update(): void {}

  private createButton(): void {
    this.settingButton = new ButtonAnimation(this, this.sys.canvas.width - 100, 20, 'settings_button')
    this.settingButton
      .setOrigin(0)
      .setScale(3)
      .init(this.handleSettings)
      .setInteractive()
      .on('pointerup', pointer => {
        this.settingButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.settingButton.playPointerMove()
        if (this.isPointerOutButton) {
          this.events.emit('pointerInButton')
          this.isPointerOutButton = false
        }
      })
      .on('pointerout', pointer => {
        this.events.emit('pointerOutButton')
        this.isPointerOutButton = true
      })
  }

  private createText(): void {
    this.textElements = new Map([
      ['SCORE', this.addText(this.sys.canvas.width / 2 - 30, 30, `Score ${this.registry.get('score')}`)]
    ])
  }

  private createEvents(): void {
    const level = this.scene.get('GameScene')

    // this.checkExistingEvents()

    level.events.on('enemyDie', this.updateScore, this)
    level.events.on('gameOver', this.handleGameOver, this)

    this.events.on('resumeGame', this.handleResumeGame)
  }

  private createPopupPause(): void {
    this.popupPause = new PopupPause(this)
    this.popupPause.setVisible(false)
  }

  private createPopupGameOver(): void {
    this.popupGameOver = new PopupGameOver(this)
    this.popupGameOver.setVisible(false)
  }

  private updateScore(score: number): void {
    this.registry.set('score', this.registry.get('score') + score)
    this.textElements
      .get('SCORE')
      ?.setText(`Score ${this.registry.get('score')}`)
      .setX(this.sys.canvas.width / 2 - 4 * (this.registry.get('score').toString().length - 1))
  }

  private addText(x: number, y: number, value: string): Phaser.GameObjects.Text {
    return this.add.text(x, y, value).setOrigin(0, 0).setFontSize(40)
  }

  private handleSettings = (): void => {
    this.settingButton.setVisible(false)
    this.events.emit('pauseGame')
    this.popupPause.appear()
  }

  private handleGameOver(): void {
    this.popupGameOver.handleScoreAndHighScore()
    this.popupGameOver.appear()
    this.settingButton.setVisible(false)
  }

  private handleResumeGame = (): void => {
    this.settingButton.setVisible(true)
  }
}

export default HudScene
