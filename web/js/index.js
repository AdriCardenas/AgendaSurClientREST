
function handleClientLoad() {
    // Loads the client library and the auth2 library together for efficiency.
    // Loading the auth2 library is optional here since `gapi.client.init` function will load
    // it if not already loaded. Loading it upfront can save one network request.
    gapi.load('client:auth2', initClient);
}

function handleConnection() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
}

function initClient() {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    var initialized = gapi.client.init({
        apiKey: 'AIzaSyD-YkjNcqoEH4GND279kbs8YkW0AF5J3pg',
        discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
        clientId: '1095663528592-3uacq2gga1bien0l9jqfh22i1o6qaf7f.apps.googleusercontent.com',
        scope: 'profile'
    });
    initialized.then(handleConnection);
}

function updateSigninStatus(isSignedIn) {
    // When signin status changes, this function is called.
    // If the signin status is changed to signedIn, we make an API call.
    if (isSignedIn) {
        //alert('Conectado correctamente');
        makeApiCall();
        //addUser();

    }
}

function handleSignInClick(event) {
    // Ideally the button should only show up after gapi.client.init finishes, so that this
    // handler won't be called before OAuth is initialized.
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().disconnect();
    window.location = "index.html";
}

function makeApiCall() {
    // Make an API call to the People API, and print the user's given name.
    gapi.client.people.people.get({
        'resourceName': 'people/me',
        'personFields': 'emailAddresses,names'
    }).then(function (response) {
        console.log(response);
        //console.log('Hello, ' + response.result.names[0].givenName);
        var nombre = response.result.names[0].givenName;
        var apellido = response.result.names[0].familyName;
        var email = response.result.emailAddresses[0].value;
        //alert('Hola, ' + response.result.names[0].givenName);
        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("apellidoUsuario", apellido);
        localStorage.setItem("emailUsuario", email);

        window.location = "listadoEventos.html";
    }, function (reason) {
        console.log('Error: ' + reason.result.error.message);
    });
}
