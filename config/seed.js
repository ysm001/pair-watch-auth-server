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
    deviceId: '4FDF59B0-2C19-46B3-9D63-A133660E75F7',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
  {
    name: 'admin-iphone',
    deviceId: 'AC35AFC2-8E8C-4BEB-AF02-0E33BA93B986',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'user-C',
    deviceId: 'AAAAAAAA-BBBB-AAAA-AAAA-AAAAAAAAAAAA',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
]);
