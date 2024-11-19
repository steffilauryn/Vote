function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const eventId = getQueryParam('event_id');
const eventName = getQueryParam('event_titre');

const eventInfoElement = document.getElementById('event-info');

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
        itemClone.querySelector('#reponsesPossibles').textContent = item.Reponses_Possibles;

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