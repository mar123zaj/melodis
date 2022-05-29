import { Color } from '../enums/color.enum';
import ImageKey from '../enums/image-key.enum';
import Events from '../events/events.enum';
import eventsCenter from '../events/EventsCenter';
import TapeSelectionKeys from '../types/tape-selection-keys.type';

export default class TapeSelectionScene extends Phaser.Scene {
  isActive = false;

  private tapesColors = [Color.black, Color.yellow, Color.black, Color.black, Color.black];
  private keys: TapeSelectionKeys;
  private container: Phaser.GameObjects.Container;
  private intervalKeyPress = 650;
  private keyPressLockedUntil = 0;
  private tapesContainers: Phaser.GameObjects.Container[];
  private selectedTapeContainerIndex = 5;

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
    for (const color in Color) {
      console.log({ color });

      const countAmount = this.tapesColors.filter((tapeColor) => tapeColor === color).length;

      const tapeIconImage = this.add.image(0, 0, `${color}_${ImageKey.ICON_TAPE}`).setAlpha(0.5);
      const tapeColorAmountText = this.add.dynamicBitmapText(20, 0, 'default', 'x0', 8).setAlpha(0.5);

      if (countAmount) {
        tapeColorAmountText.setText(`x${countAmount}`);
      }

      tapesImages.push(tapeIconImage);

      const tapeContainer = this.add.container(0, y, [tapeIconImage, tapeColorAmountText]);
      tapesContainers.push(tapeContainer);

      y -= 25;
    }

    this.tapesContainers = tapesContainers;
    this.container = this.add.container(75, height - 50, tapesContainers);

    eventsCenter.on(Events.ACTIVATE_TAPE_SELECTION, this.activate, this);
    eventsCenter.on(Events.DEACTIVATE_TAPE_SELECTION, this.deactivate, this);
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
      const selectedContainer = this.tapesContainers[this.selectedTapeContainerIndex];
      console.log({ selectedContainer });
    }
  }
}
