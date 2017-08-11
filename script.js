

$("#startPage").click(function(){
     $("#startPage").hide();
     $("#mainPage").show();
     $('body').attr('class', 'inicial-page');
 });

function Queue(){ 
    this.data = [];
    this.enqueue = function(element){ 
        this.data.push(element);
    }
    this.dequeue = function(){ 
        var result = this.data[0];
        this.data.shift();
        return result;
        }
}

function Library(){                                       
    this.livros = new Queue();
    this.livrosViewed = new Queue();
    this.actualLivro = null;
                                     
    this.addLivro = function (livro){                    
        this.livros.enqueue(livro); 
    }

    this.gostar= function(){
        this.actualLivro.likes++;
        this.nextLivro();
    }

    this.naogostar= function(){
        this.actualLivro.dislikes++;
        this.nextLivro();
    }  

    this.nextLivro = function(){
        this.actualLivro = this.livros.dequeue(); 
        if (this.actualLivro == undefined){
            $('#mainPage').hide();
            $("#endPage").show();
            this.calcular(); 
            $('body').attr('class', 'end-page');
            
        }
        else{
             this.livrosViewed.enqueue(this.actualLivro);
             this.actualLivro.render();
        }
    } 

    this.calcular = function (){  
        var tlikes = 0;
        var tdislikes= 0;
        var sim = this.livrosViewed.dequeue();
        while (sim != undefined){
            tlikes += sim.likes;
            tdislikes += sim.dislikes;

            var html = "<tr>";
            html += "<td>";
            html += sim.title;
            html += "</td>";
            html += "<td>";
            html += sim.likes;
            html += "</td>";
            html += "<td>";
            html += sim.dislikes;
            html += "</td>";
            html += "</tr>";
            $('#tabela').append(html);

            sim = this.livrosViewed.dequeue();
        }
        $("#likesLabel").html(tlikes);
        $("#dislikesLabel").html(tdislikes);
    }
}

function Livro (title,img,descricao,linkEditora1){         
    this.title = title;
    this.img = img;
    this.descricao = descricao; 
    this.linkEditora1= linkEditora1;
    this.likes = 0;
    this.dislikes = 0;

    this.render = function(){
        $("#title").html(this.title);
        $("#img").attr('src',this.img);
        $("#descricao").text(this.descricao);
        $("#linkEditora1").attr('href',this.linkEditora1);
    }
}

var library = null;
function init(paramPesquisa) {
    var url = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURI(paramPesquisa) + "&maxResults=40"+ "&startIndex=10";
    //https://productforums.google.com/forum/#!topic/books-api/z_kbN_Cu_9Y;context-place=topicsearchin/books-api/authorid$3AAPn2wQepP2XxT7tZ6K0WOrL2kayXJTTKuMMZqr6D5bzOPOcWK-vVL5ptiBPQW1oGUFCkPs0DZIzs%7Csort:date%7Cspell:false
    //link: possibilidade de por mais de 10items
    $.get(url).done(function (data) {
        library = new Library();
        for (var i = 0; i < data.items.length; i++) {
            var livrodoGoogle = data.items[i];
            var title = livrodoGoogle.volumeInfo.title;
            var description = livrodoGoogle.volumeInfo.description;
            var img = livrodoGoogle.volumeInfo.imageLinks != null ? livrodoGoogle.volumeInfo.imageLinks.thumbnail : "error" ;
            //por link em vez de erro!
            //fazer para o resto
            
            // img.onerror = function () { 
            //     this.style.display = "none";
            // }

            // if (var img != null){
            //     var img = livrodoGoogle.volumeInfo.imageLinks.thumbnail;
            // }
            // else{
            //      var img = "error";
            // }
            // $('img').error(function () { 
            //     $(this).hide(); 
            // });
            var linkEditora1 = livrodoGoogle.volumeInfo.previewLink;

           

            var livro = new Livro(title, img, description, linkEditora1);
            library.addLivro(livro);

        }
        library.nextLivro();

    }).fail(function (data) {
        console.log(data);
    })
}

    init("química");
        

$('#buttonLike').click(function(){
    library.gostar();
});

$('#buttonDislike').click(function(){
    library.naogostar(); 
});










