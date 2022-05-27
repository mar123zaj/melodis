import Phaser from 'phaser';
import Melodis from '../../public/assets/sprites/melodis.png';
import Ground from '../../public/assets/world/ground.png';
import Platform from '../../public/assets/world/platform.png';
import Sky from '../../public/assets/world/sky.png';
import ImageKey from '../enums/image-key.enum';
import MainScene from './MainScene';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload(): void {
    this.load.image(ImageKey.SKY, Sky);
    this.load.image(ImageKey.GROUND, Ground);
    this.load.image(ImageKey.PLATFORM, Platform);
    this.load.spritesheet(ImageKey.MELODIS, Melodis, { frameWidth: 50, frameHeight: 37 });
  }

  create(): void {
    this.scene.start(MainScene.name);
  }
}
