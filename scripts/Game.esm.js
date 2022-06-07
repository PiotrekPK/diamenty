import { canvas } from "./Canvas.esm.js";
import { Common, VISIBLE_SCREEN } from "./Common.esm.js";
import { Diamond, NUMBER_OF_DIAMONDS_TYPE } from "./Diamond.esm.js";
import {
  DIAMOND_SIZE,
  EMPTY_BLOCK,
  gameLevels,
  GAME_BOARD_X_OFFSET,
  GAME_BOARD_Y_OFFSET,
} from "./gameLevels.esm.js";
import { DATALOADED_EVENT_NAME, loading } from "./Loading.esm.js";
import { media } from "./Media.ems.js";
import { GameState } from "./GameState.esm.js";
import { mouseControler } from "./MouseController.ems.js";
import { resultScreen } from "./ResultScreen.esm.js";
import { userData } from "./UserData.esm.js";
const DIAMOND_ARRAY_WIDTH = 8;
const DIAMONDS_ARRAY_HEIGHT = DIAMOND_ARRAY_WIDTH + 1;
const LAST_ELEMENT_DIAMONDS_ARRAY =
  DIAMOND_ARRAY_WIDTH * DIAMONDS_ARRAY_HEIGHT - 1;

const SWAPING_SPEED = 8;
const TRANSPARENCY_SPEED = 10;
class Game extends Common {
  constructor() {
    super();
  }
  playLevel(level) {
    const { numberOfMovement, pointsToWin, board } = gameLevels[level - 1];
    window.removeEventListener(DATALOADED_EVENT_NAME, this.playLevel);
    this.gameState = new GameState(
      level,
      numberOfMovement,
      pointsToWin,
      board,
      media.diamondsSprite
    );
    this.changeVisibilityScreen(canvas.element, VISIBLE_SCREEN);
    this.diamond = new Diamond(50, 50, 1, 1, 2, media.diamondsSprite);

    this.animate();
  }
  animate() {
    this.handleMouseState();
    this.handleMouseClick();
    this.findMatches();
    this.moveDiamonds();
    this.hideAnimation();
    this.countScors();
    this.revertSwap();
    this.clearMatched();
    canvas.drawGameOnCanvas(this.gameState);
    this.gameState.getGameBoard().forEach((diamond) => diamond.draw());
    this.checkEndGame();
  }
  handleMouseState() {
    if (
      mouseControler.clicked &&
      !this.gameState.getIsSwaping() &&
      !this.gameState.getIsMoving()
    ) {
      mouseControler.state++;
    }
  }
  handleMouseClick() {
    if (!mouseControler.clicked) {
      return;
    }
    const xClicked = Math.floor(
      (mouseControler.x - GAME_BOARD_X_OFFSET) / DIAMOND_SIZE
    );
    const yClicked = Math.floor(
      (mouseControler.y - GAME_BOARD_Y_OFFSET) / DIAMOND_SIZE
    );

    if (
      !yClicked ||
      xClicked >= DIAMOND_ARRAY_WIDTH ||
      yClicked >= DIAMONDS_ARRAY_HEIGHT
    ) {
      mouseControler.state = 0;
      return;
    }
    if (mouseControler.state === 1) {
      mouseControler.firstClick = {
        x: xClicked,
        y: yClicked,
      };
    } else if (mouseControler.state === 2);
    {
      mouseControler.secoundClick = {
        x: xClicked,
        y: yClicked,
      };
      mouseControler.state === 2;
      if (
        Math.abs(mouseControler.firstClick.x - mouseControler.secoundClick.x) +
          Math.abs(
            mouseControler.firstClick.y - mouseControler.secoundClick.y
          ) !==
        1
      ) {
        return;
      }
      this.swapDiamonds();
      this.gameState.setIsSwaping(true);
      this.gameState.decreasePointsMovement();
      mouseControler.state = 0;
    }
    mouseControler.clicked = false;
  }
  findMatches() {
    this.gameState.getGameBoard().forEach((diamond, index, diamonds) => {
      if (
        diamond.kind === EMPTY_BLOCK ||
        index < DIAMOND_ARRAY_WIDTH ||
        index === LAST_ELEMENT_DIAMONDS_ARRAY
      ) {
        return;
      }

      if (
        diamonds[index - 1].kind === diamond.kind &&
        diamonds[index + 1].kind === diamond.kind
      ) {
        if (
          Math.floor((index - 1) / DIAMOND_ARRAY_WIDTH) ===
          Math.floor((index + 1) / DIAMOND_ARRAY_WIDTH)
        ) {
          for (let i = -1; i <= 1; i++) {
            diamonds[index + i].match++;
          }
        }
      }
      if (
        index >= DIAMOND_ARRAY_WIDTH &&
        index < LAST_ELEMENT_DIAMONDS_ARRAY - DIAMOND_ARRAY_WIDTH + 1 &&
        diamonds[index - DIAMOND_ARRAY_WIDTH].kind === diamond.kind &&
        diamonds[index + DIAMOND_ARRAY_WIDTH].kind === diamond.kind
      ) {
        if (
          (index - DIAMOND_ARRAY_WIDTH) % DIAMOND_ARRAY_WIDTH ===
          (index + DIAMOND_ARRAY_WIDTH) % DIAMOND_ARRAY_WIDTH
        ) {
          for (
            let i = -DIAMOND_ARRAY_WIDTH;
            i <= DIAMOND_ARRAY_WIDTH;
            i += DIAMOND_ARRAY_WIDTH
          ) {
            diamonds[index + i].match++;
          }
        }
      }
    });
  }

  swapDiamonds() {
    const firstDiamond =
      mouseControler.firstClick.y * DIAMOND_ARRAY_WIDTH +
      mouseControler.firstClick.x;
    const secoundDiamond =
      mouseControler.secoundClick.y * DIAMOND_ARRAY_WIDTH +
      mouseControler.secoundClick.x;

    this.swap(
      this.gameState.getGameBoard()[firstDiamond],
      this.gameState.getGameBoard()[secoundDiamond]
    );
  }
  moveDiamonds() {
    this.gameState.setIsMoving(false);
    this.gameState.getGameBoard().forEach((diamond) => {
      let dx;
      let dy;
      for (let speedswap = 0; speedswap < SWAPING_SPEED; speedswap++) {
        dx = diamond.x - diamond.row * DIAMOND_SIZE;
        dy = diamond.y - diamond.column * DIAMOND_SIZE;

        if (dx) {
          diamond.x -= dx / Math.abs(dx);
        }
        if (dy) {
          diamond.y -= dy / Math.abs(dy);
        }
      }
      if (dx || dy) {
        this.gameState.setIsMoving(true);
      }
    });
  }

  hideAnimation() {
    if (this.gameState.getIsMoving()) {
      return;
    }
    this.gameState.getGameBoard().forEach((diamond) => {
      if (diamond.match && diamond.alpha > TRANSPARENCY_SPEED) {
        diamond.alpha -= TRANSPARENCY_SPEED;
        this.gameState.setIsMoving(true);
      }
    });
  }

  countScors() {
    this.scores = 0;
    this.gameState
      .getGameBoard()
      .forEach((diamond) => (this.scores += diamond.match));
    if (!this.gameState.getIsMoving() && this.scores) {
      this.gameState.increasePlayerPoints(this.scores);
    }
  }

  revertSwap() {
    if (this.gameState.getIsSwaping() && !this.gameState.getIsMoving()) {
      if (!this.scores) {
        this.swapDiamonds();
        this.gameState.increasePointsMovement();
      }
      this.gameState.setIsSwaping(false);
    }
  }

  clearMatched() {
    if (this.gameState.getIsMoving()) {
      return;
    }

    this.gameState.getGameBoard().forEach((_, idx, diamonds) => {
      const index = diamonds.length - 1 - idx;
      const column = Math.floor(index / DIAMOND_ARRAY_WIDTH);
      const row = Math.floor(index % DIAMOND_ARRAY_WIDTH);

      if (diamonds[index].match) {
        for (let counter = column; counter >= 0; counter--) {
          if (!diamonds[counter * DIAMOND_ARRAY_WIDTH + row].match) {
            this.swap(
              diamonds[counter * DIAMOND_ARRAY_WIDTH + row],
              diamonds[index]
            );
            break;
          }
        }
      }
    });

    this.gameState.getGameBoard().forEach((diamond, index) => {
      const row = Math.floor(index % DIAMOND_ARRAY_WIDTH) * DIAMOND_SIZE;

      if (index < DIAMOND_ARRAY_WIDTH) {
        diamond.kind = EMPTY_BLOCK;
        diamond.match = 0;
      } else if (diamond.match || diamond.kind === EMPTY_BLOCK) {
        diamond.kind = Math.floor(Math.random() * NUMBER_OF_DIAMONDS_TYPE);
        diamond.y = 0;
        diamond.x = row;
        diamond.match = 0;
        diamond.alpha = 255;
      }
    });
  }
  checkEndGame() {
    if (
      !this.gameState.getLeftMovement() &&
      !this.gameState.getIsMoving() &&
      !this.gameState.getIsSwaping()
    ) {
      const isPlayerWinner = this.gameState.isPlayerWinner();
      const currentLevel = Number(this.gameState.level);
      if (isPlayerWinner && gameLevels[this.gameState.level]) {
        if (!userData.checkAvallabilityLevel(currentLevel + 1)) {
          userData.addNewLevel(currentLevel + 1);
        }
      }
      if (
        userData.getHightScores(currentLevel) < this.gameState.getPlayerPoints()
      ) {
        userData.setHightScores(currentLevel, this.gameState.getPlayerPoints());
      }

      resultScreen.viewResultScreen(
        isPlayerWinner,
        this.gameState.getPlayerPoints(),
        currentLevel
      );
    } else {
      this.animationFrame = window.requestAnimationFrame(() => this.animate());
    }
  }
  swap(firstDiamond, secoundDiamond) {
    [
      firstDiamond.kind,
      firstDiamond.alpha,
      firstDiamond.match,
      firstDiamond.x,
      firstDiamond.y,
      secoundDiamond.kind,
      secoundDiamond.alpha,
      secoundDiamond.match,
      secoundDiamond.x,
      secoundDiamond.y,
    ] = [
      secoundDiamond.kind,
      secoundDiamond.alpha,
      secoundDiamond.match,
      secoundDiamond.x,
      secoundDiamond.y,
      firstDiamond.kind,
      firstDiamond.alpha,
      firstDiamond.match,
      firstDiamond.x,
      firstDiamond.y,
    ];
    this.gameState.setIsMoving(true);
  }
}
export const game = new Game();
