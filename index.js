// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1102JMw8-dWM6rIw6aG2-VGxQKmDpzCI",
  authDomain: "library-95774.firebaseapp.com",
  databaseURL: "https://library-95774.firebaseio.com",
  projectId: "library-95774",
  storageBucket: "library-95774.appspot.com",
  messagingSenderId: "902497218431",
  appId: "1:902497218431:web:cd17c9dd8ff299be77b44a",
  measurementId: "G-X7K5RGL895"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// DOMs declarations
let addButton = document.querySelector('#addButton');
let closeIcon = document.querySelector('.close.icon');
let newBookButton = document.querySelector('#newBookButton');
let bookTitle = document.querySelector('#bookTitle');
let author = document.querySelector('#author');
let pages = document.querySelector('#pages');
let readY = document.querySelector('#readY');
let contents = document.querySelector('.ui.grid.container');
let body = document.querySelector('body');

// Firebase related declarations
let reference = firebase.database().ref('books');
let populated = [];

// Firebase functions
let gotData = (data) => {
  let books = data.val();
  let booksKeys = Object.keys(books);
  for (let i = 0; i < booksKeys.length; i++) {
    let e = booksKeys[i];
    if (!populated.includes(e)) {
      populateItem(books[e].title, books[e].author, books[e].pages, books[e].read, e);
      populated.push(e);
    }
  };
};

let errData = (err) => {
  console.log("Error!");
  console.log(err);
};

// DOM related functions
let refreshContents = () => {
  document.querySelector('.ui.stackable.three.column.grid').remove();
    let contentColGrid = document.createElement('div');
    contentColGrid.classList.add('ui');
    contentColGrid.classList.add('stackable');
    contentColGrid.classList.add('three');
    contentColGrid.classList.add('column');
    contentColGrid.classList.add('grid');
    body.appendChild(contentColGrid);

    populated = [];
    reference.on('value', gotData, errData);
};



let populateItem = (title, author, pages, read, key) => {

  let specificReference = firebase.database().ref('books/' + key);

  let formCardCol = document.createElement('div');
  formCardCol.classList.add('column');
  let formCard = document.createElement('div');
  formCard.classList.add('ui');
  formCard.classList.add('card');
  formCard.classList.add('centered');
  let formCardHeader = document.createElement('div');
  formCardHeader.classList.add('content');
  formCardHeader.innerText = title;
  formCardHeader.style.fontSize = "large";
  formCardHeader.style.fontWeight = "bolder";
  formCard.appendChild(formCardHeader);

  let formCardContent = document.createElement('div');
  formCardContent.classList.add('content');
  let formCardContentAuthor = document.createElement('div');
  formCardContentAuthor.classList.add('summary');
  formCardContentAuthor.innerText = author;
  formCardContent.appendChild(formCardContentAuthor);
  let formCardContentPages = document.createElement('div');
  formCardContentPages.classList.add('summary');
  formCardContentPages.innerText = pages;
  formCardContent.appendChild(formCardContentPages);
  let formCardContentRead = document.createElement('div');
  formCardContentRead.classList.add('summary');
  if(read === true) {
    formCardContentRead.innerText = "Read";
    formCardContentRead.style.color = "green"
  } else {
    formCardContentRead.innerText = "Not Read";
    formCardContentRead.style.color = "red";
  }
  formCardContent.appendChild(formCardContentRead);
  formCard.appendChild(formCardContent);

  let formCardButtons = document.createElement('div');
  formCardButtons.classList.add('two');
  formCardButtons.classList.add('ui');
  formCardButtons.classList.add('buttons');
  let formCardButtonDelete = document.createElement('button');
  formCardButtonDelete.classList.add('ui');
  formCardButtonDelete.classList.add('red');
  formCardButtonDelete.classList.add('basic');
  formCardButtonDelete.classList.add('button');
  formCardButtonDelete.innerText = "Delete";

  formCardButtonDelete.addEventListener('click', () => {
    specificReference.remove();
    refreshContents();
  });

  let formCardButtonRead = document.createElement('button');
  formCardButtonRead.classList.add('ui');
  formCardButtonRead.classList.add('green');
  formCardButtonRead.classList.add('basic');
  formCardButtonRead.classList.add('button');
  formCardButtonRead.innerText = "Read Toggle";

  formCardButtonRead.addEventListener('click', () => {
    if(read === true){
      specificReference.update({'read': false})
    } else {
      specificReference.update({'read': true})
    }
    refreshContents();
  });

  formCardButtons.appendChild(formCardButtonDelete);
  formCardButtons.appendChild(formCardButtonRead);
  formCard.appendChild(formCardButtons);

  formCardCol.appendChild(formCard);
  document.querySelector('.ui.stackable.three.column.grid').appendChild(formCardCol);
};

$('#addButton').on("click", () => {
    $('.ui.modal').modal('show');
});


$('.close.icon').on("click", () => {
  $('.ui.modal').modal('hide');
});


newBookButton.addEventListener('click', () => {
  itemsMap = {
    '#bookTitle' : '#titleField',
    '#author' : '#authorField',
    '#pages' : '#pagesField'
  };
  let proceed = true;
  Object.keys(itemsMap).forEach(e => {
    document.querySelector(itemsMap[e]).classList.remove('error');
    if (document.querySelector(e).value === "") {
      document.querySelector(itemsMap[e]).classList.add('error');
      proceed = false;
    }
  });
  if (!(/[0-9]+/g.test(pages.value))) {
    document.querySelector(itemsMap['#pages']).classList.add('error');
    proceed = false;
  } else {
    document.querySelector(itemsMap['#pages']).classList.remove('error');
  }
  if(proceed) {
    $('.ui.modal').modal('hide');
    let data = {
      title: bookTitle.value,
      author: author.value,
      pages: pages.value,
      read: readY.checked
    }
    reference.push(data);

    bookTitle.value = '';
    author.value = '';
    pages.value = '';
    readY.checked = false;
  }
});

// App's First Initialization
reference.on('value', gotData, errData);