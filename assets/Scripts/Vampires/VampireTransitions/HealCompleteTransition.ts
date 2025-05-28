import { _decorator, Component, Node } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('HealCompleteTransition')
export class HealCompleteTransition extends Transition {
    // Переопределяем свойство targetState для отображения в инспекторе
    @property({type: State, visible: true, displayName: 'Целевое состояние', override: true})
    public targetState: State = null;
    start() {
        this.scheduleOnce(this.exit, 0.7);
    }

    private exit() {
        this.needTransit = true;
    }

    public enable(): void {
        // В TypeScript нет исключения NotImplementedException, но мы можем использовать Error
        throw new Error("Method not implemented.");
    }
}
