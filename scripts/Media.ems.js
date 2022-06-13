class Media {
  constructor() {
    this._backgroundImage = null;
    this._diamondsSprite = null;
    this.musicVolume = 0.3;
    this.soundVolume = 0.5;
    this.alloweMusic = true;
    this.alloweSound = true;
    this._swapSound = null;
    this._backgroundMusic = null;
    this.isInLevel = false;
  }
  increaseMusicVolume() {
    this.musicVolume += 0.1;
    if (this.musicVolume > 1) {
      this.musicVolume = 1;
    }

    this._backgroundMusic.volume = this.musicVolume;
  }
  decreaseMusicVolume() {
    this.musicVolume -= 0.1;
    if (this.musicVolume < 0) {
      this.musicVolume = 0;
    }

    this._backgroundMusic.volume = this.musicVolume;
  }
  increaseSoundVolume() {
    this.soundVolume += 0.1;
    if (this.soundVolume > 1) {
      this.soundVolume = 1;
    }

    this._swapSound.volume = this.soundVolume;
  }
  decreaseSoundVolume() {
    this.soundVolume -= 0.1;
    if (this.soundVolume < 0) {
      this.soundVolume = 0;
    }

    this._swapSound.volume = this.soundVolume;
  }

  playBackgroundMusic() {
    if (!this.alloweMusic) {
      return;
    }
    this._backgroundMusic.loop = true;
    this._backgroundMusic.play();
  }

  stopBackgroundMusic() {
    this._backgroundMusic.pause();
  }

  playSwapSound() {
    if (this.alloweSound) {
      return;
    }
    this._swapSound.play();
  }

  set swapSound(sound) {
    this._swapSound = sound;
    this._swapSound.volume = this.soundVolume;
  }

  set backgroundMusic(music) {
    this._backgroundMusic = music;
    this._backgroundMusic.volume = this.musicVolume;
  }

  get swapSound() {
    return !!this._swapSound;
  }
  get backgroundMusic() {
    return !!this._backgroundMusic;
  }

  set backgroundImage(imageObject) {
    if (!imageObject instanceof Image) {
      return;
    }

    this._backgroundImage = imageObject;
  }
  get backgroundImage() {
    return this._backgroundImage;
  }

  set diamondsSprite(imageObject) {
    if (!imageObject instanceof Image) {
      return;
    }

    this._diamondsSprite = imageObject;
  }
  get diamondsSprite() {
    return this._diamondsSprite;
  }
  toggleMusicOnOf() {
    if (this.alloweMusic) {
      this.alloweMusic = false;
      this.stopBackgroundMusic();
    } else {
      this.alloweMusic = true;
      this.playBackgroundMusic();
    }
  }
}

export const media = new Media();
