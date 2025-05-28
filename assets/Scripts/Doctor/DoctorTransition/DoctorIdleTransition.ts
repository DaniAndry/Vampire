import { _decorator, Component, Node } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('DoctorIdleTransition')
export class DoctorIdleTransition extends Transition {
    @property({type: State, override: true})
    targetState: State = null;

    update() {
        if (this.doctor.isStop) {
            this.needTransit = true;
        }
    }

    public enable(): void {
        // В TypeScript нет исключения NotImplementedException, используем Error
        throw new Error("Метод не реализован");
    }
}
