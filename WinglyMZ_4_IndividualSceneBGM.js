//=============================================================================
// IndividualSceneBGM.js
//----------------------------------------------------------------------------
// © 2020-2024 wingly-Icoration. All Right Reserved.
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// Made with OpenAI Chat-GPT.
// https://openai.com/chatgpt
//----------------------------------------------------------------------------
// [Version History]～更新履歴～
// α0.0.0 メニュー画面BGMの再生機能定義
//=============================================================================*/
/*:
 * @plugindesc 【wingly-Icoration】 [Tire 4] [Ver,1.0.0] [IndividualSceneBGM] 
 * @author ﾜｲ式会社wingly Chat-GPT
 * @target MZ
 * @url https://raw.githubusercontent.com/0623wingly/RMMZ-Plugin/main/WinglyMZ_4_IndividualSceneBGM.js
 *
 * @help
 *
 * WinglyプラグインNo.1
 * 
 * @param menuBGMSettings
 * @text Scene_Menu再生BGM
 * @desc メニュー画面で再生するBGMを設定してください。
 * @type struct<SceneBGMSettings>
 *
 * @param isMenuBGMkeep
 * @text メニュー画面BGM保持
 * @desc Trueなら再生位置が維持されます。Falseなら維持しません。<br>デフォルトはTrueです。
 * @type boolean
 * @default true
 * @on 維持
 * @off リセット
 */

/*~struct~SceneBGMSettings:
 * @param variableId
 * @text バインドする変数のID
 * @desc このシーンにバインドさせる変数のIDです。<br>この変数の値に応じてBGMが動的に切り替わります。
 * @type variable
 * @default 0
 *
 * @param bgmList
 * @text 再生するBGMリスト
 * @desc このシーンで再生するBGMのリストです。<br>一番上のBGMがデフォルトで再生されます。
 * @type struct<BGMSetting>[]
 */

/*~struct~BGMSetting:
 * @param fileName
 * @text ファイル名
 * @desc 再生するBGMのファイル名を入力してください。
 * @type file
 * @dir audio/bgm
 * @default
 *
 * @param volume
 * @text 音量
 * @desc 再生するBGMの音量を設定してください。<br>最小値:0/最大値:200
 * @type number
 * @default 100
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc 再生するBGMのピッチを設定してください。<br>最小値:50/最大値:200
 * @type number
 * @default 100
 * @min 50
 * @max 200
 *
 * @param pan
 * @text 位相
 * @desc 再生するBGMの位相を設定してください。<br>最小値:-100/最大値:100
 * @type number
 * @default 0
 * @min -100
 * @max 100
 */

(() => {
    'use strict';

    const pluginName = 'WinglyMZ_4_IndividualSceneBGM';
    const parameters = PluginManager.parameters(pluginName);

    let previousBgm = null;  // 非対応シーン用のBGM保存スロット（Aスロ）

    class MenuSceneBGM {
        static saveBGM() {
            previousBgm = AudioManager.saveBgm();
        }

        static playMenuBGM() {
            const bgmSettings = JSON.parse(parameters['menuBGMSettings']);
            const variableId = parseInt(bgmSettings.variableId, 10) || 0;
            const bgmList = JSON.parse(bgmSettings.bgmList).map(bgm => JSON.parse(bgm));
            
            const index = $gameVariables.value(variableId);
            
            if (index >= 0 && index < bgmList.length) {
                const bgm = bgmList[index];
                if (bgm && bgm.fileName) {
                    this.saveBGM();
                    AudioManager.playBgm({
                        name: bgm.fileName,
                        volume: parseInt(bgm.volume, 10),
                        pitch: parseInt(bgm.pitch, 10),
                        pan: parseInt(bgm.pan, 10)
                    });
                }
            }
        }

        static leaveMenuScene() {
            AudioManager.replayBgm(previousBgm); //AudioManager.stopBgm();
        }
    }

    // Scene_Menu の start メソッドをオーバーライドして BGM 再生
    const _Scene_Menu_start = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.call(this);
        MenuSceneBGM.playMenuBGM();
    };

    // Scene_Menu の terminate メソッドをオーバーライドして BGM 停止
    const _Scene_Menu_terminate = Scene_Menu.prototype.terminate;
    Scene_Menu.prototype.terminate = function() {
        _Scene_Menu_terminate.call(this);
        MenuSceneBGM.leaveMenuScene();
    };

})();
