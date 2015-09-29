'use strict';

/**
 * トークンを生成するクラス
 *
 * @class TokenGenerator
 * @constructor
 */
const TokenGenerator = function() {};

/**
 * トークン(16bit数値)を生成するメソッド
 *
 * @method generate
 * @static
 * @return {Integer} 16bitの数値
 */
TokenGenerator.generate = function() {
  return new Date().getTime() % 65536;
};

module.exports = TokenGenerator;
