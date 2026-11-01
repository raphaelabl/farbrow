import {useEffect, useRef} from "react";
import Phaser from "phaser";
import {FarmScene} from "./FarmScene.ts";

export function GameMap() {

    const host = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!host.current) return;

        const element = host.current;
        const game =  new Phaser.Game({
            type: Phaser.AUTO,
            parent: element,
            backgroundColor: '#487800',
            scale: {
                mode: Phaser.Scale.RESIZE,
                width: element.clientWidth,
                height: element.clientHeight
            },
            scene: [FarmScene]
        });


        const observer = new ResizeObserver(() => {
            game.scale.resize(element.clientWidth, element.clientHeight);
        })
        observer.observe(element);

        return () => {
            observer.disconnect();
            game.destroy(true);
        }
    }, []);

    return <div className="game-map" ref={host} />;

}