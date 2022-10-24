const {Jo, Jor, JoHelp} = require("../../dist/jo") // result from `npm run build` on project directory
// Call operation search on the exposed service ChuckNorris
Jo("ChuckNorris").search({ query: "Computer" })
    .then(response => {
        // Pick a random joke
        // api.chucknorris.io returns jokes in a "result" array subelement
        if (response.result) {
            for (const joke of response.result) {
                const li = document.createElement("li")
                const text = document.createTextNode(joke.value)
                li.appendChild(text)
                document.getElementById('hello-jo').appendChild(li)
            }
        }
    })
    .catch(JoHelp.parseError).catch(alert);

Jor("ChuckNorris").search.get({ query: "Earth" })
    .then(response => {
        // Pick a random joke
        // api.chucknorris.io returns jokes in a "result" array subelement
        if (response.result) {
            for (const joke of response.result) {
                const li = document.createElement("li")
                const text = document.createTextNode(joke.value)
                li.appendChild(text)
                document.getElementById('hello-jor').appendChild(li)
            }
        }
    })
    .catch(JoHelp.parseError).catch(alert);
document.getElementById('hello-webpack').innerText = 'Hello from webpack!'

export default {}