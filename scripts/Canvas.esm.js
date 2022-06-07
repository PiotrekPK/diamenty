import { Common } from "./Common.esm.js";
import { media } from "./Media.ems.js";

const GAME_SCREEN_ID = "js-game-screen";

export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;

class Canvas extends Common {
  constructor() {
    super(GAME_SCREEN_ID);
    this.cinfigureCanvas();
  }

  cinfigureCanvas() {
    this.centext = this.element.getContext("2d");
    this.centext.canvas.width = CANVAS_WIDTH;
    this.centext.canvas.height = CANVAS_HEIGHT;
    this.centext.font = "20px Arial white";
    this.centext.fillStyle = "white";
  }
  drawGameOnCanvas(gameState) {
    this.drawBackground();
    this.drawPointsToWin(gameState.pointsToWin);
    this.drowPlayersPoints(gameState.getPlayerPoints());
    this.drawLeftMovement(gameState.getLeftMovement());
  }

  drawBackground() {
    this.centext.drawImage(media.backgroundImage, 0, 0);
  }
  drawPointsToWin(pointsToWin) {
    this.centext.fillText(`${pointsToWin}`, 520, 92);
  }
  drowPlayersPoints(PlayerPoinds) {
    this.centext.fillText(`${PlayerPoinds}`, 520, 162);
  }
  drawLeftMovement(LeftMovement) {
    this.centext.fillText(`${LeftMovement}`, 520, 234);
  }
}
export const canvas = new Canvas();
