import type {EquipmentPositions} from "./equipment.ts";
import {startingEquipment} from "./equipment.ts";
import type {Field} from "./fields.ts";
import {startingFields} from "./fields.ts";

export class FarmState {

    public farmEquipment: EquipmentPositions[] = []
    public farmFields: Field[] = []

    constructor() {
        let i = 0;
        for(const equipment of startingEquipment){
            this.farmEquipment.push({equipment, x: i++, y: 0, rotation: 0});
        }
        this.farmFields = startingFields;
    }

    public fieldAt(x: number, y: number): Field | undefined {
        return this.farmFields.find(f => x >= f.x && x < f.x + f.width && y >= f.y && y < f.y + f.height);
    }

    public equipmentAt(x: number, y: number): EquipmentPositions | undefined {
        return this.farmEquipment.find(e => x == e.x && y == e.y);
    }


}

