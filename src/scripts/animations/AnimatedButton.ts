class AnimatedButton extends Phaser.GameObjects.Image {
  private upTween: Phaser.Tweens.Tween
  private moveTween: Phaser.Tweens.Tween
  private scaleUp: Phaser.Tweens.Tween

  private scaleRatio: number

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)

    this.scene.add.existing(this)

    this.scaleRatio = 1.5
  }

  public init(onPointerUpCallback): AnimatedButton {
    this.upTween = this.scene.add.tween({
      targets: this,
      y: { from: this.y, to: this.y + 7 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0,
      onComplete: onPointerUpCallback
    })

    this.moveTween = this.scene.add.tween({
      targets: this,
      y: { from: this.y, to: this.y + 5 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0
    })

    this.scaleUp = this.scene.add.tween({
      targets: this,
      scale: this.scaleRatio,
      duration: 500,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
      paused: true
    })

    return this
  }

  public playPointerUp(): AnimatedButton {
    this.moveTween.stop()
    this.upTween.play()
    return this
  }

  public playPointerMove(): AnimatedButton {
    if (!this.upTween.isPlaying()) this.moveTween.play()
    return this
  }

  public playScale(): AnimatedButton {
    this.scaleUp.play()
    return this
  }

  public stopScale(): AnimatedButton {
    this.scaleUp.stop()
    return this
  }

  public setScaleAnimationRatio(ratio: number): AnimatedButton {
    this.scaleRatio = ratio
    return this
  }
}

export default AnimatedButton
