import SingtonClass from "./SingtonClass";
import LocalStorageUtil from "./LocalStorageUtil";

export default class SoundUtil extends SingtonClass {
    static isPlayMusic;

    static init() {
        SoundUtil.isPlayMusic = LocalStorageUtil.getBoolean("isPlayMusic", true)

        SoundUtil.playBgm();
    }

    static stopMusic() {
        if (SoundUtil.isPlayMusic) {
            SoundUtil.isPlayMusic = false;
            LocalStorageUtil.setBoolean("isPlayMusic", SoundUtil.isPlayMusic);
            Laya.SoundManager.stopMusic();
            Laya.SoundManager.stopAllSound();
            
            //解决vivo rpk内无法关闭声音的问题
            Laya.timer.once(50, this, () => {
                Laya.SoundManager.playMusic("music/bgm.mp3", 0, null);
                Laya.SoundManager.stopAll();
            })
        }
    }

    static playMusic() {
        if (!SoundUtil.isPlayMusic) {
            SoundUtil.isPlayMusic = true;
            LocalStorageUtil.setBoolean("isPlayMusic", SoundUtil.isPlayMusic);
            SoundUtil.playBgm();
        }
    }

    static playBgm() {
        if (SoundUtil.isPlayMusic) {
            Laya.SoundManager.stopMusic();
            Laya.SoundManager.playMusic("music/bgm.mp3", 0, null);
        }
    }

    static playCoin() {
        if (SoundUtil.isPlayMusic) {
            Laya.SoundManager.stopSound("music/coin.wav");
            Laya.SoundManager.playSound("music/coin.wav");
        }
    }

    static playStartGame() {
        if (SoundUtil.isPlayMusic) {
            Laya.SoundManager.stopSound("music/start.wav");
            Laya.SoundManager.playSound("music/start.wav");
        }
    }
}