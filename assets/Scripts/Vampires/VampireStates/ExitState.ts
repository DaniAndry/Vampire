import { _decorator, Component, Node, Vec3, Sprite, Animation } from 'cc';
import { State } from '../../States/State';
import { Vampire } from '../Vampire';
import { MoneyController } from '../../Money/MoneyController';
import { HealthyPoint } from '../../HealthytPoint';

const { ccclass, property } = _decorator;

@ccclass('ExitState')
export class ExitState extends State {
    @property({ displayName: 'Скорость движения' })
    private moveSpeed: number = 400;

    @property(MoneyController)
    private moneyController: MoneyController = null;

    @property(Node)
    private newParentNode: Node = null;

    @property(Node)
    private exitPointNode: Node = null;

    @property(Node)
    private intermediatePointNode: Node = null;

    private spriteRenderer: Sprite = null;
    private vampire: Vampire = null;
    private animationComponent: Animation = null;
    private moveStart: Vec3 = new Vec3();
    private moveEnd: Vec3 = new Vec3();
    private elapsedTime = 0;
    private moveDuration = 1;
    private movingToIntermediate = true;
    private isMoving = false;
    private originalParent: Node = null;
    private healthyPoint: HealthyPoint = null;
    private temporaryParent: Node = null;

    onEnable() {
        this.scheduleOnce(this.startExitSequence, 0.1);
    }
    
    private startExitSequence() {
        this.spriteRenderer = this.getComponent(Sprite);
        this.vampire = this.getComponent(Vampire);
        this.animationComponent = this.getComponent(Animation);
        this.originalParent = this.node.parent;
        this.newParentNode = this.vampire.targetParrentPoint;
        this.temporaryParent = this.vampire.temporaryParent;
        this.healthyPoint = this.vampire.target.node.getComponentInChildren(HealthyPoint);
        this.node.setParent(this.temporaryParent, true);

        if (!this.vampire) {
            this.enabled = false;
            return;
        }

        this.moneyController = this.vampire.money;
        this.exitPointNode = this.vampire.exitPoint;
        this.intermediatePointNode = this.vampire.intermidiatePoint;
        const worldPos = new Vec3();
        this.healthyPoint.node.getWorldPosition(worldPos);
        this.node.setWorldPosition(worldPos);

        if (!this.exitPointNode || !this.intermediatePointNode || !this.newParentNode) {
            this.enabled = false;
            return;
        }

        this.spriteRenderer.enabled = true;
        this.vampire.changeSprite();
        this.vampire.enableBubble();

        if (this.animationComponent) {
            this.animationComponent.play("HealthyWalk");
        } else {
            this.enabled = false;
        }

        Vec3.copy(this.moveStart, this.node.worldPosition);
        Vec3.copy(this.moveEnd, this.intermediatePointNode.worldPosition);
        this.elapsedTime = 0;

        const distanceToIntermediate = Vec3.distance(this.moveStart, this.moveEnd);
        this.moveDuration = this.moveSpeed > 0 ? distanceToIntermediate / this.moveSpeed : 0;
        if (this.moveDuration < 0.001 && distanceToIntermediate > 0.001) this.moveDuration = 0.001;

        this.movingToIntermediate = true;
        this.isMoving = true;
    }

    update(deltaTime: number) {
    if (!this.isMoving) return;

    this.elapsedTime += deltaTime;
    const t = this.moveDuration > 0 ? Math.min(this.elapsedTime / this.moveDuration, 1) : 1;

    const newPos = new Vec3();
    Vec3.lerp(newPos, this.moveStart, this.moveEnd, t);

    const deltaX = this.moveEnd.x - this.moveStart.x;
    const scale = this.node.scale.clone();
    scale.x = deltaX > 0.01 ? Math.abs(scale.x) : deltaX < -0.01 ? -Math.abs(scale.x) : scale.x;
    this.node.setScale(scale);

    this.node.setWorldPosition(newPos);

    if (t >= 1) {
        if (this.movingToIntermediate) {
            this.onReachedIntermediate();
        } else {
            this.onReachedExit();
        }
    }
}


    private onReachedIntermediate() {
        this.node.setWorldPosition(this.intermediatePointNode.worldPosition);
       this.scheduleOnce(this.changeParent.bind(this), 0.4);
        Vec3.copy(this.moveStart, this.node.worldPosition);
        Vec3.copy(this.moveEnd, this.exitPointNode.worldPosition);
        this.elapsedTime = 0;

        const distanceToExit = Vec3.distance(this.moveStart, this.moveEnd);
        this.moveDuration = this.moveSpeed > 0 ? distanceToExit / this.moveSpeed : 0;
        if (this.moveDuration < 0.001 && distanceToExit > 0.001) this.moveDuration = 0.001;

        this.movingToIntermediate = false;
        if (this.moveDuration <= 0) {
            this.onReachedExit();
        }
    }

    private onReachedExit() {
        this.node.setWorldPosition(this.exitPointNode.worldPosition);
        this.isMoving = false;
        this.completeAndDestroy();
    }

    private completeAndDestroy() {
        if (this.moneyController) {
            this.moneyController.addMoney(10);
        }
        if (this.node?.isValid) {
            this.node.destroy();
        }
    }

    private changeParent() {
        if (this.newParentNode) {
            this.node.setParent(this.newParentNode, true);
        }
    }
}