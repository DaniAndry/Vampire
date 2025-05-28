import { _decorator, Component, Node, Vec3, Sprite, Animation, tween, Tween } from 'cc';
import { State } from '../../States/State';
import { CharacterType } from '../../CharacterType';
import { Bed } from '../../Bed';
import { Vampire } from '../Vampire';

const { ccclass, property } = _decorator;

@ccclass('MoveState')
export class MoveState extends State {
    @property({ visible: true }) private _speed: number = 2;
    @property({ visible: true }) private _reachDistance: number = 0.1;

    protected _characterType: CharacterType = CharacterType.Vampire;

    private vampire: Vampire;
    private sprite: Sprite;

    private moveStart: Vec3 = new Vec3();
    private moveEnd: Vec3 = new Vec3();
    private elapsedTime = 0;
    private moveDuration = 1;
    private isMoving = false;
    private movingToIntermediate = true;
    private intermediate: Node = null;
    private originalParent: Node = null;
    private temporaryParent: Node = null;
    private targetParent: Node = null;

    enter(animator: Animation, target: Bed) {
        animator.play("Walk");
        super.enter(animator, target);

        this.vampire = this.getComponent(Vampire);
        this.sprite = this.getComponent(Sprite);
        this.intermediate = this.vampire.firstIntermidiatePoint;
        
        this.originalParent = this.node.parent;
        this.temporaryParent = this.vampire.temporaryParent;
        this.targetParent = this.intermediate;

         this.node.setParent(this.originalParent, true);
        

        Tween.stopAllByTarget(this.node);

        const start = this.node.worldPosition.clone();
        Vec3.copy(this.moveStart, start);

        if (this.intermediate) {
            this.intermediate.getWorldPosition(this.moveEnd);
            this.movingToIntermediate = true;
        } else {
            this.target.node.getWorldPosition(this.moveEnd);
            this.movingToIntermediate = false;
        }

        const distance = Vec3.distance(this.moveStart, this.moveEnd);
        this.moveDuration = Math.max(0.001, distance / this._speed);
        this.elapsedTime = 0;
        this.isMoving = true;
    }

    update(dt: number) {
        if (!this.isMoving) return;

        this.elapsedTime += dt;
        const t = Math.min(1, this.elapsedTime / this.moveDuration);

        const newPos = new Vec3();
        Vec3.lerp(newPos, this.moveStart, this.moveEnd, t);

        const direction = new Vec3();
        Vec3.subtract(direction, this.moveEnd, this.moveStart);
        const scale = this.node.scale.clone();
        scale.x = direction.x > 0 ? Math.abs(scale.x) : -Math.abs(scale.x);
        this.node.setScale(scale);

        this.node.setWorldPosition(newPos);

        if (t >= 1) {
            if (this.movingToIntermediate) {
                this.onReachedIntermediate();
            } else {
                this.onReachedTarget();
            }
        }
    }

    private onReachedIntermediate() {
        // Устанавливаем точную позицию промежуточной точки
        this.node.setWorldPosition(this.moveEnd);
        
        // Планируем смену родителя с задержкой
        this.scheduleOnce(this.changeParent.bind(this));
        
        // Настраиваем следующую часть движения
        this.intermediate.getWorldPosition(this.moveStart);
        this.target.node.getWorldPosition(this.moveEnd);
        const distance = Vec3.distance(this.moveStart, this.moveEnd);
        this.moveDuration = Math.max(0.001, distance / this._speed);
        this.elapsedTime = 0;
        this.movingToIntermediate = false;
    }

    private onReachedTarget() {
        this.target.node.getWorldPosition(this.moveEnd);
        this.node.setWorldPosition(this.moveEnd);
        this.isMoving = false;
        this.enabled = false;
    }
    
    private changeParent() {
        // Переключаемся на целевого родителя, сохраняя мировые координаты
        if (this.targetParent) {
            this.node.setParent(this.targetParent, true);
        }
    }
}
