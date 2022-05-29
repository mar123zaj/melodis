import Phaser from 'phaser';
import Melodis from '../entities/Melodis';
import { Tape } from '../entities/Tape';
import { Wolf } from '../entities/Wolf';
import AudioKey from '../enums/audio-key.enum';
import { Color } from '../enums/color.enum';
import ImageKey from '../enums/image-key.enum';

export default class MainScene extends Phaser.Scene {
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private melodis: Melodis;
  private tapes: Tape[];
  private wolfs: Wolf[];
  private wolfsGroup: Phaser.GameObjects.Group;
  private attackLockedUntil = 0;

  constructor() {
    super('MainScene');
  }

  create(): void {
    const { width, height } = this.game.renderer;
    const halfWidth = width / 2,
      halfHeight = height / 2;
    const bottom = height - 50;

    Melodis.loadAnims(this);
    Wolf.loadAnims(this);

    this.add.image(halfWidth, halfHeight, ImageKey.SKY).setDisplaySize(width, height);
    // this.sound.add(AudioKey.MAIN_SONG, { loop: true }).play();

    this.sound.play(AudioKey.MAIN_SONG, { loop: true });

    this.platforms = MainScene.addPlatforms(this, halfWidth, bottom);
    this.tapes = MainScene.addTapes(this);
    this.wolfs = MainScene.addWolfs(this);
    this.wolfsGroup = this.physics.add.group(this.wolfs.map((wolf) => wolf.sprite));

    this.melodis = new Melodis(this, halfWidth, halfHeight);

    this.physics.add.collider(this.platforms, this.melodis.sprite);

    this.tapes.forEach((tape) => {
      this.physics.add.collider(this.platforms, tape.sprite);
      this.physics.add.overlap(this.melodis.sprite, tape.sprite, this.collectTape, null, 4);
    });

    this.physics.add.collider(this.platforms, this.wolfsGroup);
    this.physics.add.overlap(this.melodis.sprite, this.wolfsGroup, this.melodisWolfCollide, undefined, this);
  }

  melodisWolfCollide(_: Phaser.GameObjects.GameObject, wolfSprite: Phaser.GameObjects.GameObject): void {
    if (this.time.now < this.attackLockedUntil) return;

    const wolf = this.wolfs.find((w) => w.sprite === wolfSprite);

    if (!wolf) {
      console.log('Missing wolf sprite to collide.');
      return;
    }

    if (this.melodis.isAttacking) {
      this.attackLockedUntil = this.time.now + this.melodis.attackDuration;

      wolf.receiveDamage(this.melodis.attackPower);

      if (wolf.shouldDie()) {
        this.wolfs = this.wolfs.filter((w) => w != wolf);
        wolf.die();
      }
    } else {
      this.melodis.receiveDamage(wolf.attackPower);
    }
  }

  collectTape(_: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, tape: Phaser.Physics.Arcade.Image): void {
    tape.disableBody(true, true);
  }

  static addPlatforms(scene: Phaser.Scene, x: number, y: number): Phaser.Physics.Arcade.StaticGroup {
    const platforms = scene.physics.add.staticGroup();

    platforms.create(x, y, ImageKey.GROUND);

    platforms.create(400, 600, ImageKey.PLATFORM);
    platforms.create(50, 250, ImageKey.PLATFORM);
    platforms.create(750, 220, ImageKey.PLATFORM);

    return platforms;
  }

  static addTapes(scene: Phaser.Scene): Tape[] {
    const tapes: Tape[] = [];

    [
      { x: 400, y: 550, color: Color.RED },
      { x: 50, y: 210, color: Color.BLUE },
      { x: 750, y: 190, color: Color.WHITE },
    ].forEach(({ x, y, color }) => {
      tapes.push(new Tape(scene, x, y, color));
    });

    return tapes;
  }

  static addWolfs(scene: Phaser.Scene): Wolf[] {
    const wolfs: Wolf[] = [];

    [
      { x: 430, y: 550 },
      { x: 80, y: 210 },
      { x: 780, y: 190 },
    ].forEach(({ x, y }) => {
      wolfs.push(new Wolf(scene, x, y));
    });

    return wolfs;
  }

  update(time: number): void {
    const { x, y } = this.melodis.sprite;
    this.melodis.update(time);

    this.tapes.forEach((tape) => tape.update(time));
    this.wolfs.forEach((wolf) => wolf.update(time, { x, y }));
  }
}
