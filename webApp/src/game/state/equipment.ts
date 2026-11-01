export type EquipmentKind = 'tractor' | 'plow' | 'seeder' | 'harvester'

export interface Model {
    id: string;
    name: string;
    kind: EquipmentKind;
    price: number;
    power?: number;
    requiredPower?: number;
    width?: number;
    description: string,
    color: number;
}

export interface Equipment {
    id: string;
    modelId: string;
    level: number;
    // Later damage, ....
}

export interface EquipmentPositions {
    equipment: Equipment;
    x: number;
    y: number;
    rotation: number;
}

export const categories: Record<EquipmentKind, string> = {
    tractor: "Traktoren",
    plow: "Pflüge",
    seeder: "Sämaschinen",
    harvester: "Mähdrescher"
}

export const models: Model[] = [
    // Traktoren
    {id:'t80',name:'Hoftraktor 80',kind:'tractor',price:12000,power:80,description:'Wendiger Einstieg für leichte Anbaugeräte.', color: 0x329432},
    {id:'t150',name:'Allround 150',kind:'tractor',price:26000,power:150,description:'Mehr Leistung für mittlere Arbeitsbreiten.', color: 0x234234},
    {id:'t250',name:'Feldmeister 250',kind:'tractor',price:44000,power:250,description:'Starker Schlepper für die größten Geräte.', color: 0x243243},

    // Pflüge
    {id:'p2',name:'Wendepflug 2',kind:'plow',price:3500,width:2,requiredPower:60,description:'Wendet und lockert den Boden vor der Aussaat.', color: 0x523524},
    {id:'p4',name:'Wendepflug 4',kind:'plow',price:9000,width:4,requiredPower:120,description:'Doppelte Arbeitsbreite für größere Flächen.', color: 0x213132},
    {id:'p6',name:'Wendepflug 6',kind:'plow',price:17000,width:6,requiredPower:200,description:'Hohe Flächenleistung mit kräftigem Traktor.', color: 0x812352},

    // Sämaschinen
    {id:'s3',name:'Drillmaschine 3',kind:'seeder',price:5000,width:3,requiredPower:70,description:'Bringt Getreidesaat in den vorbereiteten Boden.', color: 0x234192},
    {id:'s6',name:'Drillmaschine 6',kind:'seeder',price:14000,width:6,requiredPower:140,description:'Breite Aussaat für einen wachsenden Betrieb.', color: 0x823422},
    {id:'s9',name:'Drillmaschine 9',kind:'seeder',price:24000,width:9,requiredPower:220,description:'Große Arbeitsbreite für leistungsstarke Schlepper.', color: 0x324234},

    // Mähdrescher
    {id:'h4',name:'Kornmeister 4',kind:'harvester',price:18000,width:4,description:'Selbstfahrender Mähdrescher mit integriertem 4-m-Schneidwerk.', color: 0x523426},
    {id:'h7',name:'Kornmeister 7',kind:'harvester',price:34000,width:7,description:'Großer Mähdrescher mit integriertem 7-m-Schneidwerk.', color: 0x642342},
]

export const modelOf = (equipment: Equipment) => models.find(m=>m.id===equipment.modelId)!;
export const powerOf = (equipment: Equipment) => Math.round((modelOf(equipment).power ?? 0)*(1+equipment.level*.1));
export const upgradeCost = (equipment: Equipment) => Math.round(modelOf(equipment).price*.2*(equipment.level+1));


export const startingEquipment: Equipment[] = [
    {id:'starter-tractor',modelId:'t80',level:0},
    {id:'starter-plow',modelId:'p2',level:0},
    {id:'starter-seeder',modelId:'s3',level:0},
];