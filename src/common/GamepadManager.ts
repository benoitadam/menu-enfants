const rAF: (callback: FrameRequestCallback) => number =
  (window as any).mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

export default class GamepadManager {
  onButtonChanged: (gamepadId: string, buttonId: number, value: number) => void;

  scanInterval: any;
  gamepads: { [gamepadId: number]: Gamepad } = {};
  buttons: { [gamepadId: number]: { [buttonId: number]: number } } = {};
  
  constructor() {
    if ('GamepadEvent' in window) {
      addEventListener('gamepadconnected', this.connectHandler);
      addEventListener('gamepaddisconnected', this.disconnectHandler);
    } else {
      this.scanInterval = setInterval(() => this.scangamepads(), 500);
    }
  }

  dispose() {
    removeEventListener('gamepadconnected', this.connectHandler);
    removeEventListener('gamepaddisconnected', this.disconnectHandler);
    clearInterval(this.scanInterval);
  }

  private connectHandler = (e: GamepadEvent) => {
    this.addgamepad(e.gamepad);
  }

  private disconnectHandler = (e: GamepadEvent) => {
    this.removegamepad(e.gamepad);
  }

  private updateHandler = () => {
    this.scangamepads();
  
    for (const gamepadId in this.gamepads) {
      if (!this.gamepads.hasOwnProperty(gamepadId)) {
        continue;
      }

      const controller = this.gamepads[gamepadId];

      for (let buttonId = 0; buttonId < controller.buttons.length; buttonId++) {
        const value = controller.buttons[buttonId].value;

        if (this.buttons[gamepadId][buttonId] !== value) {
          const prev = this.buttons[gamepadId][buttonId];
          this.buttons[gamepadId][buttonId] = value;

          if (prev !== undefined && this.onButtonChanged) {
            console.log('onButtonChanged', gamepadId, buttonId, value);
            this.onButtonChanged(gamepadId, buttonId, value);
          }
        }
      }
    }
    
    rAF(this.updateHandler);
  }

  private scangamepads() {
    const gamepads: Gamepad[] = navigator.getGamepads ? navigator.getGamepads() :
      ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads() : []);
    
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        if (!(gamepads[i].index in this.gamepads)) {
          this.addgamepad(gamepads[i]);
        } else {
          this.gamepads[gamepads[i].index] = gamepads[i];
        }
      }
    }
  }

  private addgamepad(gamepad: Gamepad) {
    console.log('addgamepad', gamepad);
    this.gamepads[gamepad.index] = gamepad;
    this.buttons[gamepad.index] = {};
    rAF(this.updateHandler);
  }
  
  private removegamepad(gamepad: Gamepad) {
    delete this.gamepads[gamepad.index];
    delete this.buttons[gamepad.index];
  }

}