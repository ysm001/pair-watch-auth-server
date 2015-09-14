'use strict';

const mongoose = require('mongoose');
const Role = require('./role.js');
const promiseQuery = require('../lib/promise-query.js');
const Promise = require('bluebird');
const RecordNotFoundError = require('../lib/errors/record-not-found-error.js');

/**
 * User Model
 *
 * @class UserSchema
 * @constructor
 */
const UserSchema = new mongoose.Schema({
  name: {type: String},
  deviceId: {type: String, unique: true},
  role: {type: mongoose.Schema.ObjectId, ref: 'Role'}
});

UserSchema.static('findByPermission', function(permission) {
  return this.model('User').findByPermissions([permission]);
});

/**
 * 指定したpermissionを満たす権限を持つUserを検索するメソッド
 *
 * @method findByPermissions
 * @param {[Permission]} permissions permissionの配列
 * @param {Function} callback callback
 */
UserSchema.static('findByPermissions', function(permissions) {
  return Role.findByPermissions(permissions).then(function(roles) {
    const roleIds = roles.map(function(role) {return role.id;});
    return promiseQuery(this.find({role: {$in: roleIds}}));
  }.bind(this));
});

UserSchema.static('findByDeviceId', function(deviceId) {
  return promiseQuery(this.findOne({deviceId: deviceId}));
});

UserSchema.static('findByDeviceIds', function(deviceIds) {
  const condition = deviceIds.map(function(id) {return {deviceId: id};});
  return promiseQuery(this.find({$or: condition}));
});

UserSchema.static('findByName', function(name) {
  return promiseQuery(this.findOne({name: name}));
})

/**
 * Userが、指定したpermissionを満たす権限を持つかを検査するメソッド
 *
 * @method hasEnoughPermissions
 * @param {[Permission]} permissions permissionの配列
 * @param {Function} callback callback
 */
UserSchema.method('hasEnoughPermissions', function(permissions) {
  return this.model('User').findByPermissions(permissions).then(function(users) {
    return users.some(function(user) {return user.id === this.id;}.bind(this));
  }.bind(this));
});

/**
 * Userが、指定したpermissionを満たす権限を持つかを検査するメソッド(単数版)
 *
 * @method hasEnoughPermission
 * @param {Permission} permissions permission
 * @param {Function} callback callback
 */
UserSchema.method('hasEnoughPermission', function(permission, callback) {
  return this.hasEnoughPermissions([permission], callback);
});

UserSchema.method('toSimpleFormat', function() {
  return {
    name: this.name,
    deviceId: this.deviceId
  };
});

module.exports = mongoose.model('User', UserSchema);
