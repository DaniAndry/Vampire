import { _decorator, Component, Animation, Node } from 'cc';
import { State } from '../States/State';
import { Vampire } from './Vampire';
import { Bed } from '../Bed';

// Добавляем директиву для игнорирования ошибок типизации
// @ts-ignore

const { ccclass, property, requireComponent } = _decorator;

@ccclass('VampireStateMachine')
@requireComponent(Animation)
export class VampireStateMachine extends Component {
    @property({type: State, tooltip: 'Начальное состояние вампира'})
    private firstState: State = null;
    
    private animator: Animation = null;
    private currentState: State = null;
    private vampire: Vampire = null;

    onLoad() {
        this.animator = this.getComponent(Animation);
        this.vampire = this.getComponent(Vampire);
    }

    start() {
        this.currentState = this.firstState;
        
        if (this.currentState) {

            if (this.vampire && this.vampire.target) {

                const bedTarget = this.vampire.target;
                const targetNode = bedTarget['node'];
                const targetName = targetNode ? targetNode['name'] : 'Без имени';
                
                this.currentState.enter(this.animator, this.vampire.target);
            } else {
                // Цель не найдена, не логируем
                this.currentState.enter(this.animator, null);
            }
        }
    }

    update(dt: number) {
        if (!this.currentState) {
            return;
        }
        
        const nextState = this.currentState.getNextState();
        
        if (nextState) {
            this.transit(nextState);
        }
    }

    private transit(nextState: State) {
        if (this.currentState) {
            this.currentState.exit();
        }
        
        this.currentState = nextState;
        
        if (this.currentState) {
            // Получаем цель вампира - напрямую используем объект Bed
            if (this.vampire && this.vampire.target) {
                // Получаем имя ноды безопасным способом
                const bedTarget = this.vampire.target;
                const targetNode = bedTarget['node'];
                const targetName = targetNode ? targetNode['name'] : 'Без имени';
                
                // Отладочное логирование
                // Removed debug log about vampire target
                
                // Передаем объект Bed в метод enter
                this.currentState.enter(this.animator, this.vampire.target);
            } else {
                // Цель не найдена, не логируем
                // В крайнем случае передаем null
                // @ts-ignore - Игнорируем ошибку типизации, так как метод enter может обрабатывать null
                this.currentState.enter(this.animator, null);
            }
        }
    }
}