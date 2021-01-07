$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.deleteBtn', deleteBook);
  $('#bookShelf').on('click', '.readBtn', bookRead);
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  })
    .then(function (response) {
      console.log('Response from server.', response);
      refreshBooks();
    })
    .catch(function (error) {
      console.log('Error in POST', error);
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
  })
    .then(function (response) {
      console.log(response);
      renderBooks(response);
    })
    .catch(function (error) {
      console.log('error in GET', error);
    });
}

// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let book of books) {
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr data-id="${book.id}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.status}</td>
        <td>
          <button class="deleteBtn">DELETE</button>
          <button class="readBtn">MARK AS READ</button>
        </td>
      </tr>
    `);
  }
}

function deleteBook() {
  let bookId = $(this).closest('tr').data('id');
  console.log(bookId);
  $.ajax({
    type: 'DELETE',
    url: `/books/${bookId}`,
  })
    .then(function (response) {
      refreshBooks();
    })
    .catch(function (error) {
      console.log('error in DELETE', error);
    });
}

function bookRead() {
  let bookId = $(this).closest('tr').data('id');
  
  $.ajax({
    type: 'PUT',
    url: `/books/${bookId}`,
  })
    .then(function (response) {
      refreshBooks();
    })
    .catch(function (error) {
      console.log('error in PUT', error);
    });
}
