abstract class MortalObject extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body

  protected baseHealth: number
  protected remainingHealth: number

  public die(): void {}
  public getBaseHealth(): number {
    return this.baseHealth
  }
  public getRemainingHealth(): number {
    return this.remainingHealth
  }

  public gotHitByBullet(damage: number): void {}
}

export default MortalObject
