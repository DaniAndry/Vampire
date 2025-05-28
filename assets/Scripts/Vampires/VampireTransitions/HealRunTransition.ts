import { _decorator, Component, Node } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('HealRunTransition')
export class HealRunTransition extends Transition {
    // Переопределяем свойство targetState для отображения в инспекторе
    @property({type: State, visible: true, displayName: 'Целевое состояние', override: true})
    public targetState: State = null;
    @property(Node)
    private _buble: Node = null;
    
    start() {
        // Добавляем проверку на null перед вызовом метода
        if (this.target) {
            this.target.onReady();
        }
    }

    update() {
        // Добавляем проверку на null перед обращением к свойствам
        if (this.target && this.target.onPlace && this.target.isReadyToHeal) {
            // Проверяем _buble на null перед использованием
            if (this._buble) {
                this._buble.active = true;
            }
            this.needTransit = true;
        }
    }
    
    public enable(): void {
        // В TypeScript нет исключения NotImplementedException, используем Error
        throw new Error("Метод не реализован");
    }
}
