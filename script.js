var movies = document.getElementById("movies");



if (localStorage.getItem("userLog") !== "null")
{
    WelcomePageForLoggedin();
}
else
{
    showLogInPage();
}

function showLogInPage()
{
    localStorage.setItem("userLog", null);
    fetch("https://localhost:44361/api/film")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        
        movies.innerHTML = "";
        for(i=0; i < json.length; i++)
            {
              
                movies.innerHTML += '<img src="img/'+json[i].id+'.jpg" alt="" onclick="getTrivia('+json[i].id+')"></img>';
            }
            movies.insertAdjacentHTML("beforeend", 
            '<div><button onclick="registerAStuido()">Register</button><button onclick="loginStudio()">Login</button></div>')
    })
}

function registerAStuido()
{
    movies.innerHTML = "reggamove";
    movies.insertAdjacentHTML("afterbegin", 
    "<div><input type='text' placeholder='Studioname' id='studioName'><input type='text' placeholder='Password' id='studioPassword'><button id='sendPost'>Registrera</button></div>")
    
    var sendPost = document.getElementById("sendPost");
    sendPost.addEventListener("click", function()
    {
        var studioName = document.getElementById("studioName").value;
        var studioPassword = document.getElementById("studioPassword").value;
        postNewStudio(studioName, studioPassword);
    })
}

function postNewStudio(studioName, studioPassword)
{
    
    var stuidoToPost = {name: studioName, password: studioPassword, verified: true}

    fetch ("https://localhost:44361/api/Filmstudio",
    {
        method:'Post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(stuidoToPost),
    })
    
    showLogInPage();
}

function loginStudio()
{
    
    movies.innerHTML = "Logga in";
    movies.insertAdjacentHTML("afterbegin", 
    "<div><input type='text' placeholder='Studioname' id='loginName'><input type='text' placeholder='Password' id='loginPassword'><button id='sendLogin'>Login</button></div>")

    var sendLogin = document.getElementById("sendLogin");
    sendLogin.addEventListener("click", function()
    {
        var loginName = document.getElementById("loginName").value;
        var loginPassword = document.getElementById("loginPassword").value;
        checkStudiologin(loginName, loginPassword);
    })
}

function checkStudiologin(loginName, loginPassword)
{
   
    fetch("https://localhost:44361/api/Filmstudio")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        
           
        for(i=0; i < json.length; i++)
        {
            if (loginName == json[i].name && loginPassword == json[i].password)
            {
               
                var userID = json[i].id;    
            }
                
            
            
                
            if (userID !== null)
            {
                localStorage.setItem("userLog", userID);
                
                WelcomePageForLoggedin();
            }
            else
            {
                showLogInPage();
            }
        }
    })
}

function WelcomePageForLoggedin()
{
  
    movies.innerHTML = "Välkommen";
    
    movies.insertAdjacentHTML("beforeend", 
    "<div><button onclick='rentAMovie()'>Rent</button><button onclick='handleMovies()'>Movies</button><button onclick='findMovieTrivia()'>Trivia</button><button onclick='showLogInPage()'>Logout</button></div>")
}

function rentAMovie()
{
    fetch("https://localhost:44361/api/Film")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        
        for(i=0; i < json.length; i++)
        {
                
            if (json[i].stock > 0)
            {
                
                movies.innerHTML += "<button onclick='postRentMovie(\"" + json[i].id + "\")'>" + json[i].name + "</button>" + "<br>";
            }
        }
    })
}

function postRentMovie(id)
{
    var filmToRent = {FilmId: Number(id), studioId: Number(localStorage.getItem("userLog"))};
    fetch ("https://localhost:44361/api/RentedFilm/",
    {
        method:'Post',
        headers:{'Content-Type':'application/json'},
       body: JSON.stringify(filmToRent)
    })
    WelcomePageForLoggedin();
}



function handleMovies()
{
    
    movies.innerHTML = "Välj en film: <br>";


    fetch("https://localhost:44361/api/RentedFilm")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        
        for(i=0; i < json.length; i++)
        {
                
            if (json[i].studioId == Number(localStorage.getItem("userLog")) && json[i].returned == false)
            {
               
                movies.innerHTML += "<button onclick='getReturnInfo(\"" + json[i].id + "\")'>" + json[i].filmId + "</button>" + "<br>";
            }
            

        }
        
    })
}

function getReturnInfo(id)
{
  
    fetch("https://localhost:44361/api/RentedFilm/" + id)

    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
       
        returnMovie(json);
    })
}

function returnMovie(movie)
{
    
    var data = "https://localhost:44361/api/RentedFilm/" + movie.id;
    
    fetch (data,
    {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify
        ({
            "id": movie.id,
            "filmId": movie.filmId,
            "studioId": movie.studioId,
            "returned": true
        }),
    });
    WelcomePageForLoggedin();
}

function findMovieTrivia()
{
    fetch("https://localhost:44361/api/RentedFilm")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
      
        for(i=0; i < json.length; i++)
        {
                
            if (json[i].studioId == localStorage.getItem("userLog"))
            {
          
                movies.innerHTML += "<button onclick='postTrivia(\"" + json[i].filmId + "\")'>" + json[i].filmId + "</button>" + "<br>";
            }
        }
        
    })
}

function postTrivia(movieId)
{

    movies.insertAdjacentHTML("afterbegin", "<div><input type='text' placeholder='Trivia' id='trivia'><button id='postTrivia'>Post</button></div>");
    var postTrivia = document.getElementById("postTrivia");
    postTrivia.addEventListener("click", function()
    {
        var triviaToPost = document.getElementById("trivia").value;
        triviaPost(triviaToPost, movieId);
    })
    
}

function triviaPost(triviaToPost, movieId)
{
   
    
    var trivia = {FilmId: Number(movieId), Trivia: triviaToPost}
   

    fetch ("https://localhost:44361/api/FilmTrivia",
    {
         method:'Post',
         headers:{'Content-Type':'application/json'},
        body: JSON.stringify(trivia)
    })
    WelcomePageForLoggedin();
}

function getTrivia(id)
{

    fetch("https://localhost:44361/api/FilmTrivia")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        
        movies.innerHTML = "";
        for(i=0; i < json.length; i++)
            {
                if (json[i].filmId == id)
                {
                    movies.insertAdjacentHTML("afterbegin", "<div>"+ json[i].trivia +"</div><br>")
                }
                
            }
            movies.insertAdjacentHTML("afterbegin", "<button onclick='showLogInPage()'>Back</button><br>")
    })
}
