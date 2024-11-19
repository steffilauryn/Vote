const apiURLEvent ='https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/event';
fetch(apiURLEvent)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })

  .then(data=>{
    console.log(data); 
    //insert data into DOM
    const eventsDiv = document.getElementById('events');
    
    data.forEach(event => {
        const eventCard = document.getElementById('eventCard');
        const eventCardClone = eventCard.cloneNode(true);
        eventCardClone.querySelector('#eventName').textContent = event.titre;
        eventCardClone.querySelector('#eventDescription').textContent = event.card_description;
        eventCardClone.querySelector('#event-id').textContent = event.id;
        eventCardClone.querySelector('#event-status').textContent = event.statut;
        if(event.client){
            const clientName = event.client.nom_compagnie;
            const clientLogoURL = event.client.logo.url;
            
             // Set client logo
             const clientLogoElement = eventCardClone.querySelector('#eventCardImg');
             if (clientLogoElement) {
                 clientLogoElement.src = clientLogoURL;
                 clientLogoElement.alt = clientName; // Optional: Add alt text for accessibility
             }
        }
        // Update the onclick attribute
        eventCardClone.setAttribute('onclick', `window.location.href = 'questions.html?event_id=${event.id}&event_titre=${event.titre}'`);


        eventCardClone.style.display = 'block';
        eventsDiv.appendChild(eventCardClone);
    });
  })

  .catch(error => {
    console.error('Fetch error: ', error);
  })
  
  function retrieveEvent(eventId,eventName){
    console.log(eventId);
    console.log(eventName);

  }
  
  
  
  
  
  
  
  
  
  ;