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
    deviceId: 'DUMMYUID-ADMN-USER-0000-00000000000A',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'admin-user-B',
    deviceId: 'DUMMYUID-ADMN-USER-0000-00000000000B',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'user-A',
    deviceId: 'DUMMYUID-0000-USER-0000-00000000000A',
    role: db.roles.findOne({name: 'user'})._id
  },
  {
    name: 'user-B',
    deviceId: 'DUMMYUID-0000-USER-0000-00000000000B',
    role: db.roles.findOne({name: 'user'})._id
  },
  {
    name: 'readonly-user-A',
    deviceId: 'DUMMYUID-READ-USER-0000-00000000000A',
    role: db.roles.findOne({name: 'readonly-user'})._id
  },
  {
    name: 'readonly-user-B',
    deviceId: 'DUMMYUID-READ-USER-0000-00000000000B',
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
    deviceId: 'AAAAAAAA-BBBB-AAAA-AAAA-AAAAAAAAAAAA',
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
  },
]);
