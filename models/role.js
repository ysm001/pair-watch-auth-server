'use strict';

const mongoose = require('mongoose');
const Permission = require('./permission.js');
const promiseQuery = require('../lib/supports/promise-query.js');

/**
 * Role Model
 *
 * @class RoleSchema
 * @constructor
 */
const RoleSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  permissions: [{type: mongoose.Schema.ObjectId, ref: 'Permission'}]
});

/**
 * 指定したpermissionを満たす権限を持つRoleを検索するメソッド
 *
 * @method findByPermissions
 * @param {[Permission]} permissions permissionの配列
 * @param {Function} callback callback
 */
RoleSchema.static('findByPermissions', function(permissions) {
  return promiseQuery(this.find({}).populate('permissions')).filter(function(role) {
    return Permission.hasEnoughPermissions(role.permissions, permissions);
  });
});

module.exports = mongoose.model('Role', RoleSchema);
