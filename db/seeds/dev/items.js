
exports.seed = function (knex, Promise) {
  return knex('garage').del()
    .then(() => {
      return Promise.all([
        knex('garage').insert([
        { name: 'christmass decorations', reason: 'summer', cleanliness: 'Dusty' },
        { name: 'bike', reason: 'storage', cleanliness: 'Sparkling' },
        { name: 'gym shoes', reason: 'worn', cleanliness: 'Rancid' },
        { name: 'car', reason: 'home', cleanliness: 'Sparkling' },
        { name: 'golf clubs', reason: 'no good at golf', cleanliness: 'Rancid' },
        ])]);
    });
};
