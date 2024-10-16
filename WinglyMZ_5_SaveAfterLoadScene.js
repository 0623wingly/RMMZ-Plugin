//=============================================================================
// WinglyMZ_5_SaveAfterLoadScene.js
//----------------------------------------------------------------------------
// © 2020-2024 wingly-Icoration. All Right Reserved.
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// Made with OpenAI Chat-GPT.
// https://openai.com/chatgpt
//----------------------------------------------------------------------------
// [Version History]～更新履歴～
// 1.0.0 2024/10/16 初版
//=============================================================================*/
/*:
 * @plugindesc 【wingly-Icoration】 [Tire 5] [Ver,1.0.0] [SaveAfterLoadScene] 
 * @author ﾜｲ式会社wingly Chat-GPT
 * @target MZ
 * @url https://raw.githubusercontent.com/0623wingly/RMMZ-Plugin/Tire5/WinglyMZ_5_SaveAfterLoadScene.js
 *  
 * @command OpenSavetoLoadScene
 * @text セーブ後直接ロード画面起動
 * @desc セーブ後直接ロード画面を起動します。
 *
 * @help SaveAfterLoadScene.js
 *
 * セーブ後直接ロード画面起動プラグイン
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *									Tire 5
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * このプラグインのTireは５です。Tire5のは「スタンドアロン」のプラグイン群です。
 * 通常どこに配置しても問題はありませんが、最下層に配置することを勧めます。
 * -----------------------------------------------------------------------------
 * 
 * =============================================================================
 *									機能
 * =============================================================================
 * このプラグインは、セーブ後に直接ロード画面を起動する機能を追加します。
 * プラグインコマンド「OpenSavetoLoadScene」の呼び出しをすることで、
 * セーブ画面が開かれます。
 * その後セーブ画面を閉じると、マップ画面に遷移せず直接ロード画面が開かれます。
 * 
 * また、マップ画面で"S"キーを押すことでも、呼び出せます。
 *
 * 「今の状態をセーブし、別のデータを呼び出す」という動作を行うためのものです。
 * -----------------------------------------------------------------------------
 * 
 * %&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%
 *									注意事項
 * &%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&
 * このプラグインはChat-GPT君が作成してくれたものです。
 * 僕はただ彼に依頼しただけで下のコードには一切手を付けていません。
 * むしろ理解出来ません。僕が分かるのは何が行われているのかということだけです。
 * -----------------------------------------------------------------------------
 * 
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *									利用規約
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 * なし。どうぞご自由に。お好きにお使いください。
 * ゲームジャンル問わず。無断改変、再配布、などなど諸々可能です。
 * 一切の制限がありません。このプラグインはもう既にあなたのものです。
 * -----------------------------------------------------------------------------
 *  
 * #############################################################################
 * [Version History]～更新履歴～
 * #############################################################################
 * 1.0.0 2024/10/16 初版リリース
 * -----------------------------------------------------------------------------
 *
 */

 (() => {
	"use strict";
	
	const pluginName = 'WinglyMZ_5_SaveAfterLoadScene';

	Input.keyMapper[83] = 'saveToLoad';  // 83 is the key code for 'S'

	let toLoad = false;
	let sceneClass = null;

	// シーン保存＆フラグを折ってセーブ画面を開く
	function openSaveScene() {
		sceneClass = SceneManager._scene.constructor;
		toLoad = true;
		SceneManager.push(Scene_Save);
	}

	// キープレスのチェックをマップシーンで行う
	function checkKeyPress() {
		if (Input.isTriggered('saveToLoad')) {
			openSaveScene();
		}
	}

	// マップシーンの更新にキープレスのチェックを追加
	const _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_Scene_Map_update.call(this);
		checkKeyPress();
	}

	// セーブ画面を閉じた後の処理
	const _Scene_Save_popScene = Scene_Save.prototype.popScene;
	Scene_Save.prototype.popScene = function() {
		_Scene_Save_popScene.call(this);
		if (toLoad) {
			SceneManager.push(Scene_Load);
		}
	}

	// ロード画面を閉じた後の処理
	const _Scene_Load_popScene = Scene_Load.prototype.popScene;
	Scene_Load.prototype.popScene = function() {
		_Scene_Load_popScene.call(this);
		if (toLoad) {
			toLoad = false;
			SceneManager.push(sceneClass);
		}			
	}

	// プラグインコマンドの登録
	PluginManager.registerCommand(pluginName, 'OpenSavetoLoadScene', function() {
		openSaveScene();
	});
})();

  