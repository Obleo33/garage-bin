let doorOpen = false;
let itemsArr = []


$(document).ready(()=> {
  getItems()
})

const getItems = () => {
  fetch('/api/v1/garage')
    .then(response => response.json())
    .then(items => itemsArr = items)
    .catch(error => console.log(error))
}

const addItem = (name, reason, cleanliness) =>  {
  fetch('/api/v1/garage', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ name, reason, cleanliness}),
  })
    .then(response => response.json())
    .then(link => appendItem());
}

const showAllItems = (items) => {
  console.log(itemsArr);
  $("#garage-inventory").empty()
  items.map(item => {
    appendItem(item);
  })
}

const appendItem = (item) => {
  $('#garage-inventory').append(`
    <div class="item-card">
      <h2 id="${item.id}" name="${item.id}" class="item-name">${item.name}</h2>
    </div>
  `)
}

$('#garage-door').click(() => {
  doorOpen = !doorOpen

  if (doorOpen) {
    $('#garage-door').text('Close Garage Door')
    showAllItems(itemsArr)
  } else {
    $('#garage-door').text('Open Garage Door')
  }
});

$('#add-new-item').click((e) => {
  e.preventDefault()
  console.log('here');
})
