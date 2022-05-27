import AnimationKey from '../enums/animation-key.enum';
import ImageKey from '../enums/image-key.enum';
import Keys from '../types/melodis-keys.type';

export default class Melodis {
  sprite: Phaser.Physics.Arcade.Sprite;
  private keys: Keys;
  private scene: Phaser.Scene;

  private speed = 300;
  private jumpSpeed = 320;
  private isPreparedToFight = false;
  private isAttacking = false;
  private intervalKeyPress = 250;
  private keyPressLockedUntil = 0;
  private attackUntil = 0;
  private attackDuration = 700;
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

    this.sprite = scene.physics.add.sprite(x, y, ImageKey.MELODIS);
    this.sprite.setSize(20, 30);
    this.sprite.setOffset(14, 6);

    this.sprite.anims.play(AnimationKey.IDLE);
  }

  static loadAnims(scene: Phaser.Scene): void {
    scene.anims.create({
      key: AnimationKey.IDLE,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: AnimationKey.IDLE_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 38, end: 41 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: AnimationKey.BEND_DOWN,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 4, end: 7 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: AnimationKey.RUN,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 8, end: 13 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: AnimationKey.JUMP,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 14, end: 17 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: AnimationKey.EXTEND_JUMP,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 18, end: 23 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: AnimationKey.PULL_OUT_SWORD,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 69, end: 73 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: AnimationKey.PUT_SWORD,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 69, end: 73 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: AnimationKey.ATTACK_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(ImageKey.MELODIS, { start: 42, end: 46 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  stopMoving(): void {
    this.sprite.setVelocityX(0);
  }

  isFloatingInAir(): boolean {
    return !this.sprite.body.touching.down;
  }

  isTouchingGround(): boolean {
    return this.sprite.body.touching.down;
  }

  update(time: number): void {
    let animationKey: AnimationKey;

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
        animationKey = AnimationKey.EXTEND_JUMP;
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
      animationKey = AnimationKey.RUN;
      this.sprite.setVelocityX(-this.speed);
      this.sprite.setFlipX(true);
    } else if (right) {
      animationKey = AnimationKey.RUN;
      this.sprite.setVelocityX(this.speed);
      this.sprite.setFlipX(false);
    } else {
      animationKey = this.isPreparedToFight ? AnimationKey.IDLE_WITH_SWORD : AnimationKey.IDLE;
      this.stopMoving();
    }

    if (down && this.sprite.body.touching.down) {
      this.sprite.play(AnimationKey.BEND_DOWN, true);
      this.stopMoving();
      return;
    }

    if (up && this.isTouchingGround()) {
      animationKey = AnimationKey.JUMP;
      this.sprite.setVelocityY(-this.jumpSpeed);
      this.jumpUntil = time + this.jumpDuration;
      this.jumpsCounter += 1;
    }

    if (q) {
      this.isPreparedToFight = !this.isPreparedToFight;

      animationKey = this.isPreparedToFight ? AnimationKey.PUT_SWORD : AnimationKey.PULL_OUT_SWORD;
      this.keyPressLockedUntil = time + this.intervalKeyPress;
    }

    if (space) {
      if (!this.isPreparedToFight) {
        animationKey = AnimationKey.PULL_OUT_SWORD;
        this.isPreparedToFight = true;
      } else {
        animationKey = AnimationKey.ATTACK_WITH_SWORD;
        this.isAttacking = true;
        this.attackUntil = time + this.attackDuration;
      }
    }

    if (q || space) {
      this.stopMoving();
    }

    this.sprite.play(animationKey, true);
  }
}
