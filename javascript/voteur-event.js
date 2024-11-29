function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const clientId = getQueryParam ('client_id');
const eventId = getQueryParam ('event_id');
const voterId = getQueryParam ('voter_id');
const apiUrl = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/event/${eventId}`;

console.log(apiUrl);
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
    .then(data =>{
        console.log(data);
        const eventName = data.titre;
        document.getElementById('welcome').textContent = `Bienvenue à ${eventName}`;

        if(data.client){
            const clientLogoURL = data.client.logo.url;
            
             // Set client logo
             const clientLogoElement = document.getElementById('clientLogo');
             if (clientLogoElement) {
                 clientLogoElement.src = clientLogoURL;
             }
        }

        if(data.statut==="En direct"){
            document.getElementById("enterEventSpace").classList.remove('disabled');
            document.getElementById("messagePatienter").style.display='none';
            document.getElementById('enterEventSpace').setAttribute('onclick', `window.location.href = 'voteur-attente.html?event_id=${data.id}&client_id=${data.client_id}&vid=${voterId}'`);

         }else{
            document.getElementById("enterEventSpace").classList.add('disabled');            
            document.getElementById("messagePatienter").style.display='true';
         }
    })
    .catch(error => {
        console.error('Error:', error);
    })
