import { _decorator, Component, Node } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('MoveTransition')
export class MoveTransition extends Transition {

    @property({type: State, visible: true, displayName: 'Целевое состояние', override: true})
    public targetState: State = null;
    
    public enable(): void {
        // Базовая инициализация
    }

    update(dt: number) {
        if (this.vampire) {
            this.target = this.vampire.target;
        }
        
        // Проверка условий перехода
        // Переход происходит, если у нас есть цель
        if (this.target != null) {
            // Кровать еще не занята - занимаем её
            if (!this.target.isBusy) {
                this.target.takeABed();
            }
            
            // В любом случае переходим в MoveState
            if (this.vampire) {
                this.vampire.disableBubble();
            }
            this.needTransit = true;
        }
    }
}
