import { _decorator, Component, Node, Vec2, Vec3, Sprite, Animation } from 'cc';
import { State } from '../../States/State';
import { Doctor } from '../../Doctor';
import { Bed } from '../../Bed';
const { ccclass, property } = _decorator;

@ccclass('DoctorMoveState')
export class DoctorMoveState extends State {

    private _speed: number = 300; 

    @property
    private _reachDistance: number = 20; 
    
    private _spriteRenderer: Sprite = null;
    private _doctor: Doctor = null;
    private _targetPosition: Vec3 = null; 
    private _isFirstUpdate: boolean = true; 
    private _updateCounter: number = 0; 
    

    enter(animator: Animation, target: Bed) {
        
        this._doctor = this.getComponent(Doctor);
        this._spriteRenderer = this.getComponent(Sprite);
        this.unscheduleAllCallbacks();
        

        super.enter(animator, target);

        this.startMoving();
    }
    

    private startMoving() {
        if (!this._doctor) {
            return;
        }
        
        this._doctor.toWalk();
        

        this.scheduleOnce(() => {
            if (this.animator) {
                this.animator.play("Walk");
            } 
        }, 0.2);
    }
    
    update(dt: number) {
        if (this._isFirstUpdate) {
            this._isFirstUpdate = false;
        }

        if (!this.target || !this.target.node) {
            return;
        }

        if (!this.target.targetPoint || !this.target.targetPoint.node) {
            return;
        }

        const targetPointWorldPos = new Vec3();
        this.target.targetPoint.node.getWorldPosition(targetPointWorldPos);
        
        const worldCurrentPos = new Vec3();
        this.node.getWorldPosition(worldCurrentPos);
        
        const moveDirection = new Vec3();
        Vec3.subtract(moveDirection, targetPointWorldPos, worldCurrentPos);
        
        const distanceToTargetPoint = moveDirection.length();


        if (distanceToTargetPoint <= this._reachDistance) {
            if (this._doctor) {
                this._doctor.toStop();
            }
            return;
        }
        

        moveDirection.normalize();
        

        const moveAmount = this._speed * dt;
        

        const newWorldPos = new Vec3(
            worldCurrentPos.x + moveDirection.x * moveAmount,
            worldCurrentPos.y + moveDirection.y * moveAmount,
            worldCurrentPos.z + moveDirection.z * moveAmount
        );
        
        this.node.setWorldPosition(newWorldPos);
        
        this.updateSpriteDirection(moveDirection);
    }
    
    private updateSpriteDirection(moveDirection: Vec3) {
        if (!this.node) return;
        
        if (moveDirection.x < 0.01) {
            const newScale = new Vec3(
                Math.abs(this.node.scale.x),
                this.node.scale.y,
                this.node.scale.z
            );
            this.node.setScale(newScale);
        } else if (moveDirection.x > -0.01) {
            const newScale = new Vec3(
                -Math.abs(this.node.scale.x),
                this.node.scale.y,
                this.node.scale.z
            );
            this.node.setScale(newScale);
        }
    }  
}