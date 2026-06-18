import { Game as GameScene } from './game/scenes/Game';
import { Preloader } from './game/scenes/Preloader';
import * as Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1a1a1a',
    scene: [
        Preloader,
        GameScene
    ]
};

export default new Phaser.Game(config);