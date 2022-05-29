import { TapeColor } from '../enums/color.enum';
import MelodisAnimationKey from '../enums/melodis-animation-key.enum';
import SpriteSheetKey from '../enums/sprite-sheet-key.enum';
import MelodisKeys from '../types/melodis-keys.type';

export default class Melodis {
  sprite: Phaser.Physics.Arcade.Sprite;
  isAttacking = false;
  isMeditating = false;
  isBerserker = false;
  isDark = false;
  isAngel = false;
  isFocused = false;
  attackPower = 15;
  attackDuration = 700;
  castSpellDuration = 1500;

  private keys: MelodisKeys;
  private scene: Phaser.Scene;

  private defaultAttackDuration = 700;
  private defaultAttackPower = 15;
  private hp = 100;
  private defaultSpeed = 300;
  private speed = 300;
  private jumpSpeed = 320;
  private flySpeed = 100;
  private defaultJumpSpeed = 320;
  private isHoldingSword = false;
  private intervalKeyPress = 650;
  private keyPressLockedUntil = 0;
  private attackUntil = 0;
  private jumpUntil = 0;
  private jumpDuration = 700;
  private jumpsCounter = 0;
  private maxJumpsNumber = 2;
  private isSpellingCast = false;

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
    }) as MelodisKeys;

    this.sprite = scene.physics.add.sprite(x, y, SpriteSheetKey.MELODIS);
    scene.cameras.main.setRoundPixels(true);
    scene.cameras.main.setZoom(1.5);
    scene.cameras.main.startFollow(this.sprite);

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
      key: MelodisAnimationKey.FLY,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 79, end: 80 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.JUMP,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 14, end: 17 }),
      frameRate: 8,
    });

    scene.anims.create({
      key: MelodisAnimationKey.EXTEND_JUMP,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 18, end: 23 }),
      frameRate: 5,
    });

    scene.anims.create({
      key: MelodisAnimationKey.PULL_OUT_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 69, end: 73 }),
      frameRate: 8,
    });

    scene.anims.create({
      key: MelodisAnimationKey.PUT_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 74, end: 76 }),
      frameRate: 8,
    });

    scene.anims.create({
      key: MelodisAnimationKey.ATTACK_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 42, end: 46 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.FOCUSED_ATTACK_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 47, end: 58 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.BERSERKER_ATTACK_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS, { start: 96, end: 108 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.MEDITATION,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.MELODIS_MEDITATION, { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.DARK_IDLE,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.DARK_MELODIS, { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.DARK_IDLE_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.DARK_MELODIS, { start: 38, end: 41 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.DARK_ATTACK_WITH_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.DARK_MELODIS, { start: 42, end: 46 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.DARK_ATTACK_WITHOUT_SWORD,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.DARK_MELODIS, { start: 85, end: 92 }),
      frameRate: 8,
    });

    scene.anims.create({
      key: MelodisAnimationKey.DARK_BEND_DOWN,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.DARK_MELODIS, { start: 4, end: 7 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.DARK_RUN,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.DARK_MELODIS, { start: 8, end: 13 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: MelodisAnimationKey.DARK_JUMP,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.DARK_MELODIS, { start: 14, end: 17 }),
      frameRate: 8,
    });

    scene.anims.create({
      key: MelodisAnimationKey.DARK_EXTEND_JUMP,
      frames: scene.anims.generateFrameNumbers(SpriteSheetKey.DARK_MELODIS, { start: 18, end: 23 }),
      frameRate: 5,
    });
  }

  private stopMoving(): void {
    this.sprite.setVelocityX(0);
  }

  private isTouchingGround(): boolean {
    return this.sprite.body.touching.down;
  }

  private isFacingLeft(): boolean {
    return this.sprite.flipX;
  }

  private updateHitBox(): void {
    if (this.isAttacking) {
      if (this.isSpellingCast) {
        this.isFacingLeft()
          ? this.updateSizeAndOffset({ size: { width: 40, height: 36 }, offset: { x: 0, y: 0 } })
          : this.updateSizeAndOffset({ size: { width: 42, height: 36 }, offset: { x: 16, y: 0 } });
      } else {
        this.isFacingLeft()
          ? this.updateSizeAndOffset({ size: { width: 34, height: 36 }, offset: { x: 0, y: 0 } })
          : this.updateSizeAndOffset({ size: { width: 36, height: 36 }, offset: { x: 16, y: 0 } });
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

  setStatsToDefault(): void {}

  turnOnSongEffects(tapeColor: TapeColor): void {
    if (tapeColor === TapeColor.red) {
      this.scene.cameras.main.setZoom(3);
      this.scene.cameras.main.shake(150, 0.001);
      this.speed *= 2;
      this.attackPower *= 1.5;
      this.attackDuration = 1500;
      if (!this.isHoldingSword) {
        this.sprite.anims.play(MelodisAnimationKey.PULL_OUT_SWORD);
        this.isHoldingSword = true;
      }

      this.isBerserker = true;
      return;
    } else if (tapeColor === TapeColor.white) {
      this.isAngel = true;
      return;
    } else if (tapeColor === TapeColor.blue) {
      this.attackPower *= 3;
      this.attackDuration = 1500;

      this.isFocused = true;
      return;
    } else if (tapeColor === TapeColor.black) {
      this.attackPower *= 2;
      this.attackDuration = 1500;

      this.isDark = true;
      return;
    } else if (tapeColor === TapeColor.green) {
      this.sprite.anims.play(MelodisAnimationKey.MEDITATION, true);
      this.sprite.setAlpha(0.5);
      this.isMeditating = true;
      return;
    }
  }

  turnOffSongEffects(): void {
    this.scene.cameras.main.setZoom(1.5);
    this.isBerserker = false;
    this.isMeditating = false;
    this.isDark = false;
    this.isAngel = false;
    this.isFocused = false;
    this.sprite.setAlpha(1);
    this.speed = this.defaultSpeed;
    this.jumpSpeed = this.defaultJumpSpeed;
    this.attackPower = this.defaultAttackPower;
    this.attackDuration = this.defaultAttackDuration;
  }

  update(time: number): void {
    let animationKey: MelodisAnimationKey;

    const up = this.keys.up.isDown,
      down = this.keys.down.isDown,
      left = this.keys.left.isDown,
      right = this.keys.right.isDown,
      space = this.keys.space.isDown,
      q = this.keys.q.isDown,
      z = this.keys.z.isDown;

    if (this.isAngel && !this.isTouchingGround()) {
      this.sprite.play(MelodisAnimationKey.FLY, true);
      if (up) {
        this.sprite.setVelocityY(-this.flySpeed);
      }

      if (left) {
        this.sprite.setVelocityX(-this.flySpeed);
        this.sprite.setFlipX(true);
      } else if (right) {
        this.sprite.setVelocityX(this.flySpeed);
        this.sprite.setFlipX(false);
      }

      return;
    }

    if (this.isMeditating) return;

    if (this.isBerserker) {
      this.scene.cameras.main.shake(150, 0.001);
    }

    if (time < this.keyPressLockedUntil || time < this.attackUntil || !this.sprite.body.enable) return;

    if (time < this.jumpUntil) {
      if (z && this.jumpsCounter < this.maxJumpsNumber) {
        animationKey = this.isDark ? MelodisAnimationKey.DARK_EXTEND_JUMP : MelodisAnimationKey.EXTEND_JUMP;
        this.sprite.setVelocityY(-this.jumpSpeed);
        this.jumpUntil = time + this.jumpDuration;
        this.sprite.play(animationKey, true);
        this.jumpsCounter += 1;

        if (left) {
          animationKey = this.isDark ? MelodisAnimationKey.DARK_RUN : MelodisAnimationKey.RUN;
          this.sprite.setVelocityX(-this.speed);
          this.sprite.setFlipX(true);
        } else if (right) {
          animationKey = this.isDark ? MelodisAnimationKey.DARK_RUN : MelodisAnimationKey.RUN;
          this.sprite.setVelocityX(this.speed);
          this.sprite.setFlipX(false);
        }
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
      if (this.isDark) {
        animationKey = this.isHoldingSword ? MelodisAnimationKey.DARK_IDLE_WITH_SWORD : MelodisAnimationKey.DARK_IDLE;
      } else {
        animationKey = this.isHoldingSword ? MelodisAnimationKey.IDLE_WITH_SWORD : MelodisAnimationKey.IDLE;
      }
      this.stopMoving();
    }

    if (down && this.isTouchingGround()) {
      animationKey = this.isDark ? MelodisAnimationKey.DARK_BEND_DOWN : MelodisAnimationKey.BEND_DOWN;
      this.sprite.play(animationKey, true);
      this.stopMoving();
      return;
    }

    if (up && this.isTouchingGround()) {
      animationKey = MelodisAnimationKey.JUMP;
      this.sprite.setVelocityY(-this.jumpSpeed);
      this.jumpUntil = time + this.jumpDuration;
      this.jumpsCounter += 1;
    }

    if (q && !this.isBerserker) {
      animationKey = this.isHoldingSword ? MelodisAnimationKey.PUT_SWORD : MelodisAnimationKey.PULL_OUT_SWORD;

      this.isHoldingSword = !this.isHoldingSword;
      this.keyPressLockedUntil = time + this.intervalKeyPress;
      this.stopMoving();
    }

    if (space) {
      if (!this.isHoldingSword) {
        if (this.isDark) {
          animationKey = MelodisAnimationKey.DARK_ATTACK_WITHOUT_SWORD;
          this.isAttacking = true;
          this.isSpellingCast = true;
          this.attackUntil = time + this.castSpellDuration;
          this.updateHitBox();
          this.sprite.play(animationKey, true);
          this.stopMoving();
          return;
        } else {
          return;
        }
      } else {
        if (this.isBerserker) {
          animationKey = MelodisAnimationKey.BERSERKER_ATTACK_WITH_SWORD;
        } else if (this.isDark) {
          animationKey = MelodisAnimationKey.DARK_ATTACK_WITH_SWORD;
        } else if (this.isFocused) {
          animationKey = MelodisAnimationKey.FOCUSED_ATTACK_WITH_SWORD;
        } else {
          animationKey = MelodisAnimationKey.ATTACK_WITH_SWORD;
        }
        this.isAttacking = true;
        this.attackUntil = time + this.attackDuration;
        this.updateHitBox();
        this.sprite.play(animationKey, true);
        this.stopMoving();
        return;
      }
    }

    this.updateHitBox();
    this.isAttacking = false;
    this.isSpellingCast = false;
    this.sprite.play(animationKey, true);
  }
}
