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
    deviceId: 'a8098c1a-f86e-11da-bd1a-00112444be1e',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'admin-user-B',
    deviceId: '31c92030-d518-4ed7-b302-6e1a3fe202e5',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'user-A',
    deviceId: '2f29612b-e49a-476f-aacd-b2b2884a7724',
    role: db.roles.findOne({name: 'user'})._id
  },
  {
    name: 'user-B',
    deviceId: '5f4f8037-5cd3-4d25-ba4a-d214bba6e824',
    role: db.roles.findOne({name: 'user'})._id
  },
  {
    name: 'readonly-user-A',
    deviceId: '9a13d013-a604-4de6-bec8-fd487e60e00b',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
  {
    name: 'readonly-user-B',
    deviceId: 'c3a0ed5b-a354-49f9-a64f-e10ed7665fda',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
  {
    name: 'iphone',
    deviceId: '4FDF59B0-2C19-46B3-9D63-A133660E75F7',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
  {
    name: 'admin-iphone-A',
    deviceId: 'AC35AFC2-8E8C-4BEB-AF02-0E33BA93B986',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'admin-iphone-B',
    deviceId: '32AD2F8E-422F-4F77-8010-8657B7C8E72D',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'readonly-user-C',
    deviceId: '5d262f27-0ec7-41af-b907-6c3e29fa902d',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
  {
    name: 'admin-C',
    deviceId: '12345678-1234-1234-1234-123456789012',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'iphone-simulator',
    deviceId: 'E4D5CE7F-0F20-4FA3-B0BB-2A638ECB971F',
    role: db.roles.findOne({name: 'user'})._id
  }
]);
