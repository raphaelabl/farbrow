import Phaser from 'phaser';
import {worldConfig} from "./world-config.ts";
import type {EquipmentPositions} from "./equipment.ts";
import type {FarmState} from "./farm-state.ts";

const MAP_WIDTH = worldConfig.MAP_WIDTH;
const MAP_HEIGHT = worldConfig.MAP_HEIGHT;

const TILE_WIDTH = worldConfig.TILE_WIDTH;
const TILE_HEIGHT = worldConfig.TILE_HEIGHT;

export class InteractionState {

    private farmstate: FarmState;

    public selected?: { x: number, y: number };
    public selectedEquipmentPos?: EquipmentPositions = undefined;

    public callBackDrawMap?: () => void;

    private dragStart?: {
        x: number;
        y: number;
        panX: number;
        panY: number;
    }

    private dragged = false;

    public transform = {
        panX: 0,
        panY: 0,
        zoom: 1
    }

    constructor(farmstate: FarmState, callBackDrawMap?: () => void) {
        this.callBackDrawMap = callBackDrawMap;
        this.farmstate = farmstate;
    }

    public pointerUp = (pointer: Phaser.Input.Pointer) => {
        if(pointer.y < 70) return;

        const startedOnMap = !!this.dragStart;
        this.dragStart = undefined;

        if (!startedOnMap || this.dragged) return;

        const gx = Math.floor((pointer.x - this.transform.panX) / (TILE_WIDTH * this.transform.zoom));
        const gy = Math.floor((pointer.y - this.transform.panY) / (TILE_HEIGHT * this.transform.zoom));

        if (gx < 0 || gy < 0 || gx >= MAP_WIDTH || gy >= MAP_HEIGHT) {
            this.selected = undefined;
        } else {
            this.selected = { x: gx, y: gy };

            if(this.farmstate.equipmentAt(gx, gy)) {
                this.selectedEquipmentPos = this.farmstate.equipmentAt(gx, gy);
            } else {
                this.selectedEquipmentPos = undefined;
            }
        }
        this.callBackDrawMap?.();
    }

    public pointerDown = (pointer: Phaser.Input.Pointer) => {
        if(pointer.y < 70) return;

        this.dragStart = {
            x: pointer.x,
            y: pointer.y,
            panX: this.transform.panX,
            panY: this.transform.panY
        }
        this.dragged = false;
    }

    public pointerMove = (pointer: Phaser.Input.Pointer) => {
        if(!this.dragStart || !pointer.isDown) return;

        const dx = pointer.x - this.dragStart.x;
        const dy = pointer.y - this.dragStart.y;

        if (Math.hypot(dx,dy) > 6) this.dragged = true;
        if(!this.dragged) return;

        this.transform.panX = this.dragStart.panX + dx;
        this.transform.panY = this.dragStart.panY + dy;
        this.callBackDrawMap?.();
    }

    public pointerOutside = () => {
        this.dragStart = undefined;
        this.dragged = false;
    }

    public wheel = (pointer: Phaser.Input.Pointer, _gameObjects: any, _deltaX: number, deltaY: number) => {
        if (pointer.y < 70) return;

        const factor = deltaY > 0 ? 0.9 : 1.1;
        const oldZoom = this.transform.zoom;

        this.transform.zoom = Phaser.Math.Clamp(this.transform.zoom * factor, 0.2, 10);

        const ratio = this.transform.zoom / oldZoom;
        this.transform.panX = pointer.x
            - (pointer.x - this.transform.panX) * ratio;

        this.transform.panY = pointer.y
            - (pointer.y - this.transform.panY) * ratio;
        this.callBackDrawMap?.();
    }

    public resetView = () => {
        this.transform.zoom = 1;
        this.transform.panX = 0;
        this.transform.panY = 0;
        this.selected = undefined;
        this.callBackDrawMap?.();
    }

    public compareSelectedTile(x:number, y:number): boolean {
        return this.selected?.x === x && this.selected?.y === y;
    }

    public compareSelectedEquipmentTile(x:number, y:number): boolean {
        return this.selectedEquipmentPos?.x === x && this.selectedEquipmentPos?.y === y;
    }

}