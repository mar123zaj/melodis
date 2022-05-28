import ImageKey from '../enums/image-key.enum';
import MoveDirection from '../enums/move-direction.enum';
import SpriteSheetKey from '../enums/sprite-sheet-key.enum';
import WolfAnimationKey from '../enums/wolf-animation-key.enum';
import Coordinates from '../types/coordinates.type';

export class Wolf {
  sprite: Phaser.Physics.Arcade.Sprite;
  attackPower = 5;

  private hp = 50;
  private scene: Phaser.Scene;
  private nextActionInterval = 500;
  private nextAction = 0;
  private currentMoveDirection = MoveDirection.RIGHT;
  private speed = 200;
  private nearDistance = 64;
  private attentionEmoji: Phaser.GameObjects.Image;
  private width = 32;
  private height = 26;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, SpriteSheetKey.WOLF_IDLE);

    this.sprite.setSize(this.width, this.height);

    this.sprite.anims.play(WolfAnimationKey.IDLE, true);
  }

  static loadAnims(scene: Phaser.Scene): void {
    scene.anims.create({
      key: WolfAnimationKey.IDLE,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.WOLF_IDLE, { start: 0, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: WolfAnimationKey.RUN,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.WOLF_RUN, { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: WolfAnimationKey.ATTACK,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.WOLF_ATTACK, { start: 0, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: WolfAnimationKey.DEATH,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.WOLF_DEATH, { start: 0, end: 17 }),
      frameRate: 8,
      hideOnComplete: true,
    });
  }

  receiveDamage(damage: number): void {
    this.hp -= damage;
  }

  shouldDie(): boolean {
    return this.hp <= 0;
  }

  die(): void {
    if (this.attentionEmoji) {
      this.removeAttentionEmoji();
    }

    this.sprite.anims.play(WolfAnimationKey.DEATH, false);
    this.sprite.disableBody();
  }

  private isFacingLeft(): boolean {
    return this.sprite.flipX;
  }

  private melodisIsNear(melodisCoordinates: Coordinates): boolean {
    const { x, y } = this.sprite;
    const distance = Phaser.Math.Distance.Between(x, y, melodisCoordinates.x, melodisCoordinates.y);
    return this.nearDistance >= distance;
  }

  private isMelodisOnLeft(melodisXCoordinate: number): boolean {
    return this.sprite.x > melodisXCoordinate;
  }

  private calculateEmojiCoordinates(): Coordinates {
    const x = this.sprite.x + (this.isFacingLeft() ? -this.width / 2 : this.width / 2);
    const y = this.sprite.y - this.height;

    return { x, y };
  }

  private updateEmojiPosition(emoji: Phaser.GameObjects.Image): void {
    const { x, y } = this.calculateEmojiCoordinates();
    emoji.setPosition(x, y);
  }

  private removeAttentionEmoji(): void {
    this.attentionEmoji.destroy();
    this.attentionEmoji = null;
  }

  update(time: number, melodisCoordinates: Coordinates): void {
    if (this.melodisIsNear(melodisCoordinates)) {
      if (this.attentionEmoji) {
        this.updateEmojiPosition(this.attentionEmoji);
      } else {
        const { x, y } = this.calculateEmojiCoordinates();
        this.attentionEmoji = this.scene.add.image(x, y, ImageKey.ATTENTION);
      }

      const flipX = this.isMelodisOnLeft(melodisCoordinates.x);

      this.sprite.setFlipX(flipX);
      this.sprite.anims.play(WolfAnimationKey.ATTACK, true);
      this.sprite.setVelocity(0);

      return;
    } else {
      if (this.attentionEmoji) {
        this.removeAttentionEmoji();
      }
    }

    if (time < this.nextAction) return;

    if (Phaser.Math.Between(0, 1) === 0) {
      this.sprite.anims.play(WolfAnimationKey.IDLE, true);
      this.sprite.setVelocity(0);
    } else {
      this.sprite.anims.play(WolfAnimationKey.RUN, true);
      const previousMoveDirection = this.currentMoveDirection;
      switch (previousMoveDirection) {
        case MoveDirection.LEFT:
          this.sprite.setVelocityX(-this.speed);
          this.sprite.setFlipX(true);
          break;
        case MoveDirection.RIGHT:
          this.sprite.setVelocityX(this.speed);
          this.sprite.setFlipX(false);
          break;
      }
      this.currentMoveDirection =
        previousMoveDirection === MoveDirection.LEFT ? MoveDirection.RIGHT : MoveDirection.LEFT;
    }

    this.nextAction = time + Phaser.Math.Between(500, 1500);
  }
}
