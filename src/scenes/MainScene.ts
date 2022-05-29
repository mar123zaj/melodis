import Phaser from 'phaser';
import Melodis from '../entities/Melodis';
import { Tape } from '../entities/Tape';
import { Wolf } from '../entities/Wolf';
import AudioKey from '../enums/audio-key.enum';
import { TapeColor } from '../enums/color.enum';
import ImageKey from '../enums/image-key.enum';
import Event from '../events/event.enum';
import eventsCenter from '../events/EventsCenter';
import PhaserEvent from '../events/phaser-event.enum';
import MainSceneKeys from '../types/main-keys.type';
import TapeSelectionScene from './TapeSelectionScene';

export default class MainScene extends Phaser.Scene {
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private melodis: Melodis;
  private tapes: Tape[];
  private wolfs: Wolf[];
  private wolfsGroup: Phaser.GameObjects.Group;
  private attackLockedUntil = 0;
  private keys: MainSceneKeys;
  private intervalKeyPress = 650;
  private keyPressLockedUntil = 0;
  private tapeSelectionActivated = false;
  private defaultSong: Phaser.Sound.BaseSound;
  private tapeSong: Phaser.Sound.BaseSound;

  constructor() {
    super('MainScene');
  }

  create(): void {
    this.keys = this.input.keyboard.addKeys({
      t: Phaser.Input.Keyboard.KeyCodes.T,
      i: Phaser.Input.Keyboard.KeyCodes.I,
    }) as MainSceneKeys;

    const { width, height } = this.game.renderer;
    const halfWidth = width / 2,
      halfHeight = height / 2;
    const bottom = height - 50;

    Melodis.loadAnims(this);
    Wolf.loadAnims(this);

    this.add.image(halfWidth, halfHeight, ImageKey.SKY).setDisplaySize(width, height);
    this.defaultSong = this.sound.add(AudioKey.MAIN_SONG, { loop: true });

    this.defaultSong.play();

    this.platforms = MainScene.addPlatforms(this, halfWidth, bottom);
    this.tapes = MainScene.addTapes(this);
    this.wolfs = MainScene.addWolfs(this);
    this.wolfsGroup = this.physics.add.group(this.wolfs.map((wolf) => wolf.sprite));

    this.melodis = new Melodis(this, halfWidth, halfHeight);

    this.physics.add.collider(this.platforms, this.melodis.sprite);

    this.tapes.forEach((tape) => {
      this.physics.add.collider(this.platforms, tape.sprite);
      this.physics.add.overlap(this.melodis.sprite, tape.sprite, this.collectTape, null, this);
    });

    this.physics.add.collider(this.platforms, this.wolfsGroup);
    this.physics.add.overlap(this.melodis.sprite, this.wolfsGroup, this.melodisWolfCollide, undefined, this);

    this.scene.run(TapeSelectionScene.name);

    eventsCenter.on(Event.RUN_TAPE, this.runTape, this);
  }

  runTape(tapeColor: TapeColor): void {
    this.tapeSelectionActivated = false;
    this.melodis.sprite.enableBody(false, this.melodis.sprite.x, this.melodis.sprite.y, true, true);

    this.defaultSong.pause();
    if (this.tapeSong && this.tapeSong.isPlaying) {
      this.tapeSong.destroy();
      this.melodis.turnOffSongEffects();
    }

    this.melodis.turnOnSongEffects(tapeColor);

    let audioKey: AudioKey;

    switch (tapeColor) {
      case TapeColor.red:
        audioKey = AudioKey.BERSERKER_SONG;
        break;
      case TapeColor.green:
        audioKey = AudioKey.MEDITATION_SONG;
        break;
      case TapeColor.white:
        audioKey = AudioKey.ANGEL_SONG;
        break;
      case TapeColor.blue:
        audioKey = AudioKey.FOCUSED_SONG;
        break;
      case TapeColor.black:
        audioKey = AudioKey.DARK_SONG;
        break;
    }

    this.tapeSong = this.sound.add(audioKey);
    this.tapeSong.on(PhaserEvent.COMPLETE, this.backToDefaultSong, this);
    this.tapeSong.play();
  }

  backToDefaultSong(): void {
    this.defaultSong.resume();
    this.melodis.turnOffSongEffects();
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

  collectTape(_: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, tapeSprite: Phaser.Physics.Arcade.Image): void {
    const tape = this.tapes.find((t) => t.sprite === tapeSprite);

    tapeSprite.disableBody(true, true);
    eventsCenter.emit(Event.TAPE_COLLECTED, tape.color);
  }
  //this.scene.sound.pauseAll();
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
      { x: 400, y: 550, color: TapeColor.red },
      { x: 50, y: 210, color: TapeColor.blue },
      { x: 750, y: 190, color: TapeColor.white },
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

    if (time < this.keyPressLockedUntil) return;

    const t = this.keys.t.isDown,
      i = this.keys.i.isDown;

    if (t || i) {
      this.keyPressLockedUntil = time + this.intervalKeyPress;
    }

    if (t) {
      if (this.tapeSelectionActivated) {
        eventsCenter.emit(Event.DEACTIVATE_TAPE_SELECTION);

        this.tapeSelectionActivated = false;

        this.melodis.sprite.enableBody(false, this.melodis.sprite.x, this.melodis.sprite.y, true, true);
      } else {
        eventsCenter.emit(Event.ACTIVATE_TAPE_SELECTION);

        this.tapeSelectionActivated = true;

        this.melodis.sprite.disableBody();
      }
    }
  }
}
