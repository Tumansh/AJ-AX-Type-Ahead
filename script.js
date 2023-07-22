const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const cities = [];//we make an empty cities array

// const prom = fetch(endpoint); //fetch returns a promise
// console.log(prom); //see console to see the prototype of prom, it will be a promise
// the data that comes back from fetch does not know what type of data it is..it could be an image or a music or json file.
// here we know that it is gonna be a json file
// .then(blob=>JSON.parse(blob)); this will not be able to parse blob because we first need to convert 
//blob from rawdata to json file and then we can parse it
fetch(endpoint) 
.then(blob =>blob.json()) //if we call blob.json(), it is gonna return another promise to which we again apply .then
// .then(data => console.log(data)) //we get the json in data and we console.log data to see the massive array 

// we want to put data into cities array:
// option1: we can simply assign 
// .then(data=> cities = data);  but this gives an error because we are changing const cities[]

// option2: we can push data into cities[]
// .then(data=>cities.push(data));//but this will push data as one whole item in cities[].

// option3: we must use spread function to push the individual items of data into cities[]
   .then(data=>cities.push(...data));


//==== WHEN SOMEONE TYPES IN THE SEARCH BOX, WE NEED TO RUN A FUNCTION THAT TAKES 
// THE MASSIVE ARRAY AND FILTERS IT INTO A SUBSET:========
function findMatches(cities, wordToMatch)
{
    return cities.filter(place=>{
        const regex = new RegExp(wordToMatch,'gi'); //we need to generate a regular expression from wordToMatch because the 
        // word to match will not always be 'newyork' or 'boston' etc...it can be anyting. so we to generate a 
        // general regex. 
        // 'gi' means we wanna match globally(g)-in the global array 
        // and insensitively(i)-without caring about lower or upper cases

        //  Then we need to check if the city or state matches with what was searched. 
        return (place.city.match(regex) || place.state.match(regex));//if either city name matches or state
        //  name matches, it will return true, so the cities array will be filtered acc to wordToMatch
    });
}

//convert population to number with commas(taken this from stack overflow)
function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

// WHENEVER SOMEONE CHANGES THE VALUE IN THE SEARCH BOX, WE WILL CALL displayMatches() TO DISPLAY ALL 
// THE POSSIBLE MATCHES
// displayMatches() WILL CALL findMatches() TO CHECK WHICH STATES OR CITIES MATCH THE WORD THAT HAS BEEN INPUT INTO SEARCH BOX
function displayMatches()
{
    // console.log(this.value);//whatever someone has typed in the search bar comes in console
    // match array is the array that is received from findMatches() ie. the array that is generated when wordToMatch
    //  matches the city or state name.
    const matcharray = findMatches(cities,this.value);//this.value means the text typed into search box
    // console.log(matcharray);
    // MAP OVER THE matcharray to create html for each place in the matcharray 
    const html = matcharray.map(place=>
        {
            const regex = new RegExp(this.value, 'gi');//we wanna generate a regex of the text typed in search bar
            //to highlight the city name we replace the regex with the span of the class hightlight so that the name that matched gets highlighted 
            const cityName = place.city.replace(regex, `<span class = hl>${this.value}</span>`) //it finds whatever matched with regex and replaces it with a span of class highlight
            const stateName = place.state.replace(regex, `<span class = hl>${this.value}</span>`)//highlight the state name that matches with the regex

            // now we will place.cityName and place.state in one span 
            return `
            <li>
            <span class =  "name"> ${cityName}, ${stateName}</span> 
            <span class = "population"> ${numberWithCommas(place.population)}</span>
            </li>
            `;
        }).join('');//map() returns an array with multiple comma-separated items but we want a single string in suggestions, so use join()
     suggestions.innerHTML = html;   
}
const searchInput = document.querySelector('.search'); //we select the search bar from DOM
const suggestions = document.querySelector('.suggestions');
//whenever the change event occurs in searchInput, we listen to it by calling the displayMatches()
searchInput.addEventListener('change',displayMatches);
searchInput.addEventListener('keyup',displayMatches);