import Phaser from 'phaser';
import {worldConfig} from "./state/world-config.ts";
import {FarmState} from "./state/farm-state.ts";
import {modelOf} from "./state/equipment.ts";
import {InteractionState} from "./state/interaction-state.ts";

const MAP_WIDTH = worldConfig.MAP_WIDTH;
const MAP_HEIGHT = worldConfig.MAP_HEIGHT;

const TILE_WIDTH = worldConfig.TILE_WIDTH;
const TILE_HEIGHT = worldConfig.TILE_HEIGHT;

export class FarmScene extends Phaser.Scene{

    private ground!: Phaser.GameObjects.Graphics;

    private debugText!: Phaser.GameObjects.Text;

    private farm: FarmState = new FarmState();
    private interaction: InteractionState = new InteractionState(this.farm, this.drawMap.bind(this));

    constructor(){
        super('Farm');
    }

    create(){
        this.ground = this.add.graphics();

        this.debugText = this.add.text(20, 20, '', { fontSize: '16px', color: '#ffffff', backgroundColor: '#1c332a', padding: { x: 12, y: 10} }).setDepth(10);
        this.debugText.setText('Klicke auf eine Kachel.');

        this.input.on('pointerup', this.interaction.pointerUp)
        this.input.on('pointerdown', this.interaction.pointerDown);
        this.input.on('pointermove', this.interaction.pointerMove);
        this.input.on('pointerupoutside', this.interaction.pointerOutside);
        this.input.on('wheel', this.interaction.wheel);

        this.addButton(20, 70, 'Ansicht zurücksetzen', this.interaction.resetView)

        this.drawMap()

    }

    private drawMap(){
        this.ground.clear();

        for(let y = 0; y < MAP_HEIGHT; y++){
            for(let x = 0; x < MAP_WIDTH; x++){
                const px = this.interaction.transform.panX + x * TILE_WIDTH * this.interaction.transform.zoom;
                const py = this.interaction.transform.panY + y * TILE_HEIGHT * this.interaction.transform.zoom;

                let color =  (x + y) % 2 === 0 ? 0x91a96c : 0x9db779;
                let strokeColor = color;

                let currentField  = this.farm.fieldAt(x, y)
                if(currentField){
                    color = (x + y) % 2 === 0 ? currentField.state.firstColor : currentField.state.secondColor;
                }

                this.ground.fillStyle(color);
                this.ground.lineStyle(2 * this.interaction.transform.zoom, strokeColor);
                this.ground.fillRect(px, py, TILE_WIDTH * this.interaction.transform.zoom, TILE_HEIGHT * this.interaction.transform.zoom);

            }
        }

        for(let equipment of this.farm.farmEquipment){
            const px = this.interaction.transform.panX + equipment.x * TILE_WIDTH * this.interaction.transform.zoom;
            const py = this.interaction.transform.panY + equipment.y * TILE_HEIGHT * this.interaction.transform.zoom;

            this.ground.fillStyle(modelOf(equipment.equipment).color);
            this.ground.fillRect(px, py, TILE_WIDTH * this.interaction.transform.zoom, TILE_HEIGHT * this.interaction.transform.zoom);
        }

        if(this.interaction.selected && this.interaction.selectedEquipmentPos === undefined){
            const px = this.interaction.transform.panX + this.interaction.selected.x * TILE_WIDTH * this.interaction.transform.zoom;
            const py = this.interaction.transform.panY + this.interaction.selected.y * TILE_HEIGHT * this.interaction.transform.zoom;

            this.ground.lineStyle(4 * this.interaction.transform.zoom, 0xffcd03);
            this.ground.strokeEllipse(px + (TILE_WIDTH / 2) * this.interaction.transform.zoom, py + (TILE_HEIGHT / 2) * this.interaction.transform.zoom, (TILE_WIDTH - 4) * this.interaction.transform.zoom, (TILE_HEIGHT - 4) * this.interaction.transform.zoom);
        }
        if(this.interaction.selectedEquipmentPos){
            const px = this.interaction.transform.panX + this.interaction.selectedEquipmentPos.x * TILE_WIDTH * this.interaction.transform.zoom;
            const py = this.interaction.transform.panY + this.interaction.selectedEquipmentPos.y * TILE_HEIGHT * this.interaction.transform.zoom;

            this.ground.lineStyle(4 * this.interaction.transform.zoom, 0xffcd03);
            this.ground.strokeRect(px, py + 2, TILE_WIDTH * this.interaction.transform.zoom, TILE_HEIGHT * this.interaction.transform.zoom);
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