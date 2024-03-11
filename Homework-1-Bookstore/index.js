import { DataService } from "./src/data.service.js";
import { Book } from "./src/book.model.js";
import { createPath } from "./utils.js";
import { loggerEmitter } from "./src/logger.js";

const BOOKS_PATH = createPath(["data", "books.json"]);

//1. Get all users
const getAllBooks = async () => {
  const books = await DataService.readJSONFile(BOOKS_PATH);

  return books;
};

//2. Save users
const saveBooks = async (books) => {
  await DataService.saveJSONFile(BOOKS_PATH, books);
};

//3. Create User
const createBook = async (title, author, publicationYear, quantity) => {
  //1.Get all users
  const books = await getAllBooks();

  //2. Create a new user
  const newBook = new Book(title, author, publicationYear, quantity);

  //3. Adding the new user to the users array
  const updatedBooks = [...books, newBook];

  //4. Saving the new array in file system
  await saveBooks(updatedBooks);

  loggerEmitter.emit("create-book", newBook.id);
};

//4. Get user by id
const getBookById = async (bookId) => {
  //1. Get all users
  const books = await getAllBooks();

  //2. Find the user
  const foundBook = books.find((book) => book.id === bookId);

  if (!foundBook) throw new Error("BOOK NOT FOUND!");

  return foundBook;
};

//5. Update User
const updateBook = async (
  bookId,
  newTitle,
  newAuthor,
  newPublicationYear,
  newQuantity
) => {
  //1. Get all users
  const books = await getAllBooks();

  const idExists = books.some((book) => book.id === bookId);

  if (!idExists) throw new Error("Can't update book! Book not found!");

  const updatedBooks = books.map((book) => {
    if (book.id === bookId) {
      return {
        ...book,
        title: newTitle,
        author: newAuthor,
        publicationYear: newPublicationYear,
        quantity: newQuantity,
      };
    } else {
      return book;
    }
  });

  await saveBooks(updatedBooks);

  loggerEmitter.emit("edit-book", bookId);
};

//6. Delete User
const deleteBook = async (bookId) => {
  const books = await getAllBooks();

  const updatedBooks = books.filter((book) => book.id !== bookId);

  if (books.length === updatedBooks.length)
    throw new Error("Can't delete book! Book not found!");

  await saveBooks(updatedBooks);

  loggerEmitter.emit("delete-book", bookId);
};

//7. Delete All Users (nuclear)
const deleteAllBooks = async () => {
  await saveBooks([]);
};

const app = async () => {
  try {
    await createBook("Inferno", "Dante Alighieri", 1314, 338);
    // await updateBook(
    //   "6ffc6306-394a-4bf5-a4c9-cee28ee9f0cc",
    //   "Inferno",
    //   "Dante",
    //   1314,
    //   338
    // );
    // const inferno = await getBookById("4e0a9d0c-8320-417d-8bfb-7de8e0bf76d8");
    // console.log("THIS IS INFERNO:", inferno);
    // await deleteBook("7e6a4e48-59e8-4f35-ba1e-85db8aa1c82b");
    // await deleteAllBooks();

    const books = await getAllBooks();
    console.log(books);
  } catch (error) {
    console.error(error);
  }
};

app();
