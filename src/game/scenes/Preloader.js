import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Generar la textura en memoria
        this.createDinoSpritesheet();
        
        // Barra de carga visual básica
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    create() {
        // En Phaser 4, podemos generar los frames pasando directamente el total o la configuración básica
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'eating',
            frames: this.anims.generateFrameNumbers('dino', { start: 2, end: 3 }),
            frameRate: 6,
            repeat: 2
        });

        this.anims.create({
            key: 'drinking',
            frames: this.anims.generateFrameNumbers('dino', { start: 4, end: 5 }),
            frameRate: 6,
            repeat: 2
        });

        this.anims.create({
            key: 'playing',
            frames: this.anims.generateFrameNumbers('dino', { start: 6, end: 7 }),
            frameRate: 8,
            repeat: 3
        });

        // Avanzar a la escena de gameplay
        this.scene.start('Game');
    }

    createDinoSpritesheet() {
        const canvas = document.createElement('canvas');
        canvas.width = 256; // 8 frames de 32px
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        const colors = [
            '#4CAF50', '#45A049', // Idle (Verde)
            '#FF5722', '#E64A19', // Eating (Naranja)
            '#2196F3', '#1976D2', // Drinking (Azul)
            '#9C27B0', '#7B1FA2'  // Playing (Morado)
        ];

        colors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.fillRect(i * 32 + 4, 8, 24, 20); // Cuerpo
            ctx.fillRect(i * 32 + 12, 2, 14, 10); // Cabeza
            ctx.fillStyle = '#000000';
            ctx.fillRect(i * 32 + 20, 4, 2, 2); // Ojo
            ctx.fillStyle = color;
            if (i % 2 === 0) {
                ctx.fillRect(i * 32 + 8, 28, 4, 4);
                ctx.fillRect(i * 32 + 20, 28, 4, 4);
            } else {
                ctx.fillRect(i * 32 + 6, 28, 4, 4);
                ctx.fillRect(i * 32 + 18, 28, 4, 4);
            }
        });

        // CAMBIO PHASER 4: Se usa 'addSpriteSheet' con 'S' mayúscula
        this.textures.addSpriteSheet('dino', canvas, { frameWidth: 32, frameHeight: 32 });
    }
}