db.dropDatabase();

db.roles.insert([
  {name: 'admin'}, 
  {name: 'user'}
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
