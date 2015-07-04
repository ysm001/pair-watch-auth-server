module.exports = (function() {
  /**
   * トークンを生成するクラス
   *
   * @class TokenGenerator
   * @constructor
   */
  var TokenGenerator = function() {}

  /**
   * トークン(16bit数値)を生成するメソッド
   *
   * @method generate
   * @static
   * @param {Integer} 16bitの数値
   */
  TokenGenerator.generate = function() {
    return new Date().getTime() % 65536;
  }

  return TokenGenerator;
})();
