
exports.seed = function (knex, Promise) {
  return knex('garage').del()
    .then(() => {
      return Promise.all([
        knex('garage').insert([
        { id: 1, name: 'christmass decorations', reason: 'summer', cleanliness: 'Dusty' },
        { id: 2, name: 'bike', reason: 'storage', cleanliness: 'Sparkling' },
        { id: 3, name: 'gym shoes', reason: 'worn', cleanliness: 'Rancid' },
        ])]);
    });
};
