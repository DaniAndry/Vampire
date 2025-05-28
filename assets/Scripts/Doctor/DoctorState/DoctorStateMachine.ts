// @ts-nocheck - Отключаем проверки TypeScript для всего файла
import { _decorator, Component, Animation, Node } from 'cc';
// Импортируем Doctor из корневой папки Scripts
import { Doctor } from '../../../Scripts/Doctor';
import { State } from '../../States/State';
import { Bed } from '../../Bed';

const { ccclass, property } = _decorator;

@ccclass('DoctorStateMachine')
export class DoctorStateMachine extends Component {
    @property(State)
    firstState: State = null;
    
    private _animation: Animation = null;
    private _currentState: State = null;
    private _doctor: Doctor = null;

    onLoad() {
        this._animation = this.getComponent(Animation);
        this._doctor = this.getComponent(Doctor);
    }

    start() {
        this._currentState = this.firstState;
        this._currentState.enabled = true; 
        
        if (this._currentState) {
            if (this._doctor) {
                this._currentState.enter(this._animation, this._doctor.target);
            } else {
                // Цель не найдена, не логируем
                this._currentState.enter(this._animation, null);
            }
        }
    }

    update(deltaTime: number) {
        if (!this._currentState) return;

        const nextState = this._currentState.getNextState();
        if (nextState) {
            this.transit(nextState);
        }
    }

    private transit(nextState: State) {
        if (this._currentState) {
            this._currentState.exit();
        }
        
        this._currentState = nextState;
        
        if (this._currentState) {
            if (this._doctor && this._doctor.target) {
    
                this._currentState.enter(this._animation, this._doctor.target);
            } else {
                // Цель не найдена, не логируем
                this._currentState.enter(this._animation, null);
            }
        }
    }
}
