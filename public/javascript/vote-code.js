const API_ENDPOINTS ={
    apiURLVerifyCode : (code) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/getEventCode?userCode=${code}`,
    apiURLNewUser : ()=>`https://x8ki-letl-twmt.n7.xano.io/api:x_2QV0_G/voteurs`
};

function verifyCode() {
    const codeEnteredByUser = document.getElementById('enterCode').value;
    fetch(API_ENDPOINTS.apiURLVerifyCode(codeEnteredByUser))
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
    .then(data => {
        console.log(data);
        const inputCourriel = document.getElementById('courriel').value;
        const submit = document.getElementById('submitButton');
        if(data == "Invalid Code"){
            document.getElementById('error-message').style="text-decoration: red underline; color:white; display:block; font-weight: normal;font-style: italic;"
        }
        else if((data.statut== 'Supprimé') ||(data.statut== 'Archivé')){
            const alertDiv = document.getElementById('alertePasLive');
            
            const timestampStart = data.date_heure_debut;
            const timestampEnd = data.date_heure_fin;
            const dateStart = new Date(timestampStart);
            const dateEnd = new Date(timestampEnd);
            const options = {
                day: 'numeric',     // Day of the month
                month: 'long',      // Full month name (e.g., "novembre")
                year: 'numeric',    // Full numeric year
                hour: '2-digit',    // Two-digit hour
                minute: '2-digit'  // Two-digit minute
            };

            const formattedStart = new Intl.DateTimeFormat('fr-CA', options).format(dateStart);
            const formattedEnd = new Intl.DateTimeFormat('fr-CA', options).format(dateEnd);

            alertDiv.innerText = `L'événement ${data.titre} commencera le ${formattedStart} et terminera le ${formattedEnd}`;
            alertDiv.style.display = 'grid'; 
            // After 10 seconds, hide the div
             setTimeout(() => 
                {
                    alertDiv.style.display = 'none';
                }, 10000); // 10000 milliseconds = 10 seconds
        }
        else{
            submit.disabled=true;
            voterIP(inputCourriel, data.id, data.client_id);
        }
        console.log("fetch successful");
    })
    .catch(error => {
        console.error('Error:', error);
    })
}

function voterIP(inputCourriel, eventId, clientId){
    // Using the fetch API to get the public IP address from ipify
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())  // Convert the response to JSON
        .then(data => {
        // Log the public IP address
        const voterIPadr = data.ip;
        newVoter(voterIPadr,inputCourriel,eventId, clientId);
        })
        .catch(error => {
        // Handle any errors that may occur
        console.error('Error fetching IP:', error);
        });
}

function newVoter(voterIPadr,inputCourriel,eventId, clientId){
    const patchData = {
        ipAdr: voterIPadr,
        email: inputCourriel,
        dateTime : null,
        event_id : eventId
    };

    console.log("Patch data being sent:", patchData);

    fetch(API_ENDPOINTS.apiURLNewUser(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchData),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then((data)=>{
        console.log("New voter successfully added");
        document.querySelector('.spinner').classList.remove('disappear');
        setTimeout(function() {  
            window.location.href = `voteur-event.html?client_id=${clientId}&event_id=${eventId}&vid=${data.id}`;
        },3000);
    })
    .catch((error) => {
        console.error('Error with edit request:', error);
    });
}





