import Phaser from 'phaser';
import MainSong from '../../public/assets/audio/main_song.mp3';
import MockSong from '../../public/assets/audio/mock_song.mp3';
import FightSong from '../../public/assets/audio/fight_song.mp3';
import Attention from '../../public/assets/icons/emojis/attention.png';
import BlackIconTape from '../../public/assets/icons/tapes/black_icon_tape.png';
import BlueIconTape from '../../public/assets/icons/tapes/blue_icon_tape.png';
import GreenIconTape from '../../public/assets/icons/tapes/green_icon_tape.png';
import RedIconTape from '../../public/assets/icons/tapes/red_icon_tape.png';
import WhiteIconTape from '../../public/assets/icons/tapes/white_icon_tape.png';
import YellowIconTape from '../../public/assets/icons/tapes/yellow_icon_tape.png';
import Melodis from '../../public/assets/sprites/melodis.png';
import MelodisMeditation from '../../public/assets/sprites/melodis_meditation.png';
import WolfAttack from '../../public/assets/sprites/wolf/wolf_attack.png';
import WolfDeath from '../../public/assets/sprites/wolf/wolf_death.png';
import WolfIdle from '../../public/assets/sprites/wolf/wolf_idle.png';
import WolfRun from '../../public/assets/sprites/wolf/wolf_run.png';
import Ground from '../../public/assets/world/ground.png';
import Platform from '../../public/assets/world/platform.png';
import Sky from '../../public/assets/world/sky.png';
import AudioKey from '../enums/audio-key.enum';
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
    this.load.image(`${Color.BLACK}_${ImageKey.ICON_TAPE}`, BlackIconTape);
    this.load.image(`${Color.BLUE}_${ImageKey.ICON_TAPE}`, BlueIconTape);
    this.load.image(`${Color.GREEN}_${ImageKey.ICON_TAPE}`, GreenIconTape);
    this.load.image(`${Color.RED}_${ImageKey.ICON_TAPE}`, RedIconTape);
    this.load.image(`${Color.WHITE}_${ImageKey.ICON_TAPE}`, WhiteIconTape);
    this.load.image(`${Color.YELLOW}_${ImageKey.ICON_TAPE}`, YellowIconTape);
    this.load.image(ImageKey.ATTENTION, Attention);

    this.load.spritesheet(SpriteSheetKey.MELODIS, Melodis, { frameWidth: 50, frameHeight: 37 });
    this.load.spritesheet(SpriteSheetKey.MELODIS_MEDITATION, MelodisMeditation, { frameWidth: 50, frameHeight: 37 });
    this.load.spritesheet(SpriteSheetKey.WOLF_IDLE, WolfIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(SpriteSheetKey.WOLF_RUN, WolfRun, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(SpriteSheetKey.WOLF_ATTACK, WolfAttack, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(SpriteSheetKey.WOLF_DEATH, WolfDeath, { frameWidth: 64, frameHeight: 64 });

    this.load.audio(AudioKey.FIGHT_SONG, FightSong);
    this.load.audio(AudioKey.MAIN_SONG, MainSong);
    this.load.audio(AudioKey.MOCK_SONG, MockSong);
  }

  create(): void {
    this.scene.start(MainScene.name);
  }
}
