function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const eventId = getQueryParam('event_id');
const eventName = getQueryParam('event_titre');

const eventInfoElement = document.getElementById('event-titre');

if (eventId && eventName) {
    eventInfoElement.style = `text-align:center;`
    eventInfoElement.textContent = `${eventName}`;
} else {
    eventInfoElement.textContent = 'No event data available.';
}


const apiURLQuestionsPerEvent = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question?event_id=${eventId}`;
fetch(apiURLQuestionsPerEvent)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })

  .then(data => {
    console.log(data); 
    const questionsDiv = document.getElementById('questions');
    data.forEach ((item, index)=>{
        const itemButton = document.getElementById('question-button');
        const itemClone = itemButton.cloneNode(true);
        itemClone.querySelector('#question-text').textContent = item.question_valeur;
        itemClone.querySelector('#question-text').setAttribute('question-id',item.id);
        itemClone.querySelector('#reponsesPossibles').textContent = item.Reponses_Possibles;
        itemClone.querySelector('#input2').setAttribute('value',item.Reponses_Possibles);
        const uniqueId = 'question' + (index + 1);
        const button = itemClone.querySelector('.btn');
        const content = itemClone.querySelector('.collapse');
        content.setAttribute('id', uniqueId);
        button.setAttribute('aria-controls', uniqueId); 
        button.setAttribute('data-bs-target', `#${uniqueId}`); 

        itemClone.style.display = 'block';
        questionsDiv.appendChild(itemClone);
    })
  })
  .catch(error=>{
    console.error('Error fetching questions: ', error);
  });


const apiURLEventDetails = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/event/${eventId}`;
fetch(apiURLEventDetails)
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
})
.then (data=>{
    console.log(data);
    const section = document.getElementById('eventInformation');
    section.querySelector('#eventDescription').textContent=data.description;
    
    const timestampStart = data.date_heure_debut;
    const timestampEnd = data.date_heure_fin;

    const dateStart = new Date(timestampStart);
    const dateEnd = new Date(timestampEnd);
    const options = {
        year: 'numeric',    // Full numeric year
        month: 'long',      // Full month name (e.g., "novembre")
        day: 'numeric',     // Day of the month
        hour: '2-digit',    // Two-digit hour
        minute: '2-digit',  // Two-digit minute
    };

    const formattedStart = new Intl.DateTimeFormat('fr-CA', options).format(dateStart);
    const formattedEnd = new Intl.DateTimeFormat('fr-CA', options).format(dateEnd);

    section.querySelector('#eventDate').innerHTML = `Début: ${formattedStart} <br> Fin: ${formattedEnd}`;

    if(data.client){
        const clientLogoURL = data.client.logo.url;
        
         // Set client logo
         const clientLogoElement = section.querySelector('#eventImg');
         if (clientLogoElement) {
             clientLogoElement.src = clientLogoURL;
         }
    }

})
.catch(error=>{
    console.error('Error fetching questions: ', error);
});
