db.dropDatabase();

db.permissions.insert([
  {name: 'ACCESS'}, 
  {name: 'EXEC_COMMAND'},
  {name: 'EXEC_ROOT_COMMAND'},
]);

var access = db.permissions.findOne({name: 'ACCESS'});
var execCommand = db.permissions.findOne({name: 'EXEC_COMMAND'});
var execRootCommand = db.permissions.findOne({name: 'EXEC_ROOT_COMMAND'});

db.roles.insert([
  {name: 'admin', permissions: [access._id, execCommand._id, execRootCommand._id]}, 
  {name: 'user', permissions: [access._id, execCommand._id]}
]);

db.users.insert([
  {
    name: 'admin',
    role: db.roles.findOne({name: 'admin'})._id
  },
  {
    name: 'user',
    role: db.roles.findOne({name: 'user'})._id
  }
]);
