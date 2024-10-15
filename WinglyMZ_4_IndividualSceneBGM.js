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
// α0.1.0 メニュー画面BGMの再生位置保持機能定義
// α0.1.1 プラグインコマンドでメニュー画面BGM保持設定を変更できるよう定義
// α0.2.0 対応シーンBGMの再生機能定義
// α0.2.1 対応シーン離脱時にAスロをレジュームするように定義
//=============================================================================*/
/*:
 * @plugindesc 【wingly-Icoration】 [Tire 4] [Ver,α0.2.0] [IndividualSceneBGM] 
 * @author ﾜｲ式会社wingly Chat-GPT
 * @target MZ
 * @url https://raw.githubusercontent.com/0623wingly/RMMZ-Plugin/Tire4/WinglyMZ_4_IndividualSceneBGM.js
 *
 * @help
 *
 * WinglyプラグインNo.1
 * 
 * @command pushScene
 * @text 指定のSceneに遷移
 * @desc 指定のSceneに遷移します。
 *
 * @arg sceneName
 * @text 遷移するScene
 * @desc 遷移するSceneを選択してください。
 * @type select
 * @option メニュー
 * @value Scene_Menu
 * @option アイテム
 * @value Scene_Item
 * @option スキル
 * @value Scene_Skill
 * @option 装備
 * @value Scene_Equip
 * @option ステータス
 * @value Scene_Status
 * @option オプション
 * @value Scene_Options
 * @option セーブ
 * @value Scene_Save
 * @option ロード
 * @value Scene_Load
 * @option ゲーム終了
 * @value Scene_GameEnd
 *
 * @command pushScenewithArg
 * @text 引数を渡して指定のSceneに遷移
 * @desc 引数を渡して指定のSceneに遷移します。<br>※注意※変数の値が変更されます。
 * 
 * @arg index
 * @text 変数の値
 * @desc 遷移先のSceneの変数の値を指定してください。<br>変数がバインドされてない場合無視されます。
 * @type number
 * @min 0
 *
 * @arg sceneName
 * @text 遷移するScene
 * @desc 遷移するSceneを選択してください。
 * @type select
 * @option メニュー
 * @value Scene_Menu
 * @option アイテム
 * @value Scene_Item
 * @option スキル
 * @value Scene_Skill
 * @option 装備
 * @value Scene_Equip
 * @option ステータス
 * @value Scene_Status
 * @option オプション
 * @value Scene_Options
 * @option セーブ
 * @value Scene_Save
 * @option ロード
 * @value Scene_Load
 * @option ゲーム終了
 * @value Scene_GameEnd
 * 
 * @command MenuBGMkeepOption
 * @text メニュー画面BGM保持設定変更
 * @desc メニュー画面BGMを保持するかどうかを設定できます。<br>パラメーターでの設定より優先されます。
 * 
 * @arg isMenuBGMkeep
 * @text メニュー画面BGM保持
 * @desc メニュー画面BGMを保持するかどうかを設定できます。<br>デフォルトはTrueです。
 * @type boolean
 * @default true
 * @on 維持
 * @off リセット
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
 *
 * @param itemBGMSettings
 * @text Scene_Item再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param skillBGMSettings
 * @text Scene_Skill再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param equipBGMSettings
 * @text Scene_Equip再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param statusBGMSettings
 * @text Scene_Status再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param optionsBGMSettings
 * @text Scene_Options再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param saveBGMSettings
 * @text Scene_Save再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param loadBGMSettings
 * @text Scene_Load再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param gameEndBGMSettings
 * @text Scene_GameEnd再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param shopBGMSettings
 * @text Scene_Shop再生BGM
 * @type struct<SceneBGMSettings>
 *
 * @param nameBGMSettings
 * @text Scene_Name再生BGM
 * @type struct<SceneBGMSettings>
 *
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
    let MenuBGMkeep = parameters['isMenuBGMkeep'] === 'true';

    let previousBgm = null;  // 非対応シーン用のBGM保存スロット（Aスロ）
    let menuBgm = null;  // メニュー専用のBGM保存スロット（Bスロ）

    let playedASceneBGM = false; // 対応シーンBGMを再生したかを判別
    let playedBSceneBGM = false; // メニュー画面BGMを再生したかを判別
    let preMenuIndex = null;  // 以前に再生されたメニュー画面BGMのインデックス

    const sceneBgmMapping = {
        'Scene_Item': 'itemBGMSettings',
        'Scene_Skill': 'skillBGMSettings',
        'Scene_Equip': 'equipBGMSettings',
        'Scene_Status': 'statusBGMSettings',
        'Scene_Options': 'optionsBGMSettings',
        'Scene_Save': 'saveBGMSettings',
        'Scene_Load': 'loadBGMSettings',
        'Scene_GameEnd': 'gameEndBGMSettings',
        'Scene_Shop': 'shopBGMSettings',
        'Scene_Name': 'nameBGMSettings'
    };

    const currentScene = SceneManager._scene; // 現在のシーンを取得
    const previousScene = SceneManager._stack[SceneManager._stack.length - 1]; // 以前のシーンを取得
    const nextScene = SceneManager._nextScene; // 次のシーンを取得

    const SupportedScene = (sceneName) => sceneBgmMapping[sceneName];
    const ExcludedScene = (sceneName) => ['Scene_Boot', 'Scene_Base', 'Scene_MenuBase', 'Scene_File', 'Scene_Title'].includes(sceneName);
    const UnsupportedScene = (sceneName) => !SupportedScene(sceneName) && !ExcludedScene(sceneName);

//=============================================================================
//メニューシーンのBGM再生に関するクラス
//=============================================================================

    class MenuSceneBGM {
        static saveBGM() { //AスロにBGMを保存するスタティックメソッド
            if (!playedASceneBGM && !playedBSceneBGM) { //対応シーンのBGMも、メニューシーンのBGMも再生されていない場合
                previousBgm = AudioManager.saveBgm(); // 現在再生中のBGMをAスロに保存
            } else { //そうでなければ何もしない
                return;
            }
        }

        static setupMenuSceneBGM () { //パラメーターからメニュー画面BGMの設定を読み込み
            const menubgmSettings = JSON.parse(parameters['menuBGMSettings']);
            const menuvariableId = parseInt(menubgmSettings.variableId, 10) || 0;
            const menubgmList = JSON.parse(menubgmSettings.bgmList).map(bgm => JSON.parse(bgm));
            const menuIndex = $gameVariables.value(menuvariableId); // 変数の値をインデックスに代入

            return { bgmList: menubgmList, menuIndex: menuIndex }; //BGM再生のための値を返す
        }

        static playMenuBGM() { //メニュー画面BGMを再生するスタティックメソッド
            const { bgmList, menuIndex } = this.setupMenuSceneBGM();  // bgmList と menuIndex を取得
            if (MenuBGMkeep && menuBgm && preMenuIndex === menuIndex) { // 再生位置保持がONで、BスロにBGMが存在し、Bスロに保存したメニュー画面BGMのインデックスとこれから再生予定のメニュー画面BGMのインデックスが一致する場合は
                this.saveBGM();  // Aスロに保存
                AudioManager.replayBgm(menuBgm); //Bスロレジューム
                playedBSceneBGM = true;  // メニュー画面BGMを再生したことを示す
                return; // これ以上処理をしない
            } else if (menuIndex >= 0 && menuIndex < bgmList.length) { // BGMが存在する場合、現在の変数の値のインデックスのBGMを再生
                    const bgm = bgmList[menuIndex];
                    if (bgm && bgm.fileName) {
                        this.saveBGM();  // Aスロに保存
                        AudioManager.playBgm({
                            name: bgm.fileName,
                            volume: parseInt(bgm.volume, 10),
                            pitch: parseInt(bgm.pitch, 10),
                            pan: parseInt(bgm.pan, 10)
                        });
                        playedBSceneBGM = true;  // メニュー画面BGMを再生したことを示す
                        preMenuIndex = menuIndex; // 再生したメニュー画面BGMのインデックスを保存
                    } else {
                        playedBSceneBGM = false;  // メニュー画面BGMを再生していないことを示す
                    }
                } else {
                    playedBSceneBGM = false;  // メニュー画面BGMを再生していないことを示す
                }
        }

        static leaveMenuScene() { // メニューシーンを離脱する時のスタティックメソッド
            if (MenuBGMkeep && playedBSceneBGM) { // 再生位置保持がONでメニュー画面BGMが再生されている場合
                menuBgm = AudioManager.saveBgm(); // Bスロに保存
            }
            AudioManager.replayBgm(previousBgm);  // 非対応シーン用のBGMを復元
            playedBSceneBGM = false;  // メニュー画面BGMを再生していないことを示す
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

//=============================================================================
//対応のBGM再生に関するクラス
//=============================================================================

    class IndividualSceneBGM {
        static saveBGM() { //AスロにBGMを保存するスタティックメソッド
            if (!playedASceneBGM && !playedBSceneBGM) { //対応シーンのBGMも、メニューシーンのBGMも再生されていない場合
                previousBgm = AudioManager.saveBgm(); // 現在再生中のBGMをAスロに保存
            } else { //そうでなければ何もしない
                return;
            }
        }

        static setupIndividualSceneBGM(sceneName) { //パラメーターから対応シーンBGMの設定を読み込み
            const bgmSettingsString = parameters[sceneBgmMapping[sceneName]];
            if (!bgmSettingsString) {
                return { bgmList: [], index: -1 };  // 空のリストと無効なインデックスを返す
            }

            const bgmSettings = JSON.parse(parameters[sceneBgmMapping[sceneName]]);
            const variableId = parseInt(bgmSettings.variableId, 10) || 0;
            const bgmList = JSON.parse(bgmSettings.bgmList).map(bgm => JSON.parse(bgm));
            const index = $gameVariables.value(variableId); // 変数の値をインデックスに代入

            return { bgmList: bgmList, index: index }; //BGM再生のための値を返す
        }

        static playIndividualSceneBGM(sceneName) { //メニュー画面BGMを再生するスタティックメソッド
            const { bgmList, index } = this.setupIndividualSceneBGM(sceneName);  // bgmList と menuIndex を取得
            if (index >= 0 && index < bgmList.length) { // BGMが存在する場合、現在の変数の値のインデックスのBGMを再生
                    const bgm = bgmList[index];
                    if (bgm && bgm.fileName) {
                        this.saveBGM();  // Aスロに保存
                        AudioManager.playBgm({
                            name: bgm.fileName,
                            volume: parseInt(bgm.volume, 10),
                            pitch: parseInt(bgm.pitch, 10),
                            pan: parseInt(bgm.pan, 10)
                        });
                        playedASceneBGM = true;  // 対応シーンBGMを再生したことを示す
                    } else {
                        playedASceneBGM = false;  // 対応シーンBGMを再生していないことを示す
                    }
                } else {
                    playedASceneBGM = false;  // 対応シーンBGMを再生していないことを示す
                }
        }

        static leaveIndividualScene() { // 対応シーンを離脱する時のスタティックメソッド
            if (playedASceneBGM) { //対応シーンBGMが再生されている場合
                AudioManager.replayBgm(previousBgm);  // 非対応シーン用のBGMを復元
                playedASceneBGM = false;  // 対応シーンBGMを再生していないことを示す
            }            
        }
    }

    // Scene_Base の start メソッドをオーバーライドして BGM 再生
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        const sceneName = this.constructor.name;  // 現在のシーン名を取得
        console.log(sceneName);
        if (SupportedScene(sceneName)) {
            IndividualSceneBGM.playIndividualSceneBGM(sceneName);  // 対応シーンのBGMを停止
        }
    };

    // Scene_Base の terminate メソッドをオーバーライドして BGM 停止
    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.call(this);
        const sceneName = this.constructor.name;  // 現在のシーン名を取得
        if (SupportedScene(sceneName)) {
            IndividualSceneBGM.leaveIndividualScene(sceneName);  // 対応シーンのBGMを停止
        }
    
    };

//=============================================================================
// プラグインコマンド
//=============================================================================
    
    PluginManager.registerCommand(pluginName, "pushScene", args => {
        const sceneName = args.sceneName;
        if (typeof window[sceneName] === 'function') {
            SceneManager.push(window[sceneName]);
        } else {
            console.error(`Invalid Scene: ${sceneName}`);
        }
    });

    PluginManager.registerCommand(pluginName, "pushScenewithArg", args => {
        const sceneName = args.sceneName;
        const index = parseInt(args.index, 10);
        const bgmSettings = parameters[sceneBgmMapping[sceneName]];

        if (bgmSettings) {
            try {
                const parsedBgmSettings = JSON.parse(bgmSettings);
                const variableId = parseInt(parsedBgmSettings.variableId, 10) || 0;
                $gameVariables.setValue(variableId, index);
            } catch (error) {
                console.error(`Failed to parse BGM settings for scene: ${sceneName}`, error);
            }
        }

        if (typeof window[sceneName] === 'function') {
         SceneManager.push(window[sceneName]);
        } else {
            console.error(`Invalid Scene: ${sceneName}`);
        }
    });

    // メニュー画面BGMの設定変更
    PluginManager.registerCommand(pluginName, "MenuBGMkeepOption", args => {
        MenuBGMkeep = (args.isMenuBGMkeep === "true");
        console.log(MenuBGMkeep);

        if (!MenuBGMkeep) { // falseにしたら、Bスロを空にする
            menuBgm = null;
            preMenuIndex = null;
        }
    });

})();
