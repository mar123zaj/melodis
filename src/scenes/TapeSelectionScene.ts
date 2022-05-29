import { TapeColor } from '../enums/color.enum';
import ImageKey from '../enums/image-key.enum';
import Event from '../events/event.enum';
import eventsCenter from '../events/EventsCenter';
import TapeSelectionKeys from '../types/tape-selection-keys.type';

export default class TapeSelectionScene extends Phaser.Scene {
  isActive = false;

  private tapesColorsCollected = [TapeColor.blue, TapeColor.red, TapeColor.green, TapeColor.white, TapeColor.black];
  private keys: TapeSelectionKeys;
  private container: Phaser.GameObjects.Container;
  private intervalKeyPress = 300;
  private keyPressLockedUntil = 0;
  private tapesContainers: Phaser.GameObjects.Container[];
  private selectedTapeContainerIndex = 4;

  constructor() {
    super('TapeSelectionScene');
  }

  create(): void {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    }) as TapeSelectionKeys;

    const { height } = this.game.renderer;

    const tapesImages: Phaser.GameObjects.Image[] = [];
    const tapesContainers: Phaser.GameObjects.Container[] = [];
    let y = 0;

    for (const color in TapeColor) {
      const collectedTapeColorAmount = this.countCollectedTapesByColor(color as TapeColor);

      const tapeIconImage = this.add.image(0, 0, `${color}_${ImageKey.ICON_TAPE}`).setAlpha(0.5);
      const tapeColorAmountText = this.add.dynamicBitmapText(20, 0, 'default', 'x0', 8).setAlpha(0.5);

      if (collectedTapeColorAmount) {
        tapeColorAmountText.setText(`x${collectedTapeColorAmount}`);
      }

      tapesImages.push(tapeIconImage);

      const tapeContainer = this.add.container(0, y, [tapeIconImage, tapeColorAmountText]);
      tapesContainers.push(tapeContainer);

      y -= 25;
    }

    this.tapesContainers = tapesContainers;
    this.container = this.add.container(25, height - 45, tapesContainers);

    eventsCenter.on(Event.ACTIVATE_TAPE_SELECTION, this.activate, this);
    eventsCenter.on(Event.DEACTIVATE_TAPE_SELECTION, this.deactivate, this);
    eventsCenter.on(Event.TAPE_COLLECTED, this.tapeCollected, this);
  }

  private countCollectedTapesByColor(tapeColor: TapeColor): number {
    return this.tapesColorsCollected.filter((collectedTapeColor) => collectedTapeColor === tapeColor).length;
  }

  tapeCollected(tapeColor: TapeColor): void {
    this.tapesColorsCollected.push(tapeColor);
    const tapeContainerIndex = this.getTapeContainerIndexByColor(tapeColor);
    const tapeContainer = this.tapesContainers[tapeContainerIndex];

    const tapeContainerText = tapeContainer.getAt(1) as Phaser.GameObjects.DynamicBitmapText;
    const collectedTapeColorAmount = this.countCollectedTapesByColor(tapeColor);

    tapeContainerText.setText(`x${collectedTapeColorAmount}`);
  }

  private getTapeContainerIndexByColor(tapeColor: TapeColor): number {
    let tapeContainerIndex = 0;
    for (const color in TapeColor) {
      if (tapeColor === color) {
        return tapeContainerIndex;
      }

      tapeContainerIndex++;
    }
  }

  private getTapeContainerColorByIndex(index: number): TapeColor {
    let loopIndex = 0;
    for (const color in TapeColor) {
      if (index === loopIndex) {
        return color as TapeColor;
      }

      loopIndex++;
    }
  }

  activate(): void {
    const selectedTapeContainer = this.tapesContainers[this.selectedTapeContainerIndex];

    const containerElements = selectedTapeContainer.getAll();
    containerElements.forEach((element) =>
      (element as Phaser.GameObjects.DynamicBitmapText | Phaser.GameObjects.Image).setAlpha(1),
    );

    this.isActive = true;
  }

  deactivate(): void {
    this.deactivateTapeContainerByIndex(this.selectedTapeContainerIndex);

    this.isActive = false;
  }

  activateTapeContainerByIndex(index: number): void {
    const container = this.tapesContainers[index];

    const containerElements = container.getAll();
    containerElements.forEach((element) =>
      (element as Phaser.GameObjects.DynamicBitmapText | Phaser.GameObjects.Image).setAlpha(1),
    );
  }

  deactivateTapeContainerByIndex(index: number): void {
    const container = this.tapesContainers[index];

    const containerElements = container.getAll();
    containerElements.forEach((element) =>
      (element as Phaser.GameObjects.DynamicBitmapText | Phaser.GameObjects.Image).setAlpha(0.5),
    );
  }

  update(time: number): void {
    if (!this.isActive) return;

    if (time < this.keyPressLockedUntil) return;

    const up = this.keys.up.isDown,
      down = this.keys.down.isDown,
      enter = this.keys.enter.isDown;

    if (up || down || enter) {
      this.keyPressLockedUntil = time + this.intervalKeyPress;
    }

    if (up) {
      const newSelectedTapeContainerIndex = this.selectedTapeContainerIndex + 1;

      if (newSelectedTapeContainerIndex >= this.tapesContainers.length) return;

      const oldSelectedTapeContainerIndex = this.selectedTapeContainerIndex;

      this.deactivateTapeContainerByIndex(oldSelectedTapeContainerIndex);
      this.activateTapeContainerByIndex(newSelectedTapeContainerIndex);

      this.selectedTapeContainerIndex = newSelectedTapeContainerIndex;
    } else if (down) {
      const newSelectedTapeContainerIndex = this.selectedTapeContainerIndex - 1;

      if (newSelectedTapeContainerIndex < 0) return;

      const oldSelectedTapeContainerIndex = this.selectedTapeContainerIndex;

      this.deactivateTapeContainerByIndex(oldSelectedTapeContainerIndex);
      this.activateTapeContainerByIndex(newSelectedTapeContainerIndex);

      this.selectedTapeContainerIndex = newSelectedTapeContainerIndex;
    } else if (enter) {
      const tapeColor = this.getTapeContainerColorByIndex(this.selectedTapeContainerIndex);
      const tapesColorAmount = this.countCollectedTapesByColor(tapeColor);

      if (tapesColorAmount <= 0) return;
      const selectedContainer = this.tapesContainers[this.selectedTapeContainerIndex];

      const tapeContainerText = selectedContainer.getAt(1) as Phaser.GameObjects.DynamicBitmapText;
      const collectedTapeColorAmount = this.countCollectedTapesByColor(tapeColor);

      const newCollectedTapeColorAmount = collectedTapeColorAmount - 1;

      const tapeColorIndex = this.tapesColorsCollected.findIndex(
        (tapeColorCollected) => tapeColorCollected === tapeColor,
      );
      this.tapesColorsCollected.splice(tapeColorIndex, 1);

      tapeContainerText.setText(`x${newCollectedTapeColorAmount}`);
      this.deactivate();
      eventsCenter.emit(Event.RUN_TAPE, tapeColor);
    }
  }
}
