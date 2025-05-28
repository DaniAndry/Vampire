import { _decorator, Component } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
import { Bed } from '../../Bed';

const { ccclass, property } = _decorator;

@ccclass('DoctorHealRunTransition')
export class DoctorHealRunTransition extends Transition {
    @property({type: State, override: true})
    targetState: State = null;

    private _delayTimer: number = 0;
    private _isWaiting: boolean = false;

    update(dt: number) {
        const targetNode = this.doctor?.target;
        if (!targetNode) return;

        const bedComponent = targetNode.getComponent(Bed);
        if (!bedComponent) return;

        this.target = bedComponent;

        // Условия перехода в "задержку"
        if (this.doctor.isBusy && this.target.onPlace && !this._isWaiting) {
            this._isWaiting = true;
            this._delayTimer = 0;
            // Removed debug log about waiting 1 second
        }

        // Обработка таймера
        if (this._isWaiting) {
            this._delayTimer += dt;

            if (this._delayTimer >= 1.0) {
                // Removed debug log about wait time expired
                
                this._isWaiting = false; // Сброс
                this._delayTimer = 0;
                this.doctor.completeHealing();
                this.needTransit = true;
            }
        }
    }

    public enable(): void {
        this._isWaiting = false;
        this._delayTimer = 0;
    }
}
