import { _decorator, Component, Node, SpriteFrame, Sprite, ParticleSystem2D, Vec2, Vec3, NodeSpace } from 'cc';
import { Bed } from '../Bed';
import { MoneyController } from '../Money/MoneyController';
const { ccclass, property } = _decorator;

@ccclass('Vampire')
export class Vampire extends Component {
    @property(SpriteFrame)
    public healSprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    public bubleSprite: SpriteFrame = null;
    
    @property(Sprite)
    public bubleRenderer: Sprite = null;
    
    @property(Node)
    public buble: Node = null;
    
    public targetParrentPoint: Node = null;
    @property
    public rewardAmount: number = 10;

    private renderer: Sprite = null;
    private _target: Bed = null;
    private _isFirst: boolean = false;
    private _isHealthy: boolean = false;
    
    @property({type: MoneyController, visible: true, displayName: 'Контроллер денег'})
    private _money: MoneyController = null;
    
    @property({type: Node, visible: true, displayName: 'Точка выхода'})
    private _exitPoint: Node = null;
    
    @property({visible: true, displayName: 'Промежуточная точка'})
    private _intermidiatePoint: Node = null;

    @property({visible: true, displayName: 'Первая промежуточная точка'})
    private _firstIntermidiatePoint: Node = null;

     @property({visible: true, displayName: 'времянка'})
    private _temporaryPoint: Node = null;

    get target(): Bed {
        return this._target;
    }

    get isFirst(): boolean {
        return this._isFirst;
    }

    get isHealthy(): boolean {
        return this._isHealthy;
    }

    get exitPoint(): Node {
        return this._exitPoint;
    }

    get money(): MoneyController {
        return this._money;
    }

    get reward(): number {
        return this.rewardAmount;
    }

    get intermidiatePoint(): Node {
        return this._intermidiatePoint;
    }

      get firstIntermidiatePoint(): Node {
        return this._firstIntermidiatePoint;
    }

     get temporaryParent(): Node {
        return this._temporaryPoint;
    }

    onLoad() {
        this.renderer = this.getComponent(Sprite);
    }

    toFirst(bed: Bed) {
        this._target = bed;
        this._isFirst = true;
    }

    startToHeal() {
        this._isHealthy = true;
    }

    heal() {
        if (this.renderer && this.renderer.node) {
            this.renderer.node.setSiblingIndex(750);
        }
    }

    initPoint(intermidiatePoint: Node, vampireExitPoint: Node, money: MoneyController, targetParrentPoint : Node, firstIntermidiatePoint : Node, temporaryPoint : Node) {
        
        this.targetParrentPoint = targetParrentPoint;
        this._exitPoint = vampireExitPoint;
        this._intermidiatePoint = intermidiatePoint;
        this._money = money;
        this._firstIntermidiatePoint = firstIntermidiatePoint;
        this._temporaryPoint = temporaryPoint;
        
    }

    changeSprite() {
        this.bubleRenderer.node.active = false;
    }


    disableBubble() {
        this.buble.active = false;
    }

    enableBubble() {
        this.buble.active = true;
        this.changeSprite();
    }
}
