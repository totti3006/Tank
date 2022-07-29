import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import HudScene from './scenes/HudScene'
import { MenuScene } from './scenes/MenuScene'
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Tank',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
    width: 1600,
    height: 1200
  },
  type: Phaser.AUTO,
  parent: 'game',
  scene: [BootScene, MenuScene, HudScene, GameScene],
  input: {
    gamepad: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  plugins: {
    global: [
      {
        key: 'virtualJoystick',
        plugin: VirtualJoystick,
        start: true
      }
    ]
  },
  backgroundColor: '#000000',
  render: { pixelArt: false, antialias: true }
}
