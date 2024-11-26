function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const eventId = getQueryParam ('event_id');
const clientId = getQueryParam ('client_id');

const apiURLQuestionsPerEvent = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question?event_id=${eventId}`;
const apiURLClient = `https://x8ki-letl-twmt.n7.xano.io/api:nBe9gsiM/client/${clientId}`;

fetch (apiURLClient)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        document.getElementById('imgTest').src=data.logo.url;
    })
    .catch(error => {
        console.error('Error:', error);
    })
