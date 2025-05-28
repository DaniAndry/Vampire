import { _decorator, Component, Node } from 'cc';
import super_html_playable  from '../../src/super_html/super_html_playable';

const { ccclass, property } = _decorator;


@ccclass('OnClickToPlay')
export class OnClickToPlay extends Component {

     onLoad() {
            super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.crazypandafzco.vampirekingdom&hl=en");
            super_html_playable.set_app_store_url("https://apps.apple.com/us/app/vampire-legacy-city-builder/id6468058020");
     }

    public Click()
    {
         super_html_playable.download();
    }
}




