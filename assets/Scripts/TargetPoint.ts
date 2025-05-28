import { _decorator, Component, Node, Collider2D, IPhysics2DContact } from 'cc';
import { Doctor } from './Doctor';
const { ccclass, property } = _decorator;

@ccclass('TargetPoint')
export class TargetPoint extends Component {
    private _isBusy: boolean = false;

    get isBusy(): boolean {
        return this._isBusy;
    }

    onLoad() {
        this._isBusy = false;
    }

    // В Cocos Creator используются другие методы для обработки коллизий
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        const doctor = otherCollider.getComponent(Doctor);
        if (doctor) {
            this._isBusy = true;
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        const doctor = otherCollider.getComponent(Doctor);
        if (doctor) {
            this._isBusy = false;
        }
    }
}
