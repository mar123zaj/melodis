import MelodisAnimationKey from '../enums/melodis-animation-key.enum';
import SpriteSheetKey from '../enums/sprite-sheet-key.enum';
import Keys from '../types/melodis-keys.type';

export default class Melodis {
  sprite: Phaser.Physics.Arcade.Sprite;
  isAttacking = false;
  attackPower = 15;
  attackDuration = 700;

  private keys: Keys;
  private scene: Phaser.Scene;

  private hp = 100;
  private speed = 300;
  private jumpSpeed = 320;
  private isPreparedToFight = false;
  private intervalKeyPress = 250;
  private keyPressLockedUntil = 0;
  private attackUntil = 0;
  private jumpUntil = 0;
  private jumpDuration = 700;
  private jumpsCounter = 0;
  private maxJumpsNumber = 2;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
    }) as Keys;

    this.sprite = scene.physics.add.sprite(x, y, SpriteSheetKey.MELODIS);
    this.updateHitBox();

    this.sprite.anims.play(MelodisAnimationKey.IDLE);
  }

  static loadAnims(scene: Phaser.Scene): void {
    scene.anims.create({
      key: MelodisAnimationKey.IDLE,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.IDLE_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 38, end: 41 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.BEND_DOWN,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 4, end: 7 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.RUN,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 8, end: 13 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.JUMP,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 14, end: 17 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.EXTEND_JUMP,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 18, end: 23 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.PULL_OUT_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 69, end: 73 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.PUT_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 69, end: 73 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.ATTACK_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 42, end: 46 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  private stopMoving(): void {
    this.sprite.setVelocityX(0);
  }

  private isFloatingInAir(): boolean {
    return !this.sprite.body.touching.down;
  }

  private isTouchingGround(): boolean {
    return this.sprite.body.touching.down;
  }

  private isFacingLeft(): boolean {
    return this.sprite.flipX;
  }

  private updateHitBox(): void {
    if (this.isAttacking) {
      if (this.isFacingLeft()) {
        this.updateSizeAndOffset({ size: { width: 34, height: 36 }, offset: { x: 0, y: 0 } });
      } else {
        this.updateSizeAndOffset({ size: { width: 36, height: 36 }, offset: { x: 16, y: 0 } });
      }
    } else {
      this.updateSizeAndOffset({ size: { width: 20, height: 30 }, offset: { x: 14, y: 6 } });
    }
  }

  private updateSizeAndOffset({
    size,
    offset,
  }: {
    size: { width: number; height: number };
    offset: { x: number; y: number };
  }): void {
    const { width, height } = size;
    const { x, y } = offset;

    this.sprite.setSize(width, height);
    this.sprite.setOffset(x, y);
  }

  receiveDamage(damage: number): void {
    this.hp -= damage;
    this.scene.cameras.main.shake(150, 0.001);
    this.scene.cameras.main.flash(50, 100, 0, 0);
  }

  update(time: number): void {
    console.log({ isAttacking: this.isAttacking });
    let animationKey: MelodisAnimationKey;

    const up = this.keys.up.isDown,
      down = this.keys.down.isDown,
      left = this.keys.left.isDown,
      right = this.keys.right.isDown,
      space = this.keys.space.isDown,
      q = this.keys.q.isDown,
      z = this.keys.z.isDown;

    if (time < this.keyPressLockedUntil || time < this.attackUntil) return;

    if (time < this.jumpUntil) {
      if (z && this.jumpsCounter < this.maxJumpsNumber) {
        animationKey = MelodisAnimationKey.EXTEND_JUMP;
        this.sprite.setVelocityY(-this.jumpSpeed);
        this.jumpUntil = time + this.jumpDuration;
        this.sprite.play(animationKey, true);
        this.jumpsCounter += 1;
        return;
      }

      return;
    }

    if (this.isTouchingGround()) {
      this.jumpsCounter = 0;
    }

    if (left) {
      animationKey = MelodisAnimationKey.RUN;
      this.sprite.setVelocityX(-this.speed);
      this.sprite.setFlipX(true);
    } else if (right) {
      animationKey = MelodisAnimationKey.RUN;
      this.sprite.setVelocityX(this.speed);
      this.sprite.setFlipX(false);
    } else {
      animationKey = this.isPreparedToFight ? MelodisAnimationKey.IDLE_WITH_SWORD : MelodisAnimationKey.IDLE;
      this.stopMoving();
    }

    if (down && this.sprite.body.touching.down) {
      this.sprite.play(MelodisAnimationKey.BEND_DOWN, true);
      this.stopMoving();
      return;
    }

    if (up && this.isTouchingGround()) {
      animationKey = MelodisAnimationKey.JUMP;
      this.sprite.setVelocityY(-this.jumpSpeed);
      this.jumpUntil = time + this.jumpDuration;
      this.jumpsCounter += 1;
    }

    if (q) {
      this.isPreparedToFight = !this.isPreparedToFight;

      animationKey = this.isPreparedToFight ? MelodisAnimationKey.PUT_SWORD : MelodisAnimationKey.PULL_OUT_SWORD;
      this.keyPressLockedUntil = time + this.intervalKeyPress;
    }

    if (space) {
      if (!this.isPreparedToFight) {
        return;
      } else {
        animationKey = MelodisAnimationKey.ATTACK_WITH_SWORD;
        this.isAttacking = true;
        this.attackUntil = time + this.attackDuration;
        this.updateHitBox();
        this.sprite.play(animationKey, true);
        return;
      }
    }

    if (q || space) {
      this.stopMoving();
    }

    this.updateHitBox();
    this.isAttacking = false;
    this.sprite.play(animationKey, true);
  }
}
