import { _decorator, Component } from 'cc';
import { Bed } from '../Bed';
import { Vampire } from '../Vampires/Vampire';
import { Doctor } from '../Doctor';

// Определяем интерфейс IState для разрыва циклической зависимости
interface IState extends Component {
    // Минимальные требования к интерфейсу, которые использует класс Transition
};

const { ccclass, property, type } = _decorator;

@ccclass('Transition')
export abstract class Transition extends Component {
    @property({type: Component, visible: true, displayName: 'Целевое состояние', tooltip: 'Состояние, в которое перейдет персонаж при выполнении условия перехода'})
    public targetState: IState = null;

    // Метод для программного назначения целевого состояния
    public setTargetState(state: IState): void {
        this.targetState = state;
    }

    public needTransit: boolean = false;

    protected target: Bed | null = null;
    protected vampire: Vampire | null = null;
    protected doctor: Doctor | null = null;

    onEnable() {
        this.vampire = this.getComponent(Vampire);
        this.doctor = this.getComponent(Doctor);
        this.needTransit = false;
    }

    public abstract enable(): void;

    public init(target: Bed) {
        this.target = target;
    }
}
