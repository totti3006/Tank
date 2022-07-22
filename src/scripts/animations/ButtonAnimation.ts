class ButtonAnimation extends Phaser.GameObjects.Image {
  private upTween: Phaser.Tweens.Tween
  private moveTween: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)

    this.scene.add.existing(this)
  }

  public initButton(callback): ButtonAnimation {
    this.upTween = this.scene.add.tween({
      targets: this,
      y: { from: this.y, to: this.y + 7 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0,
      onComplete: callback
    })

    this.moveTween = this.scene.add.tween({
      targets: this,
      y: { from: this.y, to: this.y + 5 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0
    })

    return this
  }

  public playPointerUp(): void {
    this.moveTween.stop()
    this.upTween.play()
  }

  public playPointerMove(): void {
    if (!this.upTween.isPlaying()) this.moveTween.play()
  }
}

export default ButtonAnimation
