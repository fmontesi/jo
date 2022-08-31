const jo = require("../../dist/jo") // result from `npm run build` on project directory
// Call operation search on the exposed service ChuckNorris
jo.Jo("ChuckNorris").search({ query: "Computer" })
    .then(response => {
        // Pick a random joke
        // api.chucknorris.io returns jokes in a "result" array subelement
        if (response.result) {
            for (const joke of response.result) {
                console.log(response.result)
                console.log(joke)
                const li = document.createElement("li")
                const text = document.createTextNode(joke.value)
                li.appendChild(text)
                document.getElementById('hello-jo').appendChild(li)
            }
        }
    })
    .catch(jo.JoHelp.parseError).catch(alert);
document.getElementById('hello-webpack').innerText = 'Hello from webpack!'