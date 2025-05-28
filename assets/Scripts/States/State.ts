import { _decorator, Component, Node, Animation } from 'cc';
import { Bed } from '../Bed';

// Интерфейс для разрыва циклической зависимости
interface ITransition extends Component {
    enabled: boolean;
    init(target: Bed): void;
    needTransit: boolean;
    targetState: Component;  // Используем Component вместо State
};
const { ccclass, property, type } = _decorator;

@ccclass('State')
export abstract class State extends Component {
    @property({type: [Component], tooltip: 'Переходы между состояниями'})
    public transitions: ITransition[] = [];

    protected animator: Animation = null;
    protected target: Bed = null;

    enter(animator: Animation, target: Bed) {
        if (!this.enabled) {
            this.animator = animator;
            this.target = target;
            
            // Информация о цели не логируется
            // if (target) {
            // } else {
            // }

            
            this.enabled = true;

            for (const transition of this.transitions) {
                transition.enabled = true;
                if (this.target) {
                    transition.init(this.target);
                }
            }
        }
    }

    exit() {
        if (this.enabled) {
            for (const transition of this.transitions) {
                transition.enabled = false;
            }

            this.enabled = false;
        }
    }

    getNextState(): State {
        for (const transition of this.transitions) {
            if (transition.needTransit) {
                // Используем приведение типов, чтобы избежать ошибок типизации
                return transition.targetState as State;
            }
        }

        return null;
    }

    changeTarget(target: Bed) {
        this.target = target;
    }
}
