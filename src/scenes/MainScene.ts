import Phaser from 'phaser';
import Melodis from '../entities/Melodis';
import { Note } from '../entities/Note';
import { Wolf } from '../entities/Wolf';
import { Color } from '../enums/color.enum';
import ImageKey from '../enums/image-key.enum';

export default class MainScene extends Phaser.Scene {
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private melodis: Melodis;
  private notes: Note[];
  private wolfs: Wolf[];

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

    this.platforms = MainScene.addPlatforms(this, halfWidth, bottom);
    this.notes = MainScene.addNotes(this);
    this.wolfs = MainScene.addWolfs(this);

    this.melodis = new Melodis(this, halfWidth, halfHeight);

    this.physics.add.collider(this.platforms, this.melodis.sprite);

    this.notes.forEach((note) => {
      this.physics.add.collider(this.platforms, note.sprite);
      this.physics.add.overlap(this.melodis.sprite, note.sprite, this.collectNote, null, 4);
    });

    this.wolfs.forEach((wolf) => {
      this.physics.add.collider(this.platforms, wolf.sprite);
    });
  }

  collectNote(_: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, note: Phaser.Physics.Arcade.Image): void {
    note.disableBody(true, true);
  }

  static addPlatforms(scene: Phaser.Scene, x: number, y: number): Phaser.Physics.Arcade.StaticGroup {
    const platforms = scene.physics.add.staticGroup();

    platforms.create(x, y, ImageKey.GROUND);

    platforms.create(400, 600, ImageKey.PLATFORM);
    platforms.create(50, 250, ImageKey.PLATFORM);
    platforms.create(750, 220, ImageKey.PLATFORM);

    return platforms;
  }

  static addNotes(scene: Phaser.Scene): Note[] {
    const notes: Note[] = [];

    [
      { x: 400, y: 550, color: Color.WHITE },
      { x: 50, y: 210, color: Color.BLUE },
      { x: 750, y: 190, color: Color.RED },
    ].forEach(({ x, y, color }) => {
      notes.push(new Note(scene, x, y, color));
    });

    return notes;
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
    this.melodis.update(time);

    this.notes.forEach((note) => note.update(time));
  }
}
