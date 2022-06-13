import { Common, HIDDEN_SCREEN, VISIBLE_SCREEN } from "./Common.esm.js";
import { canvas } from "./Canvas.esm.js";
import { DATALOADED_EVENT_NAME, loading } from "./Loading.esm.js";
import { game } from "./Game.esm.js";
import { media } from "./Media.ems.js";
import { gameLevels } from "./gameLevels.esm.js";
import { userData } from "./UserData.esm.js";

const LEVEL_SELECT_BUTTON_ID = "level-select__button";
const LEVEL_SELECT_ID = "js-level-select-screen";
class LevelSelect extends Common {
  constructor() {
    super(LEVEL_SELECT_ID);
  }
  createButtons() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    gameLevels.some((gameLevels) => this.createButton(gameLevels.level));
  }
  createButton(value) {
    if (!userData.checkAvallabilityLevel(value)) {
      return true;
    }
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add(LEVEL_SELECT_BUTTON_ID);
    button.textContent = value;
    button.value = value;
    button.addEventListener("click", (event) =>
      this.buttonOnClickHanlder(event)
    );
    this.element.appendChild(button);
  }
  buttonOnClickHanlder(event) {
    this.changeVisibilityScreen(this.element, HIDDEN_SCREEN);
    this.changeVisibilityScreen(canvas.element, VISIBLE_SCREEN);
    this.loadLevel(event.currentTarget.value);
  }
  loadLevel(level) {
    if (
      media.backgroundImage &&
      media.diamondsSprite &&
      media.backgroundMusic &&
      media.swapSound
    ) {
      window.addEventListener(DATALOADED_EVENT_NAME, () => {
        game.playLevel(level);
        return;
      });
    }
    if (!media.diamondsSprite) {
      media.diamondsSprite = loading.loadImage(
        "images/diamonds-transparent.png"
      );
    }
    if (!media.backgroundImage) {
      media.backgroundImage = loading.loadImage("images/levelbackground.png");
    }
    if (!media.swapSound) {
      media.swapSound = loading.loadSound(
        "sounds/stone_rock_or_wood_moved.mp3"
      );
    }
    if (!media.backgroundMusic) {
      media.backgroundMusic - loading.loadSound("sounds/music-background.mp3");
    }

    window.addEventListener(DATALOADED_EVENT_NAME, () => {
      game.playLevel(level);
    });
  }
}
export const levelSelect = new LevelSelect();
