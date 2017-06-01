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
    .then(item => {
      itemsArr.push(item)
      showAllItems(itemsArr)
    })
}

const showAllItems = (items) => {
  console.log(itemsArr);
  $("#garage-inventory").empty()
  garageNumbers()
  items.map(item => {
    $('#garage-inventory').append(`
      <div class="item-card">
        <h2 id="${item.id}" name="${item.id}" class="item-name">${item.name}</h2>
      </div>
    `)
  })
}

const garageNumbers = () => {
  let nubers = itemsArr.reduce((numbers, item) => {
    
  })
}

$('#garage-door').click(() => {
  doorOpen = !doorOpen
  if (doorOpen) {
    $('#garage-door').text('Close Garage Door')
    showAllItems(itemsArr)
    $('.garage').toggleClass('garage-open')
  } else {
    $('#garage-door').text('Open Garage Door')
    $('.garage').toggleClass('garage-open')
  }
});

$(document).keyup(() => {
  const isName = $('#name-input').val().length
  const isReason = $('#reason-input').val().length
  if(isName && isReason ){
    $('#add-new-item').prop('disabled', false)
  } else {
    $('#add-new-item').prop('disabled', true)
  }
})

$('#add-new-item').click( (e) => {
  e.preventDefault()
  let name = $('#name-input').val()
  let reason = $('#reason-input').val()
  let cleanliness = $('#cleanliness-select').val()
  $('#name-input').val('')
  $('#reason-input').val('')
  $('#add-new-item').prop('disabled', true)
  addItem(name, reason, cleanliness)
})
