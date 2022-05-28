import Phaser from 'phaser';
import BlackNote from '../../public/assets/icons/notes/black_note.png';
import BlueNote from '../../public/assets/icons/notes/blue_note.png';
import GreenNote from '../../public/assets/icons/notes/green_note.png';
import RedNote from '../../public/assets/icons/notes/red_note.png';
import WhiteNote from '../../public/assets/icons/notes/white_note.png';
import YellowNote from '../../public/assets/icons/notes/yellow_note.png';
import Melodis from '../../public/assets/sprites/melodis.png';
import WolfIdle from '../../public/assets/sprites/wolf/wolf_idle.png';
import WolfRun from '../../public/assets/sprites/wolf/wolf_run.png';
import WolfAttack from '../../public/assets/sprites/wolf/wolf_attack.png';
import WolfDeath from '../../public/assets/sprites/wolf/wolf_death.png';
import Ground from '../../public/assets/world/ground.png';
import Platform from '../../public/assets/world/platform.png';
import Sky from '../../public/assets/world/sky.png';
import { Color } from '../enums/color.enum';
import ImageKey from '../enums/image-key.enum';
import SpriteSheetKey from '../enums/sprite-sheet-key.enum';
import MainScene from './MainScene';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload(): void {
    this.load.image(ImageKey.SKY, Sky);
    this.load.image(ImageKey.GROUND, Ground);
    this.load.image(ImageKey.PLATFORM, Platform);
    this.load.image(`${Color.BLACK}_${ImageKey.NOTE}`, BlackNote);
    this.load.image(`${Color.BLUE}_${ImageKey.NOTE}`, BlueNote);
    this.load.image(`${Color.GREEN}_${ImageKey.NOTE}`, GreenNote);
    this.load.image(`${Color.RED}_${ImageKey.NOTE}`, RedNote);
    this.load.image(`${Color.WHITE}_${ImageKey.NOTE}`, WhiteNote);
    this.load.image(`${Color.YELLOW}_${ImageKey.NOTE}`, YellowNote);

    this.load.spritesheet(SpriteSheetKey.MELODIS, Melodis, { frameWidth: 50, frameHeight: 37 });
    this.load.spritesheet(SpriteSheetKey.WOLF_IDLE, WolfIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(SpriteSheetKey.WOLF_RUN, WolfRun, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(SpriteSheetKey.WOLF_ATTACK, WolfAttack, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(SpriteSheetKey.WOLF_DEATH, WolfDeath, { frameWidth: 64, frameHeight: 64 });
  }

  create(): void {
    this.scene.start(MainScene.name);
  }
}
