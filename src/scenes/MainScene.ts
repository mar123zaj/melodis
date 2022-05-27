import Phaser from 'phaser';
import Melodis from '../entities/Melodis';
import ImageKey from '../enums/image-key.enum';

export default class MainScene extends Phaser.Scene {
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private melodis: Melodis;

  constructor() {
    super('MainScene');
  }

  create(): void {
    const { width, height } = this.game.renderer;
    const halfWidth = width / 2,
      halfHeight = height / 2;
    const bottom = height - 50;

    Melodis.loadAnims(this);

    this.add.image(halfWidth, halfHeight, ImageKey.SKY).setDisplaySize(width, height);

    this.platforms = MainScene.addPlatforms(this, halfWidth, bottom);

    this.melodis = new Melodis(this, halfWidth, halfHeight);

    this.physics.add.collider(this.platforms, this.melodis.sprite);
  }

  static addPlatforms(scene: Phaser.Scene, x: number, y: number): Phaser.Physics.Arcade.StaticGroup {
    const platforms = scene.physics.add.staticGroup();

    platforms.create(x, y, ImageKey.GROUND);

    platforms.create(400, 600, ImageKey.PLATFORM);
    platforms.create(50, 250, ImageKey.PLATFORM);
    platforms.create(750, 220, ImageKey.PLATFORM);

    return platforms;
  }

  update(time: number): void {
    this.melodis.update(time);
  }
}
