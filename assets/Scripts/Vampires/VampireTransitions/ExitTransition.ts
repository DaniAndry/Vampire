import { _decorator, Component, Node } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('ExitTransition')
export class ExitTransition extends Transition {
    @property({type: State, visible: true, displayName: 'Целевое состояние', override: true})
    public targetState: State = null;
    start() {
        this.exit();
    }

    private exit() {
        if (this.target) {
            this.target.healComplete();
            this.target.emptyBed();
        }
        this.needTransit = true;
    }

    public enable(): void {
    }
}
