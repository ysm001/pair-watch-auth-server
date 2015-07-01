db.dropDatabase();

db.permissions.insert([
  {name: 'ACCESS', flag: 1}, 
  {name: 'EXEC_COMMAND', flag: 2},
  {name: 'EXEC_ROOT_COMMAND', flag: 4},
]);

var access = db.permissions.findOne({name: 'ACCESS'});
var execCommand = db.permissions.findOne({name: 'EXEC_COMMAND'});
var execRootCommand = db.permissions.findOne({name: 'EXEC_ROOT_COMMAND'});

db.roles.insert([
  {name: 'admin', permissions: [access._id, execCommand._id, execRootCommand._id]}, 
  {name: 'user', permissions: [access._id, execCommand._id]},
  {name: 'readonly-user', permissions: [access._id]}
]);

db.users.insert([
  {
    name: 'admin-user-A',
    deviceId: 'UID-ADMIN-USER-A',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'admin-user-B',
    deviceId: 'UID-ADMIN-USER-B',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'user-A',
    deviceId: 'UID-USER-A',
    role: db.roles.findOne({name: 'user'})._id
  },
  {
    name: 'user-B',
    deviceId: 'UID-USER-B',
    role: db.roles.findOne({name: 'user'})._id
  },
  {
    name: 'readonly-user-A',
    deviceId: 'UID-READONLY-USER-A',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
  {
    name: 'readonly-user-B',
    deviceId: 'UID-READONLY-USER-B',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
  {
    name: 'iphone',
    deviceId: '1ABF357A-08C9-4D65-8EC5-18D2AB95E640',
    role: db.roles.findOne({name: 'user'})._id
  }
]);
