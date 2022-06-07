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
    media.diamondsSprite = loading.loadImage("images/diamonds-transparent.png");
    media.backgroundImage = loading.loadImage("images/levelbackground.png");
    window.addEventListener(DATALOADED_EVENT_NAME, () => {
      game.playLevel(level);
    });
  }
}
export const levelSelect = new LevelSelect();