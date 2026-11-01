import Phaser from 'phaser';
import {worldConfig} from "./state/world-config.ts";
import {FarmState} from "./state/farm-state.ts";
import {modelOf} from "./state/equipment.ts";

const MAP_WIDTH = worldConfig.MAP_WIDTH;
const MAP_HEIGHT = worldConfig.MAP_HEIGHT;

const TILE_WIDTH = worldConfig.TILE_WIDTH;
const TILE_HEIGHT = worldConfig.TILE_HEIGHT;

export class FarmScene extends Phaser.Scene{

    private ground!: Phaser.GameObjects.Graphics;
    private debugText!: Phaser.GameObjects.Text;

    private selected?: { x: number, y: number };
    private dragStart?: {
        x: number;
        y: number;
        panX: number;
        panY: number;
    }

    private dragged = false;

    private farm: FarmState = new FarmState();



    private transform = {
        panX: 0,
        panY: 0,
        zoom: 0.5
    }

    constructor(){
        super('Farm');
    }

    create(){
        this.ground = this.add.graphics();

        this.debugText = this.add.text(20, 20, '', { fontSize: '16px', color: '#ffffff', backgroundColor: '#1c332a', padding: { x: 12, y: 10} }).setDepth(10);
        this.debugText.setText('Klicke auf eine Kachel.');

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if(pointer.y < 70) return;

            const startedOnMap = !!this.dragStart;
            this.dragStart = undefined;

            if (!startedOnMap || this.dragged) return;


            const gx = Math.floor((pointer.x - this.transform.panX) / (TILE_WIDTH * this.transform.zoom));
            const gy = Math.floor((pointer.y - this.transform.panY) / (TILE_HEIGHT * this.transform.zoom));

            if (gx < 0 || gy < 0 || gx >= MAP_WIDTH || gy >= MAP_HEIGHT) {
                this.selected = undefined;
                this.debugText.setText('Außerhalb der Karte.');
            } else {
                this.selected = { x: gx, y: gy };
            }

            this.drawMap();
        })

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if(pointer.y < 70) return;

            this.dragStart = {
                x: pointer.x,
                y: pointer.y,
                panX: this.transform.panX,
                panY: this.transform.panY
            }
            this.dragged = false;
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if(!this.dragStart || !pointer.isDown) return;

            const dx = pointer.x - this.dragStart.x;
            const dy = pointer.y - this.dragStart.y;

            if (Math.hypot(dx,dy) > 6) this.dragged = true;
            if(!this.dragged) return;

            this.transform.panX = this.dragStart.panX + dx;
            this.transform.panY = this.dragStart.panY + dy;

            this.drawMap();
        });

        this.input.on('pointerupoutside', () => {
            this.dragStart = undefined;
            this.dragged = false;
        });

        this.input.on('wheel', (pointer: Phaser.Input.Pointer, _gameObjects: any, _deltaX: number, deltaY: number) => {
            if (pointer.y < 70) return;

            const factor = deltaY > 0 ? 0.9 : 1.1;
            const oldZoom = this.transform.zoom;

            this.transform.zoom = Phaser.Math.Clamp(this.transform.zoom * factor, 0.2, 10);

            this.debugText.setText(`Zoom: ${this.transform.zoom.toFixed(2)}`);

            const ratio = this.transform.zoom / oldZoom;
            this.transform.panX = pointer.x
                - (pointer.x - this.transform.panX) * ratio;

            this.transform.panY = pointer.y
                - (pointer.y - this.transform.panY) * ratio;
            this.drawMap();
        })

        this.addButton(20, 70, 'Ansicht zurücksetzen', () => {
            this.transform.zoom = 1;
            this.transform.panX = 0;
            this.transform.panY = 0;
            this.selected = undefined;
            this.debugText.setText('Ansicht zurückgesetzt.');
            this.drawMap()
        })

        this.drawMap()

    }

    private drawMap(){
        this.ground.clear();

        for(let y = 0; y < MAP_HEIGHT; y++){
            for(let x = 0; x < MAP_WIDTH; x++){
                const px = this.transform.panX + x * TILE_WIDTH * this.transform.zoom;
                const py = this.transform.panY + y * TILE_HEIGHT * this.transform.zoom;

                const isSelected: boolean = this.selected?.x === x && this.selected?.y === y;
                let color =  (x + y) % 2 === 0 ? 0x91a96c : 0x9db779;
                let strokeColor = color;

                let currentField  = this.farm.fieldAt(x, y)
                if(currentField){
                    color = (x + y) % 2 === 0 ? currentField.state.firstColor : currentField.state.secondColor;
                }

                this.ground.fillStyle(color);
                this.ground.lineStyle(2 * this.transform.zoom, strokeColor);
                this.ground.fillRect(px, py, TILE_WIDTH * this.transform.zoom, TILE_HEIGHT * this.transform.zoom);

                if(isSelected){
                    this.ground.lineStyle(3, 0xe8c56a)
                    this.ground.strokeCircle(px + TILE_WIDTH * this.transform.zoom / 2, py + TILE_HEIGHT * this.transform.zoom / 2, TILE_WIDTH * this.transform.zoom / 2 - 5);
                    this.debugText.setText(`Kachel ${x}, ${y} ausgewählt.`);
                }

            }
        }

        for(let equipment of this.farm.farmEquipment){
            const px = this.transform.panX + equipment.x * TILE_WIDTH * this.transform.zoom;
            const py = this.transform.panY + equipment.y * TILE_HEIGHT * this.transform.zoom;

            this.ground.fillStyle(modelOf(equipment.equipment).color);
            this.ground.fillRect(px, py, TILE_WIDTH * this.transform.zoom, TILE_HEIGHT * this.transform.zoom);
        }
    }


    private addButton(x: number, y: number, label: string, action: () => void){
        const button = this.add.text(x, y, label, {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#35563f',
            padding: { x: 12, y: 10 },
        }).setDepth(10);

        button.setInteractive({ useHandCursor: true });
        button.on('pointerdown', action);
    }
}