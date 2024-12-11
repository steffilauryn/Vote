// ********** À FAIRE : FAIRE EN SORTE QUE L'INFORMATION SORTIE DANS LA CONSOLE EST PRIVÉ. AUTHORIZATION. 

// LIEN POUR API QUI "GET" LA LISTE DE TOUS LES ÉVÉNEMENTS
const apiURLEvent ='https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/allEvents';

// FETCH QUI COMMENCE LA REQUÊTE
fetch(apiURLEvent)
  // VÉRIFIE SI LE API DONNÉ DANS LE FETCH EST VALIDE. SI OUI, RETOURNE LE JSON() DE LA REQUÊTE. SI NON, RETOURNE MESSAGE D'ERREUR
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })

  // COMMENCE LES MANIPULATIONS DU DATA SORTIE PAR LE FETCH
  .then(data=>{
    // RETOUR DU DATA DANS LA CONSOLE. MÉTHODE POUR S'ASSURER QUE L'INFORMATION PRIS PAR L'API EST LE BON.
    console.log(data); 

    // ON PREND LE DIV EN QUESTION DANS LE DOM, CAR C'EST LÀ QUE L'INFORMATION SERA PLACÉ.
    const eventsDiv = document.getElementById('events');
    
    // POUR CHAQUE BLOC DANS LE DATA (CHAQUE EVENT DANS LA LISTE D'ÉVÉNEMENT) FAIRE LES ACTIONS SUIVANTES 
    data.forEach(event => {

        // CRÉER UN CLONE DU TEMPLATE 
        const eventCard = document.getElementById('eventCard');
        const eventCardClone = eventCard.cloneNode(true);
        
        // AVEC LE CLONE FAIRE LES ACTIONS SUIVANTES 
        eventCardClone.querySelector('#eventName').textContent = event.titre; //TITRE DE L'ÉVÉNEMENT DANS LE BLOC DE GAUCHE
        eventCardClone.querySelector('#eventDescription').textContent = event.card_description; //DESCRIPTION DE L'ÉVÉNEMENT DANS LE BLOC DE GAUCHE 
        eventCardClone.querySelector('#event-id').textContent = event.id; // ID DE L'ÉVÉNEMENT 
        eventCardClone.querySelector('#event-status').textContent = event.statut; //STATUT DE L'ÉVÉNEMENT 
        
        // SI UN CLIENT EST ASSOCIÉ À L'ÉVÉNEMENT (it should always be true but yea)
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
        else{
              const clientLogoElement = eventCardClone.querySelector('#eventCardImg');
              if (clientLogoElement) {
                  clientLogoElement.src = "/images/aucuneImage.png";
                  clientLogoElement.alt = "Aucune client assigné."; // Optional: Add alt text for accessibility
              }
        }

        // UPDATE ONCLICK 
        eventCardClone.setAttribute('onclick', `window.location.href = 'questions.html?event_id=${event.id}&event_titre=${event.titre}'`);

        // CLONE BLOC
        eventCardClone.style.display = 'block';
        eventsDiv.appendChild(eventCardClone);
    });
  })
  
  // S'IL Y A UN PROBLÈME DANS LE FETCH
  .catch(error => {
    console.error('Fetch error: ', error);
  })

// FONCTION QUI RETOURNE LE EVENTID ET LE EVENTNAME DANS LA CONSOLE
function retrieveEvent(eventId,eventName){
  console.log(eventId);
  console.log(eventName);
};
