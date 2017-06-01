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

const getByID = (id) => {

}

const showAllItems = (items) => {
  $("#garage-inventory").empty()
  garageNumbers()
  items.map(item => {
    $('#garage-inventory').append(`
      <div class="garage-list-item">
        <h3 id="${item.id}" class="item-name">${item.name}</h3>
      </div>
    `)
  })
}

$('#garage-inventory').on('click', $('.item-name'), (e) => {
  $('#item-detail').empty()

  fetch(`/api/v1/garage/${e.target.id}`)
  .then(response => response.json())
  .then(array => array[0])
  .then(item => {
    $('#item-detail').append(`
      <div class="item-card">
        <h2>${item.name}</h2>
        <p>${item.reason}</p>
        <p>${item.cleanliness}</p>
      </div>
    `)
  })
})

const updateGarageStats = ({ total = 0, Sparkling = 0, Dusty = 0, Rancid = 0 }) => {
  $('.total-items').text(total)
  $('.total-sparkling').text(Sparkling)
  $('.total-dusty').text(Dusty)
  $('.total-rancid').text(Rancid)
}

const garageNumbers = () => {
  let garageObj = itemsArr.reduce((garageStats, item) => {
    if(!garageStats[item.cleanliness]){
      garageStats[item.cleanliness] = 0
    }

    garageStats[item.cleanliness] ++
    garageStats.total ++

    return garageStats
  },{total:0})
  updateGarageStats(garageObj)
}

$('#inventory-header').click((e) => {
  switch (e.target.id) {
    case 'garage-total':
      orderBy('name');
    case 'sparkling-items':
      orderBy('cleanliness', 'Sparkling');
    case 'dusty-items':
      orderBy('cleanliness', 'Dusty');
    case 'rancid-items':
      orderBy('cleanliness', 'Rancid');
  }
})

const orderBy = (type, value) => {
  itemsArr = itemsArr.sort((a,b) => {
    if (type === 'name'){
      return a.type - b.type
    }
  })

  showAllItems(itemsArr)
}

$('#garage-door').click(() => {
  doorOpen = !doorOpen

  if (doorOpen) {
    $('#garage-door').text('Close Garage Door')
    showAllItems(itemsArr)
    $('.garage').toggleClass('garage-open')
    $('#item-detail').empty()
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
