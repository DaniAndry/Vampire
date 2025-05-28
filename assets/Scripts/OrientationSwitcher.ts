import { _decorator, Component, Node, view, Size, UITransform, Vec3, Camera, screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OrientationSwitcher')
export class OrientationSwitcher extends Component {
    @property(Node)
    canvasNode: Node = null;

    @property(Node)
    mainCameraNode: Node = null;

    @property(Vec3)
    portraitCameraPosition: Vec3 = new Vec3(0, 0, -10);

    @property(Vec3)
    landscapeCameraPosition: Vec3 = new Vec3(0, 0, -10);

    @property
    portraitOrthoHeight: number = 5;

    @property
    landscapeOrthoHeight: number = 7;

    @property(Node)
    portraitButton1: Node = null;

    @property(Node)
    portraitButton2: Node = null;

    @property(Node)
    landscapeButton1: Node = null;

    @property(Node)
    landscapeButton2: Node = null;

     @property(Node)
    portraitLogo: Node = null;

     @property(Node)
    LandscapeLogo: Node = null;

    @property(Size)
    portraitResolution: Size = new Size(720, 1280);

    @property(Size)
    landscapeResolution: Size = new Size(1280, 720);

    private _lastIsPortrait: boolean = false;

    start() {
        this._lastIsPortrait = this.isPortrait();
        this.applyOrientation(this._lastIsPortrait);
    }

    update() {
        const currentIsPortrait = this.isPortrait();
        if (currentIsPortrait !== this._lastIsPortrait) {
            this.applyOrientation(currentIsPortrait);
            this._lastIsPortrait = currentIsPortrait;
        }
    }

    private isPortrait(): boolean {
        const windowSize = screen.windowSize;
        return windowSize.height >= windowSize.width;
    }

    private applyOrientation(isPortrait: boolean) {
        const resolution = isPortrait ? this.portraitResolution : this.landscapeResolution;
        view.setDesignResolutionSize(resolution.width, resolution.height, view.getResolutionPolicy());

        // Установка contentSize на Canvas
        if (this.canvasNode) {
            const uiTransform = this.canvasNode.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(resolution);
            }
        }

        // Настройка камеры: позиция и orthoHeight
        if (this.mainCameraNode) {
            this.mainCameraNode.setPosition(isPortrait ? this.portraitCameraPosition : this.landscapeCameraPosition);

            const cameraComp = this.mainCameraNode.getComponent(Camera);
            if (cameraComp && cameraComp.orthoHeight) {
                cameraComp.orthoHeight = isPortrait ? this.portraitOrthoHeight : this.landscapeOrthoHeight;
            }
        }

        this.setButtonVisibility(isPortrait);
        view.resizeWithBrowserSize(true);
    }

    private setButtonVisibility(isPortrait: boolean) {
        if (this.portraitButton1) this.portraitButton1.active = isPortrait;
        if (this.portraitButton2) this.portraitButton2.active = isPortrait;
        if (this.landscapeButton1) this.landscapeButton1.active = !isPortrait;
        if (this.landscapeButton2) this.landscapeButton2.active = !isPortrait;
        if(this.portraitLogo) this.portraitLogo.active = isPortrait;
        if(this.LandscapeLogo) this.LandscapeLogo.active = !isPortrait;
    }
}
