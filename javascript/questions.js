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
    data.forEach((item, index) => {

        const itemButton = document.getElementById('question-button'); //ASSIGN TO itemButton THE DIV "A"
        const itemClone = itemButton.cloneNode(true);  //CREATE itemButton CLONE
        
        //UNIQUE ID USED FOR ARIA-CONTROLS AND DATA-BS-TARGETS -> USED TO CONTROL COLLAPSE
        const uniqueId = (index + 1);  
        const button = itemClone.querySelector('.btn');
        const content = itemClone.querySelector('.collapse');

        //SET ATTRIBUTES 
        button.setAttribute('aria-controls', uniqueId); 
        button.setAttribute('data-bs-target', `#${uniqueId}`); 
        content.setAttribute('id', uniqueId); //CHANGE ID OF COLLAPSEDDIV
        itemClone.querySelector('#question-text').setAttribute('question-id', item.id);
       
        //DISPLAY ANSWERS AND QUESTIONS
        itemClone.querySelector('#reponsesPossibles').textContent = item.Reponses;
        itemClone.querySelector('#question-text').textContent = item.question_valeur;
        itemClone.querySelector('#qidandtext').textContent=item.id;

        //SOUMETTRE BUTTON ACTION EVENT
        document.querySelector(".soumettreBtn").onclick = function() {  
            const q = document.querySelector('.newQuestionInput').value; 
            const a = document.querySelector('.newAnswersInput').value;
            document.querySelector("#question-text").textContent = q;
            document.querySelector("#reponsesPossibles").textContent = a; 
            const questionId = document.getElementById('question-text').getAttribute('question-id');
            changeQuestionAnswers (questionId, eventId, q, a);
            console.log(questionId);

        };  

        //DELETE BUTTON ACTION EVENT         FIX THIS
        document.querySelector(".deleteBtn").onclick = function() {
            document.querySelector('.danger').style="display:block;";
        };

        //YES DELETE QUESTION                 FIX THIS
        document.querySelector(".dangerNoteBtnOui").onclick = function() {
            const questionId = document.getElementById('question-text').getAttribute('question-id');
            deleteQuestionAnswers (questionId);
        };
        //NO DON'T DELETE QUESTION             FIX THIS
        document.querySelector(".dangerNoteBtnNon").onclick = function() {
            document.querySelector('.danger').style="display:none;";
        };

        //start button sends information to other page
        document.querySelector(".startBtn").onclick = function() {
          
        };


        itemClone.style.display = 'block';
        questionsDiv.appendChild(itemClone);
    });
  })
  .catch(error => {
    console.error('Error fetching questions: ', error);
  });



//   GET EVENT DETAILS. LEFT SIDEBAR . 
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

function fctApiURLChangeQuestion(questionId) {
    const apiURLChangeQuestion = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question/${questionId}`;
    return apiURLChangeQuestion;
}

function fctApiURLDeleteQuestion(questionId) {
    const apiURLDelQuestion = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`;
    return apiURLDelQuestion;
}

// Example of using the returned value for a PATCH fetch
function changeQuestionAnswers(questionId, eventId, question, answers) {
    console.log("item id at position B : " + questionId);                  //BBBBBB
    const apiURL = fctApiURLChangeQuestion(questionId); // Get the URL from fctApiURLChangeQuestion    
    
    // Data to send in the PATCH request
    const patchData = {
        question_id: questionId, // Replace with your actual key-value pairs
        question_valeur: question, // Replace with your actual key-value pairs
        event_id: eventId, // Replace with your actual key-value pairs
        Reponses: answers, // Replace with your actual key-value pairs
    };
    
    console.log('Payload:', patchData);

    fetch(apiURL, {
        method: 'PATCH',
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
        .then((data) => {
            console.log('PATCH successful:', data);
        })
        .catch((error) => {
            console.error('Error with PATCH request:', error);
        });
}

function deleteQuestionAnswers(questionId) {
    const apiURL = fctApiURLDeleteQuestion(questionId); // Get the URL from fctApiURLChangeQuestion
    
    // Data to send in the PATCH request
    const patchData = {
        question_id: questionId, // Replace with your actual key-value pairs
    };
    
    // console.log('Payload:', patchData);

    fetch(apiURL, {
        method: 'DELETE',
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
        .then((data) => {
            console.log(`Record with ID ${questionId} deleted successfully.`);
        })
        .catch((error) => {
            console.error('Error with delete request:', error);
        });
}

