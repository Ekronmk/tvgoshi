import '../public/style.css';
import { Game as GameScene } from './game/scenes/Game';
import { Preloader } from './game/scenes/Preloader';
import * as Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'game-container',
        expandParent: true,
        width: window.innerWidth,
        height: window.innerHeight
    },
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [
        Preloader,
        GameScene
    ]
};

export default window.game = new Phaser.Game(config);