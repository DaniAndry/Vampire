import { _decorator, Component, Node, Animation, Sprite, SpriteFrame } from 'cc';
import { IBed } from './IBed';
import { CharacterType } from './CharacterType';
const { ccclass, property } = _decorator;

@ccclass('Doctor')
export class Doctor extends Component {

    @property({type: Animation, displayName: 'Аниматор', tooltip: 'Компонент анимации персонажа'})
    public animator: Animation = null!;
    
    @property({type: Node, displayName: 'Пузырёк диалога'})
    public bubble: Node = null!;
    
    @property({displayName: 'Is Busy'}) 
    public doctorBusy: boolean = false;

    @property
    public occupedBedd: IBed | null = null;
    
    @property({displayName: 'Is Stopped'})
    public doctorStop: boolean = false;
    private _spriteRenderer: Sprite | null = null;
    private _characterType: CharacterType = CharacterType.Doctor;
    private _targetBed: IBed | null = null;



    public get isBusy(): boolean {
        return this.doctorBusy;
    }

    public get occupedBed(): IBed | null {
        return this.occupedBedd;
    }

    public get isStop(): boolean {
        return this.doctorStop;
    }

    public get target(): IBed | null {
        return this._targetBed;
    }

    onLoad() {
        this._spriteRenderer = this.getComponent(Sprite);
    }

    public toWalk() {
        if (this._spriteRenderer ) {
            this.doctorBusy = true;
            this.doctorStop = false;
        }
    }

    public toIdle() {
        if (this._spriteRenderer) {

        }
    }
    
    public completeHealing(): void {
        this.doctorBusy = false;
        this._targetBed = null;
    }
    
    public toStop(): void {
        this.doctorStop = true;
    }
    
   public toHeal(bed: IBed) {
    this._targetBed = bed;
  
    if(this.occupedBedd == null && !bed.isOccuped) {
        this.occupedBedd = bed; 
        this.occupedBedd.occupedBed();
        this.doctorBusy = true;
        return true;
    }
    else if(this.occupedBedd === bed) {
        this.doctorBusy = true;
        return true;
    }
    
    return false;
}
    
    public disableBubble(): void {
        if (this.bubble) {
            this.bubble.active = false;
        }
    }
}
