import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Cargar imagen de fondo
        this.load.image('background', 'assets/BG_Selva.png');

        // Música
        this.load.audio('bgmusic', 'assets/audio/bg_jungle.mp3');

        // Efectos
        this.load.audio('angrySound', 'assets/audio/angry_jungle.mp3');
        this.load.audio('sadSound', 'assets/audio/cry_jungle.mp3');
        this.load.audio('drinkSound', 'assets/audio/drink_jungle.mp3');
        this.load.audio('eatSound', 'assets/audio/eat_jungle.mp3');
        this.load.audio('sleepSound', 'assets/audio/snoring_jungle.mp3');

        // Cargar el spritesheet normalizado del dino (grid uniforme)
        this.load.spritesheet('dino', 'assets/Spritesheet_Dino_LTE.png', {
            frameWidth: 160,
            frameHeight: 160
        });

        // Barra de carga visual básica
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    create() {
        // Fila 0 — IDLE (frames 0-7)
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1,
            yoyo: true
        });

        // Fila 1 — EATING (frames 8-15)
        this.anims.create({
            key: 'eating',
            frames: this.anims.generateFrameNumbers('dino', { start: 8, end: 15 }),
            frameRate: 8,
            repeat: 0
        });

        // Fila 2 — DRINKING (frames 16-23)
        this.anims.create({
            key: 'drinking',
            frames: this.anims.generateFrameNumbers('dino', { start: 16, end: 23 }),
            frameRate: 8,
            repeat: 0
        });

        // Fila 3 — SLEEPING (frames 24-31)
        this.anims.create({
            key: 'sleeping',
            frames: this.anims.generateFrameNumbers('dino', { start: 24, end: 31 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        // Fila 4 — HAPPY (frames 32-39)
        this.anims.create({
            key: 'happy',
            frames: this.anims.generateFrameNumbers('dino', { start: 32, end: 39 }),
            frameRate: 10,
            repeat: 2
        });

        // Fila 5 — SURPRISE (frames 40-47)
        this.anims.create({
            key: 'surprise',
            frames: this.anims.generateFrameNumbers('dino', { start: 40, end: 47 }),
            frameRate: 10,
            repeat: 0
        });

        // Fila 6 — ANGRY (frames 48-55)
        this.anims.create({
            key: 'angry',
            frames: this.anims.generateFrameNumbers('dino', { start: 48, end: 55 }),
            frameRate: 10,
            repeat: -1,
            yoyo: true
        });

        // Fila 7 — RUNNING (frames 56-63)
        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('dino', { start: 56, end: 63 }),
            frameRate: 12,
            repeat: -1
        });

        // Fila 8 — THIRSTY (frames 64-71)
        this.anims.create({
            key: 'thirsty',
            frames: this.anims.generateFrameNumbers('dino', { start: 64, end: 71 }),
            frameRate: 6,
            repeat: -1,
            yoyo: true
        });

        // Fila 9 — HUNGRY (frames 72-79)
        this.anims.create({
            key: 'hungry',
            frames: this.anims.generateFrameNumbers('dino', { start: 72, end: 79 }),
            frameRate: 6,
            repeat: -1
        });

        // Fila 10 — SAD (frames 80-87)
        this.anims.create({
            key: 'sad',
            frames: this.anims.generateFrameNumbers('dino', { start: 80, end: 87 }),
            frameRate: 4,
            repeat: -1,
            yoyo: true
        });

        // Avanzar a la escena de gameplay
        this.scene.start('Game');
    }
}