// FONCTION QUI VA CHERCHER L'INFORMATION MIS EN PARAMÈTRES À PARTIR DE L'URL
function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// CONSTANTES
const eventId = getQueryParam('event_id');
const eventName = getQueryParam('event_titre');
const eventInfoElement = document.getElementById('event-titre');
const questionsDiv = document.getElementById('questions');

function renderQuestions(data) {
    questionsDiv.innerHTML = '';
    
    // SI L'ÉVÉNEMENT N'A PAS DE QUESITON (AUCUN DES DEUX DONNÉES SONT NULL), AFFICHER LE TITRE ET MODIFIER LE STYLE 
    if (data.length > 0 && data[0] !== "") {
        eventInfoElement.style = `text-align:center;`;
        eventInfoElement.textContent = `${eventName}`;
        

    } else { // SINON AFFICHER MESSAGE QU'IL N'Y A PAS DE DONNÉES DISPONIBLES
        eventInfoElement.style = `text-align:center; font-size:5rem`;
        eventInfoElement.innerText= `Aucune question assigné.`;
    }


    data.forEach((item, index) => {
        const itemButton = document.getElementById('question-button');
        const itemClone = itemButton.cloneNode(true);  
        
        //CONSTANTES
        const questionId = item.id;
        const uniqueId = (index + 1);  
        const button = itemClone.querySelector('.btn');
        const content = itemClone.querySelector('.collapse');
        const btnDelete = itemClone.querySelector('.btnDelete');
        const btnEdit = itemClone.querySelector('.btnEdit');
        const modalDelete = itemClone.querySelector('.modal.fade.deleteMod');
        const modalEdit = itemClone.querySelector('.modal.fade.editMod.modal-lg');
        const btnConfirmDelete = itemClone.querySelector('#confirmDelete');
        const newAnswerInputField = itemClone.querySelector('#nouvelleReponse');
        const oldAnswer = item.Reponses;
        const btnConfirmEdit = itemClone.querySelector('#confirmEdit');

        //SET ATTRIBUTES 
        button.setAttribute('aria-controls', uniqueId); 
        button.setAttribute('data-bs-target', `#${uniqueId}`); 
        content.setAttribute('id', uniqueId); //CHANGE ID OF COLLAPSEDDIV
        itemClone.querySelector('#question-text').setAttribute('question-id', questionId);
        btnDelete.setAttribute('data-bs-target', `#delete${uniqueId}`); 
        modalDelete.setAttribute('id', `delete${uniqueId}`);
        btnEdit.setAttribute('data-bs-target', `#edit${uniqueId}`); 
        modalEdit.setAttribute('id', `edit${uniqueId}`);
        newAnswerInputField.setAttribute('value',oldAnswer);


        //ulElement = div for each answer
        //DISPLAY ANSWERS 
        itemClone.querySelector('#reponsesPossibles').replaceChildren();
        const answerString = item.Reponses;
        let answerListItems = answerString.split('/').map(item=>item.trim());
        const newListUl = document.createElement('ul');
        for(let i =0; i<answerListItems.length;i++)
        {
            const newListItem = document.createElement('li'); // Create a new <li> for each item
            newListItem.classList.add("reponsesPossiblesItem"); // Add the class
            const newDot = document.createElement('div');
            newDot.classList.add('smallerDot');
            newListItem.innerHTML=`<div class="smallerDot"></div>${answerListItems[i]} `
            newListUl.appendChild(newListItem); // Append the new <li> to the <ul>
        }
        itemClone.querySelector('#reponsesPossibles').appendChild(newListUl);
        


        //DISPLAY QUESTIONS
        itemClone.querySelector('#test').textContent = item.question_valeur;


        //DISPLAY QUESTION IN DELETE MODAL WINDOW
        itemClone.querySelector('#questionInModal').textContent = item.question_valeur;


        // DELETE QUESTION
        btnConfirmDelete.setAttribute(
            'onclick',
            `deleteQuestion('${questionId}', this.closest('.question-div'))`
        );
        
        // EDIT QUESTION;
        btnConfirmEdit.setAttribute(
            'onclick',
            `editQuestion('${questionId}','${eventId}')`

        );

        

        // SEND QUESTION --> CHANGE THE PARAMETERS! I JUST COPIED IT FROM THE EDITQUESTION FUNCTION
        // btnConfirmLaunch.setAttribute(
        //     'onclick',
        //     `sendQuestion('${questionId}','${eventId}')`
        // );

        // btnGoLive.setAttribute(
        //     'onclick',
        //     `eventLive('${eventId}')`
        // );

        itemClone.style.display = 'block';
        questionsDiv.appendChild(itemClone);
    });
}



function refreshQuestions() {
    const apiURLQuestionsPerEvent = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question?event_id=${eventId}`;
    
    fetch(apiURLQuestionsPerEvent)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched data: ", data); 
        renderQuestions(data);
    })
    .catch(error => {
        console.error('Error fetching questions: ', error);
      });
}

refreshQuestions();


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
    const btnConfirmLaunch = document.getElementById('launchEvent');

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
    // const eventStatus = data.statut;
    // if(eventStatus === "Planifié"){
    //     btnConfirmLaunch.innerText = "Go live";
    // }
    // else if (eventStatus === "En direct"){
    //     btnConfirmLaunch.innerText = "End live";
    // }
    // else{
    //     btnConfirmLaunch.disabled = true;
    // }
})
.catch(error=>{
    console.error('Error fetching questions: ', error);
});


function fctApiURLDeleteQuestion(questionId) {
    const apiURLDeleteQuestion = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`;
    return apiURLDeleteQuestion;
}

function fctApiURLEditQuestion(questionId) {
    const apiURLDeleteQuestion = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editquestion/${questionId}`;
    return apiURLDeleteQuestion;
}

// function fctApiURLEventLive(eventId) {
//     const apiURL = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/statutEnDirect/${eventId}`;
//     return apiURL;
// }


// DELETE 
function deleteQuestion(qid, questionDiv) {
    const apiURL = fctApiURLDeleteQuestion(qid); 
    
    const deleteData = {
        questionId : qid, // Replace with your actual key-value pairs
    };

 
    fetch(apiURL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(() => {
                // Remove the corresponding div from the DOM
                if (questionDiv) {
                    questionDiv.remove();
                    console.log(`Removed div for question ID ${qid}`);
                }
                // Close the modal programmatically
                const modal = document.querySelector('.modal.show'); // Select the currently open modal
                if (modal) {
                    const bootstrapModal = bootstrap.Modal.getInstance(modal); // Get the Bootstrap modal instance
                    bootstrapModal.hide(); // Close the modal
                }
                console.log(`Record with ID ${qid} deleted successfully.`);

                refreshQuestions();
            })
            .catch((error) => {
                console.error('Error with delete request:', error);
            });
}


// PATCH
function editQuestion(qid, eventId) {
    const modal = document.querySelector('.modal.fade.editMod.modal-lg'); // Get the currently open modal
    const newQuestionInputField = modal.querySelector('#nouvelleQuestion'); // Input for the updated question
    const newAnswerInputField = modal.querySelector('#nouvelleReponse'); // Input for the updated answers

    const questionVal = newQuestionInputField.value; // Get updated question value
    const answers = newAnswerInputField.value; // Get updated answers

    const apiURL = fctApiURLEditQuestion(qid); 
    
    const patchData = {
        question_id : qid, // Replace with your actual key-value pairs
        question_valeur : questionVal,
        event_id : eventId,
        Reponses : answers
    };

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
        .then(() => {
            console.log(`Edited question ID ${qid} with values:`, patchData);
            
            // if (modal) {
            //     const bootstrapModal = bootstrap.Modal.getInstance(modal);
            //     if (bootstrapModal) {
            //         bootstrapModal.hide();
            //     }
            // } else {
            //     console.error('No modal is currently open.');
            // }
            refreshQuestions();
        })
        .catch((error) => {
            console.error('Error with edit request:', error);
        });
}