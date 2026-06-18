import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        // 1. Inicializar Estados (Valores de 0 a 100)
        this.stats = {
            hambre: 70,
            sed: 60,
            felicidad: 50
        };

        // 2. Fondo y Textos UI
        this.add.text(512, 40, 'TvGoshi - Cuida a tu Dinosaurio', { fontSize: '28px', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(512, 80, 'Escanea códigos con tu lector HID: CARNE, AGUA, ENSALADA, PELOTA', { fontSize: '16px', fill: '#aaaaaa' }).setOrigin(0.5);

        // Crear textos visuales para los estados
        this.uiTexts = {
            hambre: this.add.text(100, 150, '', { fontSize: '20px', fill: '#ff4d4d', fontWeight: 'bold' }),
            sed: this.add.text(100, 200, '', { fontSize: '20px', fill: '#3399ff', fontWeight: 'bold' }),
            felicidad: this.add.text(100, 250, '', { fontSize: '20px', fill: '#cc33ff', fontWeight: 'bold' })
        };

        // Texto flotante para logear el último escaneo
        this.logText = this.add.text(512, 600, 'Esperando escaneo...', { fontSize: '22px', fill: '#00ff00' }).setOrigin(0.5);

        // 3. Crear e iniciar al Dinosaurio
        this.dino = this.add.sprite(512, 400, 'dino').setScale(5); // Escalado para que se vea grande
        this.dino.play('idle');

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
        this.input.keyboard.on('keydown', (event) => {
            // Los lectores HID terminan el envío con la tecla "Enter"
            if (event.key === 'Enter') {
                if (this.barcodeBuffer.length > 0) {
                    this.processBarcode(this.barcodeBuffer.toUpperCase().trim());
                    this.barcodeBuffer = ''; // Limpiar buffer
                }
            } else if (event.key.length === 1) {
                // Ir acumulando caracteres imprimibles
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
    }

    // Actualiza los textos en pantalla
    updateUI() {
        this.uiTexts.hambre.setText(`Hambre: ${this.stats.hambre}% ${this.stats.hambre < 30 ? '⚠️' : '🍖'}`);
        this.uiTexts.sed.setText(`Sed: ${this.stats.sed}% ${this.stats.sed < 30 ? '⚠️' : '💧'}`);
        this.uiTexts.felicidad.setText(`Felicidad: ${this.stats.felicidad}% ${this.stats.felicidad < 30 ? '⚠️' : '⚽'}`);
    }

    // Procesa el código recibido por el lector HID
    processBarcode(code) {
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
                break;
            case 'ENSALADA':
                this.stats.hambre = Math.min(100, this.stats.hambre + 15);
                this.stats.felicidad = Math.min(100, this.stats.felicidad + 10);
                this.dino.play('eating');
                break;
            case 'AGUA':
                this.stats.sed = Math.min(100, this.stats.sed + 35);
                this.dino.play('drinking');
                break;
            case 'PELOTA':
                this.stats.felicidad = Math.min(100, this.stats.felicidad + 40);
                this.dino.play('playing');
                break;
            default:
                this.logText.setText(`Código desconocido: ${code}`);
                break;
        }

        this.updateUI();
    }
}