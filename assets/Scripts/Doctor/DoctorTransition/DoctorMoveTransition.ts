import { _decorator, Component, Node } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
import { Bed } from '../../Bed';
const { ccclass, property } = _decorator;

@ccclass('DoctorMoveTransition')
export class DoctorMoveTransition extends Transition {
    @property({type: State, override: true})
    targetState: State = null;

    update() {
        const targetNode = this.doctor.target;
        if (!targetNode) return;
        
        const bedComponent = targetNode.getComponent(Bed);
        if (!bedComponent) return;
        
        this.target = bedComponent;

        if (this.doctor.isBusy && this.doctor.occupedBed === this.target && this.target.onPlace) {
            return;
        }
        

        if (this.doctor.target === this.target && this.target.isRun) {
            return;
        }


        if (!this.target.isRun && !this.target.onPlace && this.canIMove()) {
            this.doctor.disableBubble();
            this.target.doctorOnRun();
            this.needTransit = true;
        }
    }

    private canIMove(): boolean {
        const isTargetSameAsOccuped = this.target === this.doctor.occupedBed;
        const result = !this.target.isOccuped || isTargetSameAsOccuped;

        return result;
    }

    public enable(): void {
    }
}
