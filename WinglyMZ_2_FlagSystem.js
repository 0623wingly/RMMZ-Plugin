//=============================================================================
// FlagSystem.js フラグシステム追加プラグイン
//----------------------------------------------------------------------------
// © 2025 wingly-Icoration. All Right Reserved.
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// Made with OpenAI Chat-GPT.
// https://openai.com/chatgpt
//----------------------------------------------------------------------------
// [Version History]～更新履歴～
// 
//=============================================================================*/
/*:
 * @plugindesc 【wingly-Icoration】 [Tire 2] [Ver,0.0.1] [FlagSystem] 
 * @author ﾜｲ式会社wingly Chat-GPT
 * @target MZ
 * @base PluginCommonBase
 * @url https://raw.githubusercontent.com/0623wingly/RMMZ-Plugin/refs/heads/Tire2/WinglyMZ_2_FlagSystem.js
 *
 * @help
 *
 * WinglyプラグインNo.3
 * イベントの進行状況を管理する「フラグ」を追加するプラグイン
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                                  Tire 2
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * このプラグインのTireは2です。Tire2は「独自機能・独自構造」のプラグイン群です。
 * 他のプラグインとの競合に注意し、Tire1より下Tire3より上に配置してください。
 * ただし、VisuStellaのTire2プラグインよりも下に配置してください。
 * ----------------------------------------------------------------------------
 * 
 * ============================================================================
 *                                  概要
 * ============================================================================
 * 「フラグ」はスイッチに代わる、新たな条件分岐アイテムです。
 * イベントの進行状況を管理するための多機能専門スイッチのようなものです。
 * スイッチとは違い、多くのプロパティを持ち、複数の異なる状態を持ちます。
 * そのため、より複雑な条件分岐や、関連性を持たすことが可能です。
 * フラグは、$gameFlagsオブジェクトによって定義されています。
 * フラグの管理はdataフォルダ内の「Flags.json」ファイルで行います。
 * このJSONファイルはテストプレイ開始時に自動生成されます。
 * フラグはこのJSONを直接編集することで追加・削除・変更が可能です。
 * プラグインコマンドを使ってのフラグの操作も可能です。
 * Flags.jsonはあくまでもフラグのデフォルト値を保持するためのものであり、
 * ゲーム中に変更されたフラグデータは各セーブデータに保存されます。
 * 
 * ============================================================================
 *                                  特徴
 * ============================================================================
 * フラグは基本的にはスイッチと同様に扱うことができますが、
 * スイッチにはないいくつかの特徴があります。
 * 
 * ①フラグタイプ
 * フラグは二種類存在します。
 * 「ローカルフラグ(ノーマルフラグ)」と「グローバルフラグ」です。
 * これらはプロパティ"type"によって定義されます。
 * 0なら、ローカルフラグ、1ならグローバルフラグです。
 * デフォルトでは0が代入されています。
 * フラグの状態や値は、各セーブファイル依存となりますが、
 * グローバルフラグの状態や値は全てのセーブファイルで共有されるため、
 * ゲーム全体で、共通のフラグとして使用することができます。
 * 
 * ②名称
 * スイッチは、IDで管理されていますが、フラグは名称で管理されます。
 * フラグの名称はプロパティ"name"によって定義されます。
 * フラグの名前を文字列として格納してください。
 * このフラグの名称は厳格に判別されます。
 * 例えば、"Flag1"と"flag1"と"flag 1"は別のフラグとして扱われます。
 * 
 * ③状態
 * フラグには、計４つの状態が存在します。True, False, Lock, Brokenです。
 * これらの状態はプロパティ"condition"によって定義されます。
 * このプロパティには状態がそのまま文字列として格納されます。
 * 
 * ----------------------------------------------------------------------------
 * "それぞれの状態について"
 * ----------------------------------------------------------------------------
 * ⒈True
 * スイッチと同様の状態です。フラグの値の判別が有効であることを示します。
 * このフラグの状態を「立っている状態」といいます。
 * また、フラグをこの状態にすることを「フラグを立たせる、上げる」といいます。
 * この状態のフラグは「正のフラグ」として評価されます。
 * 
 * ⒉False
 * スイッチにはない状態です。フラグの値の判別が無効であることを示します。
 * このフラグの状態を「下ろされている状態」といいます。
 * また、フラグをこの状態にすることを「フラグを下ろす」といいます。
 * この状態のフラグは「負のフラグ」として評価されます。
 * 負のフラグは値に関わらず、評価時にfalseが返されます。
 * 
 * ⒊Lock
 * スイッチにはない状態です。
 * フラグの評価が行われ、値が固定されていることを示します。
 * このフラグの状態を「回収されている状態」といいます。
 * また、フラグをこの状態にすることを「フラグを回収する」といいます。
 * 基本的にはTrueと同じく正のフラグとして扱われますが、
 * 値を変更することができず、固定された完全なフラグとしても扱われます。
 * そのため、この状態のフラグは「完全に正のフラグ」として評価されます。
 * 
 * ⒋Broken
 * スイッチにはない状態です。
 * フラグの評価が行われず、値が不明であることを示します。
 * このフラグの状態を「折れている状態」といいます。
 * また、フラグをこの状態にすることを「フラグを折る」といいます。
 * 基本的にはFalseと同じく負のフラグとして扱われますが、
 * 値を変更することができず、固定された完全なフラグとしても扱われます。
 * そのため、この状態のフラグは「完全に負のフラグ」として評価されます。
 * 
 * ----------------------------------------------------------------------------
 * ④値
 * スイッチ同様、フラグもブール値を持ちます。trueかfalseです。
 * この値はプロパティ"value"によって定義されます。
 * 値がtrueのフラグを「真フラグ」、
 * 値がfalseのフラグを「偽フラグ」として評価します。
 * 前述の通り、負のフラグは値に関わらず、評価時にfalseが返されます。
 * 
 * ⑤優先度
 * フラグにはスイッチとは異なり、優先度を付けることができます。
 * 優先度はプロパティ"priority"によって定義され、0以上の整数で表されます。
 * 全てのフラグはデフォルトで優先度0を持ちます。
 * この優先度は、複数のフラグを利用するときに活用されます。
 * 複数のフラグが同時に評価される場合、優先度の高いフラグが優先的に評価されます。
 * また、優先度が高いフラグは、自身よりも優先度の低いフラグを子として関連付けて、
 * グループを形成することができます。
 * 
 * ⑥関連性
 * フラグはスイッチとは異なり、フラグ同士で関連性を持たせることができます。
 * フラグの関連性は、プロパティ"relation"によって定義されます。
 * 関連性を持たない場合は、0,なんらかの関連性を持つ場合は1です。
 * BANされた場合は-1です。
 * 関連付けがされている場合は、優先度を変更することができません。
 * 
 * ----------------------------------------------------------------------------
 * "フラグの関連付けについて"
 * ----------------------------------------------------------------------------
 * 親となる優先度の高いフラグを起点に、
 * 自身よりも優先度の低いフラグを子フラグとして関連付けることができます。
 * このフラグの親子関係は、FlagGroup.jsonファイルで管理されます。
 * このJSONファイルもテストプレイ開始時に自動生成されます。
 * FlagGroup.jsonは、グループ名をキーとして、親フラグと
 * その親フラグに関連付けられた子フラグの名前の配列を値として持ちます。
 * 優先度の項目で説明した通り、子フラグは親フラグよりも優先度が低い必要があります。
 * 
 * 子フラグは"status"プロパティを持ちます。
 * このプロパティには、子フラグの状態が格納されます。
 * 通常なら0,除外されていたら1,BANされていたら-1です。
 * 
 * フラグの関連付けのルールを以下に示します。
 * ⒈フラグの関連付けには、優先度の異なる二つ以上のフラグが必要である。
 * ⒉その中で最も優先度が高いフラグが親フラグとなり、
 * 　その親フラグよりも優先度の低いフラグが子のフラグとして関連付けられる。
 * ⒊優先度が0のフラグは親フラグになることができない。
 * ⒋完全なフラグは関連付けを行うことができない。
 * ⒌グループ名は、フラグ名称同様、全て異なるものである必要がある。
 * 
 * ----------------------------------------------------------------------------
 * "フラグ同士の呼応について"
 * ----------------------------------------------------------------------------
 * 関連付けられた子フラグは、親フラグの変化に"呼応"するようになります。
 * 基本的には、親フラグが回収された時、全ての子フラグが自動的に立ちます。
 * これにより、例えば、第一章のクリアフラグを回収し、
 * 次の第二章に関わるイベントのフラグを立たせ、
 * 第二章のイベントを開始するといったようなことができます。
 * ちなみに、親フラグの変化に合わせ、子フラグを変化させられるだけであり、
 * 子フラグの変化に合わせ、親フラグの状態や値を変化させることはできません。
 * この呼応について、呼応条件と呼応結果はFlagGroup.jsonで管理されます。
 * 呼応条件はプロパティ"trigger"によって定義されます。
 * 呼応結果はプロパティ"effect"によって定義されます。
 * どちらも、条件にする、または変化先の状態と値が格納されます。
 * 
 * ----------------------------------------------------------------------------
 * "例外化"
 * ----------------------------------------------------------------------------
 * 基本的に、子のフラグは親のフラグに呼応して状態や値が変化しますが、
 * 例外化させることで、子フラグが親フラグに呼応しないようにすることができます。
 * 二種類の例外化があります。"除外"と"BAN"です。
 * どちらも共通して親のフラグに呼応しないという特徴を持ちます。
 * しかし、BANされたフラグはそのグループから外されるため、
 * 親のフラグに呼応しなくなります。
 * それだけでなく、そのフラグはグループを形成することも、
 * グループに所属することもできなくなります。
 * 除外はそのグループからのみ外されるだけですが、
 * BANは全てのグループから外されます。
 * 元の関連性の情報は保持されているため、
 * いつでも元に戻すことができます。
 * これらの例外的な子のフラグは、プロパティ"relation"によって定義されます。
 * 
 * ----------------------------------------------------------------------------
 * "フラグの作成方法"
 * ----------------------------------------------------------------------------
 * フラグを作成することを、"フラグを制定する"といいます。
 * フラグを制定する方法は二つあります。
 * 一つ目は、後述する「フラグコマンド(`setcommand`)」を使用する方法です。
 * これは最も簡単であり、最も安全な方法です。
 * 基本的にはフラグコマンドを利用することを推奨します。
 * 二つ目は、直接、Flags.jsonを編集する方法です。
 * 一気に複数のフラグを視覚的に分かりやすく制定することができますが、
 * 各フラグのプロパティの性質を正確に把握している必要があります。
 * テストプレイ開始時に毎回Flags.jsonがチェックされ、
 * 不正なデータがある場合は、自動的に修正されます。
 * もし、Flags.jsonを直接編集することが多い場合は、
 * 下記で紹介するパラメーター"makebackup"をONにしておくとよいでしょう。
 * いづれにせよ、jsonの直接編集は非推奨です。
 * 
 * ============================================================================
 *                              プラグインパラメーター
 * ============================================================================
 * "outputFlaginfo"
 * ----------------------------------------------------------------------------
 * テストプレイ時に、フラグ情報を出力するかどうかを設定します。
 * trueの場合、セーブデータロード後に、
 * そのセーブデータのフラグ情報がデバッグコンソールに出力されます。
 * それぞれのフラグのプロパティが、
 * 現在どうなっているのかを確認したい場合に使用してください。
 * デフォルトはtrueです。
 * 
 * ============================================================================
 *                                 機能
 * ============================================================================
 * "フラグコマンド"
 * ----------------------------------------------------------------------------
 * フラグコマンドとは、フラグをコントロールするためのコマンドです。
 * フラグの情報を取得する、`debugcommand`、
 * フラグの制定を行う、`setcommand`、
 * フラグの操作(変更)を行う、`editcommand`、
 * フラグの評価を行う、`evalcommand`、
 * フラグの関連付けを行う、`relatecommand`があります。
 * 基本的に、フラグコマンドは、プラグインコマンド、
 * スクリプトコマンドで、同様の名称、機能を持ちます。
 * しかし、一部、プラグインコマンドでのみ扱えるものと、
 * スクリプトコマンドでのみ扱えるものがあります。
 * 
 * 基本的なフラグコマンドの式は以下の通りです。
 * $gameFlags.[flagcommand](arg1, arg2, arg3, ...);
 * 一部のフラグコマンドは、"$gameFlags."を省略して、
 * グローバル関数として使用することができます。
 * 基本的に、第一引数はプロパティ"name"の値になることが多いです。
 * 基本的には引数に"name"が必須ですが、省略することが可能です。
 * 省略する場合は、本来の引数の位置に、nullを代入してください。
 * 省略された場合は、
 * 一番最後に`evalcommand`で評価されたフラグの名称が自動的に代入されます。
 * この値は、$gameTemp.currentEvaledflagに格納されています。
 * $gameTempでの保存となっているため、ゲームがリセットされた後は
 * 上手く動作しない可能性がありますのでご注意ください。
 * プロパティ"condition",プロパティ"value"の値は、
 * 対応する数値での指定も可能です。
 * "True"は10, "False"は20, "Lock"は30, "Broken"は40、
 * trueは1, falseは0です。
 * 引数に不適切な値を入力した場合、エラーが発生します。
 * プロパティ"name"に関するエラーが起きた場合は、
 * そのコマンドは実行されず、エラー内容がコンソールに出力されます。
 * それ以外のプロパティに関するエラーが起きた場合は、
 * 同様にコマンドが実行されない場合もあれば、
 * デフォルトの適切な値に置き換えられて実行される場合もあります。
 * 
 * ----------------------------------------------------------------------------
 * "フラグモディファイア"
 * ----------------------------------------------------------------------------
 * 一部のフラグコマンドは、フラグモディファイアを使用することができます。
 * フラグモディファイアは種類あります。
 * ⒈コマンドモディファイア
 * 　コマンドモディファイアは、フラグコマンドの機能を拡張するものです。
 * 　通常、フラグコマンドの後ろに記述して使用します。
 * 　コマンドモディファイアを使用する場合、
 * 　指定する引数が変化する場合があります。
 * ⒉引数モディファイア
 * 　引数モディファイアは、フラグコマンドの引数を変更するものです。
 * 　通常、フラグコマンドの引数の後ろに記述して使用します。
 * 　引数モディファイアを使用することにより、
 * 　返り値の逆転や、特定の条件を指定することが可能です。
 * 
 * ----------------------------------------------------------------------------
 * "フラグファンクション"
 * ----------------------------------------------------------------------------
 * フラグファンクションは、フラグコマンドを関数として使用することができます。
 * これは、フラグコマンドを関数として使用することで、
 * より柔軟なフラグの操作が可能となります。
 * 例えば、特定のフラグコマンドによって得られた値を、
 * 特定のフラグコマンドに引数として渡すことができます。
 * これにより、複数種類の値を引数に、
 * フラグコマンドを実行することが可能です。
 * その他、返り値の計算や、比較、条件分岐なども可能です。
 * フラグファンクションは、$gameFlagfuncにて定義されます。
 * フラグファンクションで、用いられるフラグコマンドを、
 * ファンクコマンドと呼びます。ファンクコマンドには、
 * 引数を扱う、`argFunccommand`,
 * 計算を行う、`calcFunccommand`,
 * コマンドの実行を行う、`execFunccommand`があります。 
 * 
 * ============================================================================
 *◎フラグの取得 `debugcommand`
 * ============================================================================
 * "infoFlag" ("info")
 * ----------------------------------------------------------------------------
 * これは、フラグの情報を取得するためのフラグコマンドです。
 * 取得される情報とは、現在のフラグの各プロパティの値です。
 * プラグインコマンド、スクリプト、グローバル関数、どれでも使用可能です。
 * スクリプトでは、"info"と省略された名称となっています。
 * 引数には、フラグの名称を記述してください。
 * これは文字列である必要があるため、""で囲ってください。
 * プラグインコマンドでの指定の場合は、不要です。
 * 引数が文字列でない場合、その名前のフラグが存在しない場合は
 * エラーとなります。エラーとなった場合は、このコマンドは無効となり、
 * フラグの情報を取得せず処理をスキップします。
 * また、エラーがログに出力されます。
 * 引数の指定がない場合は、
 * 現在存在する全てのフラグの情報を取得します。
 * []で囲んで配列とすることで、複数指定することも可能です。
 * 取得されたフラグの情報は、デバッグコンソールに出力されます。
 * そのため、便宜上テストプレイ時のみ使用することをお勧めします。
 * 
 * プラグインコマンド: infoFlag
 * スクリプト: $gameFlags.info("name"); //引数省略可
 * グローバル関数: infoFlag("name"); //引数省略可
 * 複数指定例;) $gameFlags.info(["name1","name2","name3"]);
 * 
 * ----------------------------------------------------------------------------
 * "infoFlagモディファイア"
 * ----------------------------------------------------------------------------
 * 
 * ----------------------------------------------------------------------------
 * "haveFlag" ("have")
 * ----------------------------------------------------------------------------
 * これは、指定のフラグが子フラグを持っているかどうかを
 * 取得するためのフラグコマンドです。
 * プラグインコマンド、スクリプト、グローバル関数、どれでも使用可能です。
 * スクリプトでは、"have"と省略された名称となっています。
 * 引数には、親フラグの名称を記述してください。
 * これは文字列である必要があるため、""で囲ってください。
 * プラグインコマンドでの指定の場合は、不要です。
 * 指定がない、または無効な値が指定された場合、
 * エラーとなります。エラーとなった場合は、
 * このコマンドは無効となり、フラグの数を取得せず処理をスキップします。
 * また、エラーがログに出力されます。
 * その親フラグが子フラグを持っている場合は、
 * その親が持つすべての子フラグの名称が配列で返されます。
 * その親フラグが子フラグを持っていない場合は、
 * nullが返されます。
 * 取得されたフラグの情報は、デバッグコンソールに出力されます。
 * そのため、便宜上テストプレイ時のみ使用することをお勧めします。
 * 
 * プラグインコマンド: haveFlag
 * スクリプト: $gameFlags.have("nameP"); //親フラグの名称
 * グローバル関数: haveFlag("nameP"); //親フラグの名称
 * 
 * ----------------------------------------------------------------------------
 * "countFlag" ("count")
 * ----------------------------------------------------------------------------
 * これは、指定のフラグの数を取得するためのフラグコマンドです。
 * 条件に合うフラグの数が返されます。
 * プラグインコマンド、スクリプト、グローバル関数、どれでも使用可能です。
 * スクリプトでは、"count"と省略された名称となっています。
 * 第一引数には、数えたいフラグのプロパティを指定してください。
 * 利用できるのは、"type","condition","value","priority","relation"です。
 * これは文字列である必要があるため、""で囲ってください。
 * プラグインコマンドでの指定の場合は、不要です。
 * 第二引数には、そのプロパティの検索したい値を指定してください。
 * 例:) countFlag("type",1); //グローバルフラグの数を取得
 * 例:) countFlag("condition","True"); //Trueのフラグの数を取得
 * "condition"では、以下3つの特別な値での指定が行えます。
 * "Positive": 正のフラグの数を取得します。
 * "Negative": 負のフラグの数を取得します。
 * "Complete": 完全なフラグの数を取得します。 
 * 指定がない、または無効な値が指定された場合、
 * エラーとなります。エラーとなった場合は、
 * このコマンドは無効となり、フラグの数を取得せず処理をスキップします。
 * また、エラーがログに出力されます。
 * 複数の条件を指定したい場合は、`funccommand`を使用してください。
 * 
 * 
 * プラグインコマンド: countFlag
 * スクリプト: $gameFlags.count("conditions","value");
 * グローバル関数: countFlag("conditions","value");
 * 
 * ============================================================================
 *◎フラグの制定 `setcommand`
 * ============================================================================
 * "setFlag" ("set")
 * ----------------------------------------------------------------------------
 * これは、ローカルフラグを制定するためのフラグコマンドです。
 * プラグインコマンド、スクリプト、グローバル関数、どれでも使用可能です。
 * スクリプトでは、"set"と省略された名称となっています。
 * 第一引数には、フラグの名称を記述してください。
 * これは文字列である必要があるため、""で囲ってください。
 * プラグインコマンドでの指定の場合は、不要です。
 * いずれの場合でも指定が必須です。
 * 引数が存在しない場合、第一引数が文字列でない場合、
 * すでにその名前のフラグが存在する場合はエラーとなります。
 * エラーとなった場合は、このコマンドは無効となり、
 * フラグの制定を行わず処理をスキップします。
 * また、エラーがログに出力されます。
 * 第二引数には、フラグの状態,第三引数には、フラグの値,
 * 第四引数には、フラグの優先度を指定してください。
 * 第二引数に"Lock","Broken"を指定することはできません。
 * 指定がない、または無効な値が指定された場合、
 * デフォルトの値が代入されます。
 * 
 * プラグインコマンド: setFlag
 * スクリプト: $gameFlags.set("name","condition",value,priority);
 * グローバル関数: setFlag("name","condition",value,priority);
 * 
 * ----------------------------------------------------------------------------
 * "setFlagGlobal"　("setG")
 * ----------------------------------------------------------------------------
 * これは、グローバルフラグを制定するためのフラグコマンドです。
 * スクリプトでは、"setG"と省略された名称となっています。
 * 基本的な仕様は、"setFlag"と同様です。
 * "setFlag"と異なり、プロパティ"type"に1が代入されます。
 * 
 * プラグインコマンド: setFlagGlobal
 * スクリプト: $gameFlags.setG("name","condition",value,priority);
 * グローバル関数: setFlagGlobal("name","condition",value,priority); 
 * 
 * ----------------------------------------------------------------------------
 * "makeFlag" ("make")
 * ----------------------------------------------------------------------------
 * "id"以外の全てのプロパティを指定して、
 * フラグを制定することができるフラグコマンドです。
 * プラグインコマンド、スクリプト、グローバル関数、どれでも使用可能です。
 * スクリプトでは、"make"と省略された名称となっています。
 * こちらでは第二引数に"Lock","Broken"を指定することができます。
 * ただし、存在するだけで何もできないフラグとなるので気をつけてください。
 * こちらは、フラグの制定を行うための最も高度なコマンドです。
 * そのため、基本的に推奨される使用方法ではありません。
 * 
 * プラグインコマンド: makeFlag
 * スクリプト: $gameFlags.make("type","name","condition",value,priority,relation);
 * グローバル関数: makeFlag("type","name","condition",value,priority,relation); 
 * 
 * 
 * 
 * %&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&
 *                                  注意事項
 * &%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%&%
 * このプラグインはChat-GPT君が作成してくれたものを参考に
 * 僕が簡単な修正を加えたものです。僕はただ彼に依頼し、
 * ネットの情報や他者プラグインを参考にコピペ修正をしただけです。
 * コードの構造は理解出来ていません。
 * 僕が分かるのは何が行われているのかということだけです。
 * ----------------------------------------------------------------------------
 *  
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *                                  利用規約
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 * なし。どうぞご自由に。お好きにお使いください。
 * ゲームジャンル問わず。無断改変、再配布、などなど諸々可能です。
 * 一切の制限がありません。このプラグインはもう既にあなたのものです。
 * ----------------------------------------------------------------------------
 *  
 * ############################################################################
 * [Version History]～更新履歴～（開発中）
 * ############################################################################
 * 0.0.0  // JSONファイルの読み込み、書き込み機能を実装
 * 0.0.0a // プラグインパラメーターの削除　その他細かな調整
 * 0.0.1 // フラグの制定機能の追加 グローバルフラグ保存機能の定義
 * ----------------------------------------------------------------------------
 * 
 * @param outputFlaginfo
 * @text フラグ情報の出力
 * @desc trueの場合、ゲーム開始後フラグ情報が出力されます。<br>テストプレイ時のみ有効です。
 * @default true
 * @type boolean
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_`debugcommand`
 * @text ========= `debugcommand` =========
 * @desc フラグの情報の取得を行うフラグコマンド
 *
 * @ --------------------------------------------------------------------------
 * 
 * @command infoFlag
 * @text フラグの情報取得
 * @desc 指定のフラグの現在の情報をデバッグコンソールに返します。<br>そのフラグが既に存在する必要があります。
 *
 * @arg name
 * @text 名称
 * @desc 取得したいフラグの名称を記述してください。<br>空なら全てのフラグの情報が取得されます。
 * @type string[]
 * 
 * @ --------------------------------------------------------------------------
 * 
 * @command haveFlag
 * @text 子フラグの取得
 * @desc 指定の親フラグの持つ子フラグの名称をデバッグコンソールに返します。そのフラグが既に存在する必要があります。
 *
 * @arg name
 * @text 親フラグ名称
 * @desc 子の情報を取得したい親フラグの名称を記述してください。<br>空なら全てのフラグの情報が取得されます。
 * @type string  
 * 
 * @ --------------------------------------------------------------------------
 * 
 * @command countFlag
 * @text 指定条件を満たすフラグの数取得
 * @desc 指定の条件を満たすフラグの数をデバッグコンソールに返します。
 * 
 * @arg conditions
 * @text 条件
 * @desc 検索したいプロパティを指定してください。
 * @type select
 * @option フラグタイプ
 * @value type
 * @option 状態
 * @value condition
 * @option 値
 * @value value
 * @option 優先度
 * @value priority
 * @option 関連性
 * @value relation
 * 
 * @arg value
 * @text 値
 * @desc 検索したい値を指定してください。<br>検索条件に合わせ、適切な値を指定してください。
 * @type string
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_`setcommand`
 * @text ========= `setcommand` =========
 * @desc フラグの制定を行うフラグコマンド
 *
 * @ --------------------------------------------------------------------------
 * 
 * @command setFlag
 * @text ローカルフラグの制定
 * @desc ローカルフラグの制定を行います。<br>各種プロパティも含め制定してください。
 *
 * @arg name
 * @text 名称
 * @desc 制作するローカルフラグの名称を記述してください。<br>名称は文字列として厳格に判別されます。
 * @type string 
 *
 * @arg condition
 * @text 状態
 * @desc 制定するローカルフラグの状態を選択してください。<br>Lock/Brokenの指定はできません。  
 * @default False
 * @type select
 * @option True
 * @option False
 *
 * @arg value
 * @text 値
 * @desc 制定するローカルフラグの値を選択してください。<br>デフォルトはfalseです。
 * @default false
 * @type boolean
 *
 * @arg priority
 * @text 優先度
 * @desc 制定するローカルフラグの優先度を指定してください。<br>デフォルトは０です。上限はありません。
 * @default 0
 * @type number
 * @min 0
 * 
 * @ --------------------------------------------------------------------------
 * 
 * @command setFlagGlobal
 * @text グローバルフラグの制定
 * @desc グローバルフラグの制定を行います。<br>グローバルフラグの情報は全セーブデータ間で共有されます。
 *
 * @arg name
 * @text 名称
 * @desc 制作するグローバルフラグの名称を記述してください。<br>名称は文字列として厳格に判別されます。
 * @type string 
 *
 * @arg condition
 * @text 状態
 * @desc 制定するグローバルフラグの状態を選択してください。<br>Lock/Brokenの指定はできません。  
 * @default False
 * @type select
 * @option True
 * @option False
 *
 * @arg value
 * @text 値
 * @desc 制定するグローバルフラグの値を選択してください。<br>デフォルトはfalseです。
 * @default false
 * @type boolean
 *
 * @arg priority
 * @text 優先度
 * @desc 制定するグローバルフラグの優先度を指定してください。<br>デフォルトは０です。上限はありません。
 * @default 0
 * @type number
 * @min 0
 * 
 * @ --------------------------------------------------------------------------
 * 
 * @command makeFlag
 * @text ※非推奨※フラグの制定
 * @desc ※非推奨※フラグの制定を行います。<br>各種プロパティも含め制定してください。
 *
 * @arg type
 * @text タイプ
 * @desc 制作するフラグのタイプを選択してください。
 * @default 0
 * @type select
 * @option ローカル
 * @value 0
 * @option グローバル
 * @value 1
 * 
 * @arg name
 * @text 名称
 * @desc 制作するフラグの名称を記述してください。<br>名称は文字列として厳格に判別されます。
 * @type string 
 *
 * @arg condition
 * @text 状態
 * @desc 制定するフラグの状態を選択してください。<br>Lock/Brokenの指定は推奨できません。  
 * @default False
 * @type select
 * @option True
 * @option False
 * @option Lock
 * @option Broken
 *
 * @arg value
 * @text 値
 * @desc 制定するフラグの値を選択してください。<br>デフォルトはfalseです。
 * @default false
 * @type boolean
 *
 * @arg priority
 * @text 優先度
 * @desc 制定するラグの優先度を指定してください。<br>デフォルトは0です。上限はありません。
 * @default 0
 * @type number
 * @min 0
 * 
 * @arg relation
 * @text 関連性
 * @desc 制定するフラグの関連性の有無を選択してください。<br>0以外は非推奨です。
 * @default 0
 * @type select
 * @option 関連性なし
 * @value 0
 * @option 関連性あり
 * @value 1
 * @option 関連性あり(BAN)
 * @value -1
 * 
 * @ --------------------------------------------------------------------------
 * 
 * 
 *  
 */

$gameFlags = null;

 (() => {
    "use strict";

    const pluginName = 'WinglyMZ_2_FlagSystem';
    const parameters = PluginManager.parameters(pluginName);

    let outputFlaginfo = parameters["outputFlaginfo"] === "true";

    const fs = require("fs");
    const path = require("path");
    const flagsFilePath = path.join("data", "Flags.json");
    const flagGroupsFilePath = path.join("data", "FlagGroups.json");

    const defaultFlags = [null];

    const defaultFlagGroups = [null];

//=============================================================================
// DataManager
//=============================================================================

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $gameFlags = new Game_Flags();
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.flags = $gameFlags;
        contents.flagGroups = $gameFlags._flagGroups || [];
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);

        $gameFlags = contents.flags || new Game_Flags();
        $gameFlags._flagGroups = contents.flagGroups || [];
    };

//=============================================================================
// StorageManager
//=============================================================================

    StorageManager.createFlagsJson = function() {
        if (fs.existsSync(flagsFilePath)) {
            console.log("Flags.json はすでに存在します。");
            return;
        }

        try {
            const formatLevel = $dataSystem?.editor?.jsonFormatLevel ?? 1;
            const space = formatLevel > 1 ? 4 : null;
            let jsonData = JSON.stringify(defaultFlags, null, space);
            if (formatLevel === 1) {
                jsonData = jsonData.replace(/^\[/, "[\n");
                jsonData = jsonData.replace(/null,/, "null,\n");
                jsonData = jsonData.replace(/},/g, "},\n");
                jsonData = jsonData.replace(/\]$/, "\n]");
            }             
            fs.writeFileSync(flagsFilePath, jsonData, "utf8");
            console.log(`Flags.json が保存されました。formatLevel = ${formatLevel}`);
        } catch (error) {
            console.error("Flags.json の保存に失敗しました:", error);
        }
    };

    StorageManager.saveFlagsJson = function() {
        try {
            const formatLevel = $dataSystem?.editor?.jsonFormatLevel ?? 1;
            const space = formatLevel === 2 ? 4 : null;
            const flagsArray = $gameFlags._flags ? $gameFlags._flags.slice() : [];
            flagsArray.unshift(null);
            let jsonData = JSON.stringify(flagsArray, null, space);
            if (formatLevel === 1) {
                jsonData = jsonData.replace(/^\[/, "[\n");
                jsonData = jsonData.replace(/null,/, "null,\n");
                jsonData = jsonData.replace(/},/g, "},\n");
                jsonData = jsonData.replace(/\]$/, "\n]");
            }  
            fs.writeFileSync(flagsFilePath, jsonData, "utf8");
            console.log("Flags.json が保存されました。");
        } catch (error) {
            console.error("Flags.json の保存に失敗しました:", error);
        }
    };    

    StorageManager.createFlagGroupsJson = function() {

        if (fs.existsSync(flagGroupsFilePath)) {
            console.log("FlagGroups.json はすでに存在します。");
            return;
        }

        try {
            const formatLevel = $dataSystem?.editor?.jsonFormatLevel ?? 1;
            const space = formatLevel === 2 ? 4 : null;
            let jsonData = JSON.stringify(defaultFlagGroups, null, space);
            if (formatLevel === 1) {
                jsonData = jsonData.replace(/^\[/, "[\n");
                jsonData = jsonData.replace(/null,/, "null,\n");
                jsonData = jsonData.replace(/},/g, "},\n");
                jsonData = jsonData.replace(/\]$/, "\n]");
            }
            fs.writeFileSync(flagGroupsFilePath, jsonData, "utf8");
            console.log("FlagGroups.json が保存されました。");
        } catch (error) {
            console.error("FlagGroups.json の保存に失敗しました:", error);
        }
    };

    StorageManager.saveFlagGroupsJson = function() {
        try {
            const formatLevel = $dataSystem?.editor?.jsonFormatLevel ?? 1;
            const space = formatLevel === 2 ? 4 : null;
            const flagsArray = $gameFlags._lagGroups ? $gameFlags._lagGroups.slice() : [];
            flagsArray.unshift(null);
            let jsonData = JSON.stringify($gameFlags._flagGroups, null, space);
            if (formatLevel === 1) {
                jsonData = jsonData.replace(/^\[/, "[\n");
                jsonData = jsonData.replace(/null,/, "null,\n");
                jsonData = jsonData.replace(/},/g, "},\n");
                jsonData = jsonData.replace(/\]$/, "\n]");
            }            
            fs.writeFileSync(flagGroupsFilePath, jsonData, "utf8");
            console.log("FlagGroups.json が保存されました。");
        } catch (error) {
            console.error("FlagGroups.json の保存に失敗しました:", error);
        }
    };

    StorageManager.loadFlagsJson = function() {

        if (!fs.existsSync(flagsFilePath)) {
            console.error("Flags.json が見つかりません。");
            return null;
        }

        try {
            const jsonData = fs.readFileSync(flagsFilePath, "utf8");
            return JSON.parse(jsonData);
        } catch (error) {
            console.error("Flags.json の読み込みに失敗しました:", error);
            return null;
        }
    };

    StorageManager.loadFlagGroupsJson = function() {

        if (!fs.existsSync(flagGroupsFilePath)) {
            console.error("FlagGroups.json が見つかりません。");
            return null;
        }

        try {
            const jsonData = fs.readFileSync(flagGroupsFilePath, "utf8");
            return JSON.parse(jsonData);
        } catch (error) {
            console.error("FlagGroups.json の読み込みに失敗しました:", error);
            return null;
        }
    };

    StorageManager.saveGlobalFlags = function(flags) {
        const json = JsonEx.stringify(flags);
        return this.saveToLocalFile("GlobalFlags.rmmzsave", json);
    };
    
    StorageManager.loadGlobalFlags = function() {
        const json = this.loadFromLocalFile("GlobalFlags.rmmzsave");
        return json ? JsonEx.parse(json) : null;
    };
    

//=============================================================================
// Game_Flags
//=============================================================================

    class Game_Flags {
        constructor() {
            this._flags = [];
            this._flagGroups = [];
        }

        isNameExist(name) {
            if (!name || typeof name !== "string") return false;
            return $gameFlags._flags.some(flag => flag?.name === name);
        };

        nextId() {
            const validIds = this._flags
                .filter(f => f !== null && typeof f?.id === "number")
                .map(f => f.id);
        
            const maxId = validIds.length > 0 ? Math.max(...validIds) : -1;
            return maxId + 1;
        }        

        validateFlagArguments(name, condition, value, priority) {
            const result = {
                id: this.nextId(),
                type: 0,
                name: "",
                condition: "False",
                value: false,
                priority: 0
            };

            if (typeof name !== "string" || !name.trim()) {
                console.error("[FlagSystem] name が無効です。文字列で指定してください。");
                return false;
            }
            if (this.isNameExist(name)) {
                console.error(`[FlagSystem] フラグ名「${name}」はすでに使用されています。`);
                return false;
            }
            result.name = name;

            const validConditions = ["True", "False", "Lock", "Broken"];
            if (typeof condition === "string" && validConditions.includes(condition)) {
                result.condition = condition;
            } else if (typeof condition === "number") {
                const conditionMap = {
                    10: "True",
                    20: "False",
                    30: "Lock",
                    40: "Broken"
                };
                result.condition = conditionMap[condition] || "False";
            } else {
                console.warn(`[FlagSystem] condition「${condition}」が無効なため "False" に修正しました。`);
            }
        
            if (typeof value === "boolean") {
                result.value = value;
            } else if (value === 1) {
                result.value = true;
            } else if  (value === 2) {
                result.value = false;
            } else {
                console.warn(`[FlagSystem] value「${value}」が無効なため false に修正しました。`);
            }
        
            if (Number.isInteger(priority) && priority >= 0) {
                result.priority = priority;
            } else {
                console.warn(`[FlagSystem] priority「${priority}」が無効なため 0 に修正しました。`);
            }
        
            return result;
        };
            
    //----------------------------------------------------------------------------
    // `debugcommand`
    //----------------------------------------------------------------------------
        
    /**
     * @param {string} name
     * @returns {Object}
     */
        info(name) {
            const flag = this._flags.find(flag => flag.name === name);
            if (flag) {
                console.log(flag);
            } else {
                console.error(`フラグ ${name} は存在しません。`);
            }
        }

    //----------------------------------------------------------------------------
    // `setcommand`
    //----------------------------------------------------------------------------
    
    /**
     * ローカルフラグを制定する
     * @param {string} name - フラグ名（ユニークであること）
     * @param {string} condition - 状態（"True", "False", "Lock", "Broken"）
     * @param {boolean} value - 値（true / false）
     * @param {number} priority - 優先度（0以上の整数）
     * @returns {void}
     */
    
        set(name, condition, value, priority) {
            const validated = this.validateFlagArguments(name, condition, value, priority);
            if (!validated) {
                console.error(`[FlagSystem] フラグ「${name}」の制定に失敗しました。`);
                return;
            }

            this._flags.push(validated);
            if (Utils.isOptionValid("test")) {
                StorageManager.saveFlagsJson(this._flags);
            }
            console.log(`[FlagSystem] フラグ「${validated.name}」を制定しました。`);
        }

    /**
     * グローバルフラグを制定する
     * @param {string} name - フラグ名（ユニークであること）
     * @param {string} condition - 状態（"True", "False", "Lock", "Broken"）
     * @param {boolean} value - 値（true / false）
     * @param {number} priority - 優先度（0以上の整数）
     * @returns {void}
     */
        setG(name, condition, value, priority) {
            const validated = this.validateFlagArguments(name, condition, value, priority);
            if (!validated) {
                console.error(`[FlagSystem] グローバルフラグ「${name}」の制定に失敗しました。`);
                return;
            }
        
            validated.type = 1;
            this._flags.push(validated);
            if (Utils.isOptionValid("test")) {
                StorageManager.saveFlagsJson(this._flags);
            }
            console.log(`[FlagSystem] グローバルフラグ「${validated.name}」を制定しました。`);
        };

    /**
     * フラグを強制的に制定する
     * @param {string} name - フラグ名（ユニークであること）
     * @param {string} condition - 状態（"True", "False", "Lock", "Broken"）
     * @param {boolean} value - 値（true / false）
     * @param {number} priority - 優先度（0以上の整数）
     * @returns {void}
     */

        make(type, name, condition, value, priority, relation) {
            if (this.isNameExist(name)) {
                console.error(`フラグ ${name} は既に存在します。`);
                return;
            }
            const id = this.nextId() -1;
            this._flags.push({id, type, name, condition, value, priority, relation});
            StorageManager.saveFlagsJson();
        };



    }

//=============================================================================
// Scene_Boot
//=============================================================================

    const _Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
    Scene_Boot.prototype.onDatabaseLoaded = function () {
        _Scene_Boot_onDatabaseLoaded.call(this);

        if (fs.existsSync(flagsFilePath)) {
            console.log("Flags.json はすでに存在します。");
        } else {
            StorageManager.createFlagsJson();
        }

        if (fs.existsSync(flagGroupsFilePath)) {
            console.log("FlagGroups.json はすでに存在します。");
        } else {
            StorageManager.createFlagGroupsJson();
        }        

        $gameFlags = StorageManager.loadFlagsJson() || new Game_Flags();
        $gameFlags._flagGroups = StorageManager.loadFlagGroupsJson() || [];

    };

//=============================================================================
// PluginManager
//=============================================================================

// `debugcommand`

    PluginManager.registerCommand(pluginName, "infoFlag", args => {
        const name = args.name;
        $gameFlags.info(name);
    });

    PluginManager.registerCommand(pluginName, "haveFlag", args => {
        const name = args.name;
        $gameFlags.have(name);
    });

    PluginManager.registerCommand(pluginName, "countFlag", args => {
        const conditions = args.conditions;
        const value = args.value;
        $gameFlags.count(conditions, value);
    });
    
// `setcommand`

    PluginManagerEx.registerCommand(document.currentScript, "setFlag", args => {
        const name = args.name;
        const condition = args.condition;
        const value = args.value;
        const priority = args.priority;
        $gameFlags.set(name, condition, value, priority);
    });

    PluginManagerEx.registerCommand(document.currentScript, "setFlagGlobal", args => {
        const name = args.name;
        const condition = args.condition;
        const value = args.value;
        const priority = args.priority;
        $gameFlags.setG(name, condition, value, priority);
    });

    PluginManagerEx.registerCommand(document.currentScript, "makeFlag", args => {
        const type = args.type;
        const name = args.name;
        const condition = args.condition;
        const value = args.value;
        const priority = args.priority;
        const relation = args.relation;
        $gameFlags.make(type, name, condition, value, priority, relation);
    });

})();

// ============================================================================
// グローバル関数の追加
// ============================================================================

// `debugcommand`

    window.infoFlag = function(...args) {
        return $gameFlags.info(...args);
    };

    window.haveFlag = function(...args) {
        return $gameFlags.have(...args);
    };

    window.countFlag = function(...args) {
        return $gameFlags.count(...args);
    }

// `setcommand`

    window.setFlag = function(...args) {
        return $gameFlags.set(...args);
    };

    window.setFlagGlobal = function(...args) {
        return $gameFlags.setG(...args);
    };

    window.makeFlag = function(...args) {
        return $gameFlags.make(...args);
    };