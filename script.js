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
        console.log("fetchAllMovies",json);
        movies.innerHTML = "";
        for(i=0; i < json.length; i++)
            {
                console.log(json[i].name)
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
        console.log(studioName, studioPassword);
        postNewStudio(studioName, studioPassword);
    })
}

function postNewStudio(studioName, studioPassword)
{
    console.log(studioName, studioPassword);
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
    console.log("loginhej");
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
    console.log("checkloginhej");
    fetch("https://localhost:44361/api/Filmstudio")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        console.log("checkStudiologin", json);
           
        for(i=0; i < json.length; i++)
        {
            if (loginName == json[i].name && loginPassword == json[i].password)
            {
                console.log("Lycka");
                var userID = json[i].id;    
            }
                
            console.log(loginName, loginPassword);
            console.log(json[i].name, json[i].password);
                
            if (userID !== null)
            {
                localStorage.setItem("userLog", userID);
                console.log(localStorage.getItem("userLog"));
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
    console.log(localStorage);
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
        console.log("handlemoves",json);
        console.log(json.filmId);
        for(i=0; i < json.length; i++)
        {
                
            if (json[i].stock > 0)
            {
                console.log(json[i].studioId);
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
    console.log("aids");
    movies.innerHTML = "Välj en film: <br>";


    fetch("https://localhost:44361/api/RentedFilm")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        console.log("handlemoves",json);
        console.log(json.filmId);
        for(i=0; i < json.length; i++)
        {
                
            if (json[i].studioId == Number(localStorage.getItem("userLog")) && json[i].returned == false)
            {
                console.log(json[i].studioId);
                movies.innerHTML += "<button onclick='getReturnInfo(\"" + json[i].id + "\")'>" + json[i].filmId + "</button>" + "<br>";
            }
            else
            {
                console.log("tstsaj");
            }

        }
        
    })
}

function getReturnInfo(id)
{
    console.log(id);
    fetch("https://localhost:44361/api/RentedFilm/" + id)

    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        console.log(json);
        returnMovie(json);
    })
}

function returnMovie(movie)
{
    console.log(movie.id);
    console.log(movie.filmId);
    var data = "https://localhost:44361/api/RentedFilm/" + movie.id;
    console.log(data);
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
        console.log("handlemoves",json);
        console.log(json.filmId);
        for(i=0; i < json.length; i++)
        {
                
            if (json[i].studioId == localStorage.getItem("userLog"))
            {
                console.log(json[i].studioId);
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
    console.log(triviaToPost, movieId);
    console.log("sad");
    
    var trivia = {FilmId: Number(movieId), Trivia: triviaToPost}
    console.log(trivia);

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
    console.log(id);
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
