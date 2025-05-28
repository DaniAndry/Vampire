import { _decorator, Component, Node, Vec3 } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
import { Bed } from '../../Bed';
const { ccclass, property } = _decorator;

@ccclass('DoctorHealTransition')
export class DoctorHealTransition extends Transition {
    @property({type: State, override: true})
    targetState: State = null;

    private _transitionRange: number = 10;

    update() {
        const targetNode = this.doctor.target;
        if (!targetNode) return;
        
        const bedComponent = targetNode.getComponent(Bed);
        if (!bedComponent || !bedComponent.targetPoint) return;
        
        this.target = bedComponent;
        
        const worldCurrentPos = new Vec3();
        this.node.getWorldPosition(worldCurrentPos);
        
        const targetPointWorldPos = new Vec3();
        this.target.targetPoint.node.getWorldPosition(targetPointWorldPos);
        
        const distanceToTargetPoint = Vec3.distance(worldCurrentPos, targetPointWorldPos);
        
        if (distanceToTargetPoint <= this._transitionRange) {
            this.doctor.toStop();
            this.node.setWorldPosition(targetPointWorldPos);
            this.needTransit = true;
        }
    }

    public enable(): void {

    }
}
