import { Color } from '../enums/color.enum';
import ImageKey from '../enums/image-key.enum';
import MoveDirection from '../enums/move-direction.enum';

export class Tape {
  sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private nextActionInterval = 2000;
  private nextAction = 0;
  private currentMoveDirection = MoveDirection.DOWN;
  private speed = 3;

  constructor(scene: Phaser.Scene, x: number, y: number, color: Color) {
    this.scene = scene;

    const spriteKey = `${color}_${ImageKey.ICON_TAPE}`;
    this.sprite = scene.physics.add.sprite(x, y, spriteKey);

    this.sprite.body.bounce.y = 0.8;
    this.sprite.body.gravity.y = 50;
    this.sprite.body.allowGravity = false;
  }

  update(time: number): void {
    if (time > this.nextAction) {
      const previousMoveDirection = this.currentMoveDirection;
      switch (previousMoveDirection) {
        case MoveDirection.UP:
          this.sprite.setVelocityY(this.speed);
          break;
        case MoveDirection.DOWN:
          this.sprite.setVelocityY(-this.speed);
          break;
      }

      this.currentMoveDirection = previousMoveDirection === MoveDirection.UP ? MoveDirection.DOWN : MoveDirection.UP;

      this.nextAction = time + this.nextActionInterval;
    }
  }
}
