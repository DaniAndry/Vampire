import { _decorator, Component, Label, Button, SpriteFrame, Sprite, Tween, Vec3, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BuyButton')
export class BuyButton extends Component {
    @property(Label)
    private priceText: Label = null;

    @property(Button)
    private button: Button = null;

    @property(SpriteFrame)
    private lockSprite: SpriteFrame = null;

    private _currentLevel = 0;
    private _maxLevel = 4;
    private _prices: number[] = [];
    private _onClickCallback: Function = null;
    private _spriteRenderer: Sprite = null;

    private _originalScale: Vec3 = new Vec3();

    public initialize(prices: number[], onClickCallback: Function): void {
        this._prices = prices;
        this._onClickCallback = onClickCallback;

        this.button.node.targetOff(this);

        this.button.node.on('click', this.tryBuyInternal, this);

        this._spriteRenderer = this.getComponent(Sprite);
        this._originalScale.set(this.node.scale);
        this.updateButton();
    }

    public updateButtonState(currentMoney: number): void {
        if (!this._prices || this._currentLevel >= this._prices.length) return;

        const price = this._prices[this._currentLevel];
        const isAffordable = currentMoney >= price;
        this.setButtonVisual(isAffordable, price.toString());
    }

    public getCurrentPrice(): number {
        return this._prices[this._currentLevel];
    }

    public increaseLevel(): void {
        this._currentLevel = Math.min(this._currentLevel + 1, this._maxLevel);
        this.updateButton();
    }

    public isMaxLevel(): boolean {
        return this._currentLevel >= this._maxLevel;
    }

    private tryBuyInternal(): void {
        if (this.isMaxLevel()) {
            return;
        }

        this.animateClick(() => {
            if (this._onClickCallback) {
                try {
                    this._onClickCallback();
                    this.updateButton();
                } catch (e) {
                    console.error("Error in button callback:", e);
                }
            }
        });
    }

    private updateButton(): void {
        const text = this.isMaxLevel() ? "MAX" : this._prices[this._currentLevel].toString();
        this.setButtonVisual(true, text);
    }

    private setButtonVisual(interactable: boolean, text: string): void {
        if (this.button) this.button.interactable = interactable;
        if (this.priceText) this.priceText.string = text;
    }

    public forceDisable(): void {
        this.button.interactable = false;
    }

    public forceEnable(): void {
        this.button.interactable = true;
    }

    private animateClick(callback?: () => void): void {
        tween(this.node).stop();

        const shrinkScale = this._originalScale.clone().multiplyScalar(0.8);
        const duration = 0.1;

        tween(this.node)
            .to(duration, { scale: shrinkScale })
            .to(duration, { scale: this._originalScale })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start();
    }
}