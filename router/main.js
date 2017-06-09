module.exports = function(app, Book)
{
    // 책생성.
    app.post('/books', function(req, res){
        var book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        book.published_date = new Date(req.body.published_date);
        
        book.save(function(err){
            if(err){
                console.error(err);
                res.json({result:0});
                return;
            }
            res.json({result:1});
        });
    });
    
    // 전체 책목록 가져오기.
    app.get('/books', function(req, res){
        Book.find(function(err, books){
            if(err){
                return res.status(500).send({error:"db error"});
            }
            res.json(books);
        });
    });
    
    // 책한권가져오기, id는 유일한 것이어야 한다.
    app.get('/books/:book_id', function(req, res){
        Book.findOne({_id:req.params.book_id}, function(err, book){
            if(err){
                return res.status(500).json({error:err});
            }
            if(!book){
                return res.status(404).json({error:"book not found"});
            }
            res.json(book);
        });
    });
    
}