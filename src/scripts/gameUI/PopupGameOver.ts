import ButtonAnimation from '../animations/AnimatedButton'
import HudScene from '../scenes/HudScene'

class PopupGameOver extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = []
  private newGameButton: ButtonAnimation
  private highScore: number = 0

  constructor(scene: HudScene) {
    super(scene)

    this.scene.add.existing(this)
    this.setPosition(this.scene.cameras.main.width * 0.5, 0).setAlpha(0.1)

    this.createBackground()
    this.displayTitle()
    this.displayNewGameButton()
  }

  public handleScoreAndHighScore(): void {
    this.handleHighScore()
    this.displayScore()
    this.displayHighScore()
  }

  private handleHighScore(): void {
    if (!this.isHighScoreExist()) this.initHighScore()
    this.setHighScore()
  }

  private isHighScoreExist(): boolean {
    if (localStorage.getItem('highScore') === null) return false
    return true
  }

  private initHighScore(): void {
    localStorage.setItem('highScore', '0')
  }

  private setHighScore(): void {
    let retrieveHighScore = Number(localStorage.getItem('highScore'))
    let playerScore: number = this.scene.registry.get('score')

    if (retrieveHighScore < playerScore) {
      this.highScore = playerScore
      localStorage.setItem('highScore', playerScore.toString())
    } else {
      this.highScore = retrieveHighScore
    }
  }

  private createBackground(): void {
    this.background = this.scene.add.image(0, 0, 'popup_pause')
    this.add(this.background)
  }

  private displayTitle(): void {
    let text = this.scene.add.bitmapText(0, 0, 'font', 'Game Over', 35)
    this.bitmapTexts.push(text)

    Phaser.Display.Align.In.TopCenter(text, this.background, 0, -20)

    text.setDepth(5)

    this.add(text)
  }

  private displayScore(): void {
    let text = this.scene.add.text(0, 0, `Score ${this.scene.registry.get('score')}`)

    text.setOrigin(0, 0).setFontSize(30)

    Phaser.Display.Align.In.Center(text, this.background, 0, -60)

    text.setDepth(5)

    this.add(text)
  }

  private displayHighScore(): void {
    let text = this.scene.add.text(0, 0, `High score ${this.highScore}`)

    text.setOrigin(0, 0).setFontSize(30)

    Phaser.Display.Align.In.Center(text, this.background, 0, -10)

    text.setDepth(5)

    this.add(text)
  }

  private displayNewGameButton(): void {
    this.newGameButton = new ButtonAnimation(this.scene, 0, 0, 'restart_button')

    Phaser.Display.Align.In.Center(this.newGameButton, this.background, 90, 80)

    this.newGameButton
      .setScale(3)
      .init(this.handleNewGame)
      .setInteractive()
      .on('pointerup', pointer => {
        this.newGameButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.newGameButton.playPointerMove()
      })

    let text = this.scene.add.bitmapText(0, 0, 'font', 'New game', 30)
    this.bitmapTexts.push(text)

    Phaser.Display.Align.In.Center(text, this.background, -40, 80)

    this.add(text)
    this.add(this.newGameButton)
  }

  private handleNewGame = (): void => {
    this.scene.time.delayedCall(1200, () => {
      let gameScene = this.scene.scene.manager.getScene('GameScene')

      this.removeEventsListener()

      gameScene.scene.restart()
      this.scene.registry.values.score = 0
      this.scene.scene.restart()
    })

    this.disappear()
  }

  private removeEventsListener(): void {
    let gameScene = this.scene.scene.manager.getScene('GameScene')
    gameScene.events.removeListener('enemyDie')
    gameScene.events.removeListener('gameOver')
    this.scene.events.removeListener('resumeGame')
    this.scene.events.removeListener('pauseGame')
  }

  public disappear(): void {
    this.scene.tweens.add({
      targets: this,
      props: {
        y: 0,
        alpha: 0.1
      },
      duration: 1000,
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
        alpha: 1
      },
      duration: 1000,
      ease: 'Bounce.easeOut'
    })
  }
}

export default PopupGameOver
