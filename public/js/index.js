let doorOpen = false;
let itemsArr = [];


$(document).ready(() => {
  getItems();
});

const getItems = () => {
  fetch('/api/v1/garage')
    .then(response => response.json())
    .then(items => itemsArr = items)
    .catch(error => console.log(error));
};

const updateGarageStats = ({ total = 0, Sparkling = 0, Dusty = 0, Rancid = 0 }) => {
  $('.total-items').text(total);
  $('.total-sparkling').text(Sparkling);
  $('.total-dusty').text(Dusty);
  $('.total-rancid').text(Rancid);
};

const garageNumbers = () => {
  const garageObj = itemsArr.reduce((garageStats, item) => {
    if (!garageStats[item.cleanliness]) {
      garageStats[item.cleanliness] = 0;
    }
    garageStats[item.cleanliness] ++
    garageStats.total ++
    return garageStats;
  }, { total: 0 });
  updateGarageStats(garageObj);
};

const showAllItems = (items) => {
  $('#garage-inventory').empty();
  items.map((item) => {
    $('#garage-inventory').append(`
      <div data-item-id="${item.id}" class="garage-list-item">
        <h3 id="${item.id}" data-item-id="${item.id}" class="item-name">${item.name}</h3>
      </div>
    `);
  });
  garageNumbers();
};

const addItem = (name, reason, cleanliness) =>  {
  fetch('/api/v1/garage', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ name, reason, cleanliness }),
  })
  .then(response => response.json())
  .then(item => {
    itemsArr.push(item);
    showAllItems(itemsArr);
  });
};

$('#garage-inventory').on('click', $('.garage-list-item'), (e) => {
  fetch(`/api/v1/garage/${$(e.target).data('itemId')}`)
  .then(response => response.json())
  .then(array => array[0])
  .then((item) => {
    console.log(item);
    $('#item-detail').empty();
    $('#item-detail').append(`
      <div class="item-card">
        <h2><span>Name: </span>${item.name}</h2>
        <p><span>Reason: </span>${item.reason}</p>
        <p><span>Cleanliness: </span>${item.cleanliness}</p>
      </div>
    `);
  });
});

$('#sort-button').click(() => {
  console.log('clicked');
  fetch('/api/v1/sortbyname')
    .then(response => response.json())
    .then(items => itemsArr = items)
    .then(() => showAllItems(itemsArr))
    .catch(error => console.log(error))
});

$('#garage-door').click(() => {
  doorOpen = !doorOpen;

  if (doorOpen) {
    $('#garage-door').text('Close Garage Door');
    showAllItems(itemsArr);
    $('.garage').toggleClass('garage-open');
    $('#item-detail').empty();
  } else {
    $('#garage-door').text('Open Garage Door');
    $('.garage').toggleClass('garage-open');
  }
});

$(document).keyup(() => {
  const isName = $('#name-input').val().length;
  const isReason = $('#reason-input').val().length;
  if (isName && isReason) {
    $('#add-new-item').prop('disabled', false);
  } else {
    $('#add-new-item').prop('disabled', true);
  }
});

$('#add-new-item').click((e) => {
  e.preventDefault();
  const name = $('#name-input').val();
  const reason = $('#reason-input').val();
  const cleanliness = $('#cleanliness-select').val();
  $('#name-input').val('');
  $('#reason-input').val('');
  $('#add-new-item').prop('disabled', true);
  addItem(name, reason, cleanliness);
});
