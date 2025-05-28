import { _decorator, Component, Node, Vec3, randomRange } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('HealTransition')
export class HealTransition extends Transition {
    
    @property({type: State, visible: true, displayName: 'Целевое состояние', override: true})
    public targetState: State = null;
    @property({visible: true})
    private _transitionRange: number = 0.1;
    
    @property({visible: true, displayName: 'Разброс дистанции', min: 0, max: 0.5, step: 0.01})
    private _rangeSpread: number = 0.1;

    start() {
        this._transitionRange += randomRange(-this._rangeSpread, this._rangeSpread);
    }

    update() {
        if (this.target && this.target.node && this.node) {
            const worldTargetPos = new Vec3();
            this.target.node.getWorldPosition(worldTargetPos);
            
            const worldCurrentPos = new Vec3();
            this.node.getWorldPosition(worldCurrentPos);
            
            if (Vec3.distance(worldCurrentPos, worldTargetPos) < this._transitionRange) {
                this.needTransit = true;
            }
        }
    }

    public enable(): void {
        
    }
}
