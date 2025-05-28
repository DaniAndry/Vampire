import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { TargetPoint } from './TargetPoint';
import { IBed } from './IBed';
const { ccclass, property } = _decorator;

@ccclass('Bed')
export class Bed extends Component implements IBed {
    @property({type: SpriteFrame, tooltip: 'Спрайт для кровати, требующей лечения'})
    public spriteNeedToHeal: SpriteFrame = null;

    @property({tooltip: 'Занята ли кровать (вампиром или доктором)'})
    public isBusy: boolean = false;

    @property({tooltip: 'Нужно ли лечение для этой кровати'})
    public needToHeal: boolean = false;

    @property({tooltip: 'Врач находится на месте'})
    public onPlace: boolean = false;

    @property({tooltip: 'Готова к лечению'})
    public isReadyToHeal: boolean = false;

    @property({tooltip: 'Доктор бежит к кровати'})
    public isRun: boolean = false;

    @property({tooltip: 'Кровать занята вампиром'})
    public isOccuped: boolean = false;

    // Приватные поля без декоратора @property
    private _targetPoint: TargetPoint = null;
    private _sprite: SpriteFrame = null;
    private _spriteRenderer: Sprite = null;
    
    // Только для targetPoint оставляем геттер, так как это приватное поле
    get targetPoint(): TargetPoint {
        return this._targetPoint;
    }

    start() {
        this._spriteRenderer = this.getComponent(Sprite);
        this._targetPoint = this.getComponentInChildren(TargetPoint);
        this._sprite = this._spriteRenderer.spriteFrame;
    }

    takeABed() {
        this.isBusy = true;
    }

    occupedBed() {
        this.isOccuped = true;
    }
    
    emptyBed() {
        this.isBusy = false;
        this._spriteRenderer.spriteFrame = this._sprite;
    }

    healBed() {
        this.needToHeal = true;
        this._spriteRenderer.spriteFrame = this.spriteNeedToHeal;
    }

    healComplete() {
        this.isBusy = false;
        this.onPlace = false;
    }

    doctorOnPlace() {
        this.onPlace = true;
        this.needToHeal = false;
        this.isRun = false;
    }
    
    doctorOnRun() {
        this.isRun = true;
    }

    onReady() {
        this.isReadyToHeal = true;
    }

    ofReady() {
        this.isReadyToHeal = false;
    }
}
