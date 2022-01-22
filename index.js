require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


//Established database Connection
mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("Connection Established"));


//Get all books
/*
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

//Get a specific book localhost:3000/12345Book
/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn",async (req,res) => {

const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

//null !0 = 1 , !1=0
  if(!getSpecificBook) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});

//Get a book of a specific category
/*
Route            /c
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/

booky.get("/c/:category", async (req,res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category});

  //null !0 = 1 , !1=0
    if(!getSpecificBook) {
      return res.json({error: `No book found for the category of ${req.params.category}`});
    }

    return res.json({book: getSpecificBook});
});


//Get sepicfic Book on language
/*
Route            /d
Description      Get specific book
Access           PUBLIC
Parameter        category
Methods          GET
*/

booky.get("/d/:language", async (req,res) => {
  const getSpecificBook = await BookModel.findOne({language: req.params.language});

  //null !0 = 1 , !1=0
    if(!getSpecificBook.length) {
      return res.json({error: `No book found for the language of ${req.params.language}`});
    }

    return res.json({book: getSpecificBook});
});


//-----------------------------------------------AUTHOR----------------------------------------------

//Get all authors

/*
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/author", async (req,res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});


//to get a list of authors based on books
/*
Route           /b/books
Description     Get specific author
Access          Public
Parameter       book
Methods         GET
*/

booky.get("/b/:books", async(req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({ books: req.params.books });

    if (!getSpecificAuthor.length) {
        return res.json({
            error: `No author found for book of ${req.params.books}`
        });
    }

    return res.json({ books: getSpecificAuthor });

});


//GET ALL AUTHORS BASED ON A BOOK
/*
Route           /author/book
Description     Get all authors based on book
Access          Public
Parameter       isbn
Methods         GET
*/

booky.get("/author/book/:isbn", async(req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({ books: req.params.isbn });

    if (!getSpecificAuthor) {
        return res.json({
            error: `No author found for isbn of ${req.params.isbn}`
        });
    }

    return res.json({ authors: getSpecificAuthor });
});


//---------------------------------------publication------------------------------



//GET ALL PUBLICATIONS

/*
Route            /publications
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/publications",async (req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});

// to get specific publication - ASSIGNMENT
/*
Route           /p/books
Description     Get specification publications
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/publication/book/:isbn", async(req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({ publication: req.params.isbn });
    if (!getSpecificPublication.length) {
        return res.json({
            error: `No publication found for isbn of ${req.params.isbn}`
        });
    }

    return res.json({ publication: getSpecificPublication });
});


// to get a list of publications based on books
/*
Route           /b/book
Description     Get specific publications based on book
Access          Public
Parameter       book
Methods         GET
*/

booky.get("/pb/:book", async(req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({ publication: req.params.book });

    if (!getSpecificPublication.length) {
        return res.json({
            error: `No publication found for book of ${req.params.book}`
        });
    }

    return res.json({ book: getSpecificPublication });

});


//--------------------------------------POST---------------------------------
//All new books
/*
Route            /book/new
Description      Add new books
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/book/new",async (req,res) => {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was added !!!"
  });
});

//Add new authors
/*
Route            /author/new
Description      Add new authors
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/author/new",async (req,res) => {
const { newAuthor } = req.body;
const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json(
    {
      author: addNewAuthor,
      message: "Author was added!!!"
    }
  );
});

//Add new publications
/*
Route            /publication/new
Description      Add new publications
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/publication/new", (req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
});

//----------------------------------------------UPDATE PUT-------------------------------

//Update  a book title
/*
Route            /book/update/:isbn
Description      Update book on isbn
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

booky.put("/book/update/:isbn",async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({
    books: database.books
  });
});

/*********Updating new author**********/
/*
Route            /book/author/update
Description      Update /add new author
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

booky.put("/book/author/update/:isbn", async(req,res) =>{
  //Update book database
const updatedBook = await BookModel.findOneAndUpdate(
  {
    ISBN: req.params.isbn
  },
  {
    $addToSet: {
      authors: req.body.newAuthor
    }
  },
  {
    new: true
  }
);

  //Update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet: {
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    {
      bookss: updatedBook,
      authors: updatedAuthor,
      message: "New author was added"
    }
  );
} );


/*
Route            /publication/update/book
Description      Update /add new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated publications"
    }
  );
});

//---------------------------------DELETE----------------------------------------

//Delet author
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", async (req,res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );

  return res.json({
    books: updatedBookDatabase
  });
});


//Delete an author from a book and wise versa
/*
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.author.filter(
         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
       );
       book.author = newAuthorList;
       return;
     }
   });


  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!"
  });
});


booky.listen(3000,() => {
  console.log("Server is up and running");
});
