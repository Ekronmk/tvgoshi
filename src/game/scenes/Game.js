import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        // 0. Agregar fondo estático (pantalla completa)
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0, 0);
        bg.setDepth(-10);
        bg.setScrollFactor(0);
        
        // Escalar el fondo para que ocupe toda la pantalla
        const gameWidth = this.sys.game.scale.width;
        const gameHeight = this.sys.game.scale.height;
        bg.setDisplaySize(gameWidth, gameHeight);
        
        // Actualizar el fondo cuando la ventana se redimensiona
        this.sys.game.scale.on('resize', () => {
            const newWidth = this.sys.game.scale.width;
            const newHeight = this.sys.game.scale.height;
            bg.setDisplaySize(newWidth, newHeight);
        });
        
        // 1. Inicializar Estados (Valores de 0 a 100)
        this.stats = {
            hambre: 70,
            sed: 60,
            felicidad: 50
        };

        // ======================
        // AUDIO
        // ======================

        this.music = this.sound.add('bgmusic', {
            volume: 0.25,
            loop: true
        });

        this.music.play();

        this.sounds = {
            angry: this.sound.add('angrySound', { volume: 0.8 }),
            sad: this.sound.add('sadSound', { volume: 0.8 }),
            drink: this.sound.add('drinkSound', { volume: 0.8 }),
            eat: this.sound.add('eatSound', { volume: 0.8 }),
            sleep: this.sound.add('sleepSound', {
                volume: 0.5,
                loop: true
            })
        };


        // 2. Fondo y Textos UI - Centrados en la pantalla
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;
        
        this.add.text(centerX, 40, 'TvGoshi - Cuida a tu Dinosaurio', { fontSize: '28px', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(centerX, 80, 'Escanea códigos con tu lector HID: CARNE, AGUA, ENSALADA, PELOTA', { fontSize: '16px', fill: '#aaaaaa' }).setOrigin(0.5);

        // Crear textos visuales para los estados
        this.uiTexts = {
            hambre: this.add.text(100, 150, '', { fontSize: '20px', fill: '#ff4d4d', fontWeight: 'bold' }),
            sed: this.add.text(100, 200, '', { fontSize: '20px', fill: '#3399ff', fontWeight: 'bold' }),
            felicidad: this.add.text(100, 250, '', { fontSize: '20px', fill: '#cc33ff', fontWeight: 'bold' })
        };

        // Texto flotante para logear el último escaneo
        this.logText = this.add.text(centerX, gameHeight - 100, 'Esperando escaneo...', { fontSize: '22px', fill: '#00ff00' }).setOrigin(0.5);

        // 3. Crear e iniciar al Dinosaurio en el centro
        const dinoX = gameWidth / 2;
        const dinoY = gameHeight / 2; // Centrado verticalmente
        this.dino = this.add.sprite(dinoX, dinoY, 'dino');
        this.dino.setScale(1.9); // Escala visible y completa
        this.dino.setDepth(1); // Asegurar que esté encima del fondo
        this.dino.play('idle');
        
        // ======================
        // TIMER DE INACTIVIDAD
        // ======================

        this.isSleeping = false;

        this.idleTimer = this.time.addEvent({
            delay: 60000, // 1 minuto
            callback: this.goToSleep,
            callbackScope: this
        });

        // Al terminar una animación de acción, regresa automáticamente a 'idle'
        this.dino.on('animationcomplete', (anim) => {
            if (anim.key !== 'idle') {
                this.dino.play('idle');
            }
        });

        // 4. Loop de reducción de estados (bajan cada 3 segundos)
        this.time.addEvent({
            delay: 3000,
            callback: this.decayStats,
            callbackScope: this,
            loop: true
        });

        // 5. Captura de Lector de Códigos de Barras (Teclado HID)
        this.barcodeBuffer = '';
        window.addEventListener('keydown', (event) => {
        // Ignorar repeticiones automáticas
        if (event.repeat) return;
        if (event.key === 'Enter') {
            const code = this.barcodeBuffer.trim().toUpperCase();
            if (code.length > 0) {
                console.log('CODIGO:', code);
                this.processBarcode(code);
            }
            this.barcodeBuffer = '';
            return;
        }
        if (event.key.length === 1) {
            this.barcodeBuffer += event.key;
        }
    });

        this.updateUI();
    }

    // Reducción paulatina de las estadísticas del dinosaurio
    decayStats() {
        this.stats.hambre = Math.max(0, this.stats.hambre - 5);
        this.stats.sed = Math.max(0, this.stats.sed - 7);
        this.stats.felicidad = Math.max(0, this.stats.felicidad - 4);
        this.updateUI();

        if (this.isSleeping) {
            return;
        }

        if (this.stats.sed <= 10) {

            this.dino.play('thirsty');

            if (!this.sounds.drink.isPlaying) {
                this.sounds.drink.play();
            }

        }
        else if (this.stats.hambre <= 10) {

            this.dino.play('sad');

            if (!this.sounds.sad.isPlaying) {
                this.sounds.sad.play();
            }

        }
        else if (this.stats.felicidad <= 10) {

            this.dino.play('angry');

            if (!this.sounds.angry.isPlaying) {
                this.sounds.angry.play();
            }

        }
        else if (
            this.dino.anims.currentAnim &&
            this.dino.anims.currentAnim.key !== 'idle'
        ) {

            this.dino.play('idle');
        }
    }

    // Actualiza los textos en pantalla
    updateUI() {
        this.uiTexts.hambre.setText(`Hambre: ${this.stats.hambre}% ${this.stats.hambre < 30 ? '⚠️' : '🍖'}`);
        this.uiTexts.sed.setText(`Sed: ${this.stats.sed}% ${this.stats.sed < 30 ? '⚠️' : '💧'}`);
        this.uiTexts.felicidad.setText(`Felicidad: ${this.stats.felicidad}% ${this.stats.felicidad < 30 ? '⚠️' : '⚽'}`);
    }

    resetIdleTimer() {
        this.idleTimer.remove(false);
        this.idleTimer = this.time.addEvent({
            delay: 60000,
            callback: this.goToSleep,
            callbackScope: this
        });

        if (this.isSleeping) {
            this.isSleeping = false;
            this.sounds.sleep.stop();
            this.dino.play('idle');
        }
    }

    goToSleep() {
        this.isSleeping = true;
        this.dino.play('sleeping');
        if (!this.sounds.sleep.isPlaying) {
            this.sounds.sleep.play();
        }
        this.logText.setText('😴 El dinosaurio se quedó dormido');
    }

    

    // Procesa el código recibido por el lector HID
    processBarcode(code) {
        this.resetIdleTimer();
        this.logText.setText(`Código escaneado: ${code}`);
        
        // Feedback visual rápido parpadeando el texto del log
        this.tweens.add({
            targets: this.logText,
            scale: 1.2,
            duration: 100,
            yoyo: true
        });

        switch(code) {
            case 'CARNE':
                this.stats.hambre = Math.min(100, this.stats.hambre + 30);
                this.dino.play('eating');
                this.sounds.eat.play();
                break;
            case 'ENSALADA':
                this.stats.hambre = Math.min(100, this.stats.hambre + 15);
                this.stats.felicidad = Math.min(100, this.stats.felicidad + 10);
                this.dino.play('eating');
                this.sounds.eat.play();
                break;
            case 'AGUA':
                this.stats.sed = Math.min(100, this.stats.sed + 35);
                this.dino.play('drinking');
                this.sounds.drink.play();
                break;
            case 'PELOTA':
                this.stats.felicidad = Math.min(100, this.stats.felicidad + 40);
                this.dino.play('happy');
                break;
            default:
                this.logText.setText(`Código desconocido: ${code}`);
                break;
        }

        this.updateUI();
    }
}