import { Color } from '../enums/color.enum';
import SpriteSheetKey from '../enums/sprite-sheet-key.enum';
import WolfAnimationKey from '../enums/wolf-animation-key.enum';

enum MoveDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

export class Wolf {
  sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private nextActionInterval = 2000;
  private nextAction = 0;
  private currentMoveDirection = MoveDirection.DOWN;
  private speed = 3;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, SpriteSheetKey.WOLF_IDLE);

    this.sprite.setSize(32, 26);

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
      repeat: -1,
    });
  }

  update(time: number): void {
    // if (time > this.nextAction) {
    //   const previousMoveDirection = this.currentMoveDirection;
    //   switch (previousMoveDirection) {
    //     case MoveDirection.UP:
    //       this.sprite.setVelocityY(this.speed);
    //       break;
    //     case MoveDirection.DOWN:
    //       this.sprite.setVelocityY(-this.speed);
    //       break;
    //   }
    //   this.currentMoveDirection = previousMoveDirection === MoveDirection.UP ? MoveDirection.DOWN : MoveDirection.UP;
    //   this.nextAction = time + this.nextActionInterval;
    // }
  }
}
