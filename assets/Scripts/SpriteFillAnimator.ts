import { _decorator, Component, Node, Sprite, tween, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpriteFillAnimator')
export class SpriteFillAnimator extends Component {
    @property(Sprite)
    private imageFill: Sprite = null;
    
    @property(Sprite)
    private imageEmpty: Sprite = null;
    
    @property
    private fillSpeed: number = 1;

    private isFilled: boolean = false;
    private isAnimating: boolean = false;
    
    switchFill() {
        if (!this.isAnimating) {
            this.fillRoutine();
        }
    }

    private fillRoutine() {
        this.isAnimating = true;

        const start = this.isFilled ? 1 : 0;
        const end = this.isFilled ? 0 : 1;
        
        // В Cocos Creator нет прямого аналога fillAmount для Sprite
        // Поэтому используем tween для анимации
        tween(this.imageFill)
            .to(this.fillSpeed, { fillRange: end }, {
                onUpdate: (target, ratio) => {
                    // Мы можем использовать свойство fillRange для Sprite в Cocos Creator
                    // если imageFill настроен как filled sprite, иначе нужно будет 
                    // использовать другой подход (например, изменение scale)
                    this.imageFill.fillRange = start + (end - start) * ratio;
                }
            })
            .call(() => {
                this.isFilled = !this.isFilled;
                this.isAnimating = false;
                this.node.destroy(); // Аналог Destroy(gameObject)
            })
            .start();
    }
}
