import Phaser from 'phaser';
import Melodis from '../../public/assets/sprites/melodis.png';
import Ground from '../../public/assets/world/ground.png';
import Platform from '../../public/assets/world/platform.png';
import Sky from '../../public/assets/world/sky.png';
import BlackNote from '../../public/assets/icons/notes/black_note.png';
import BlueNote from '../../public/assets/icons/notes/blue_note.png';
import GreenNote from '../../public/assets/icons/notes/green_note.png';
import RedNote from '../../public/assets/icons/notes/red_note.png';
import WhiteNote from '../../public/assets/icons/notes/white_note.png';
import YellowNote from '../../public/assets/icons/notes/yellow_note.png';
import ImageKey from '../enums/image-key.enum';
import MainScene from './MainScene';
import { Color } from '../enums/color.enum';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload(): void {
    this.load.image(ImageKey.SKY, Sky);
    this.load.image(ImageKey.GROUND, Ground);
    this.load.image(ImageKey.PLATFORM, Platform);
    this.load.spritesheet(ImageKey.MELODIS, Melodis, { frameWidth: 50, frameHeight: 37 });
    this.load.image(`${Color.BLACK}_${ImageKey.NOTE}`, BlackNote);
    this.load.image(`${Color.BLUE}_${ImageKey.NOTE}`, BlueNote);
    this.load.image(`${Color.GREEN}_${ImageKey.NOTE}`, GreenNote);
    this.load.image(`${Color.RED}_${ImageKey.NOTE}`, RedNote);
    this.load.image(`${Color.WHITE}_${ImageKey.NOTE}`, WhiteNote);
    this.load.image(`${Color.YELLOW}_${ImageKey.NOTE}`, YellowNote);
  }

  create(): void {
    this.scene.start(MainScene.name);
  }
}
