const API_ENDPOINTS = {
    apiURLGetQuestionsPerEvent: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question?event_id=${eventId}`,
    apiURLGetEventDetails: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/event/${eventId}`,
    apiURLDeleteQuestion: (questionId) =>  `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`,
    apiURLPatchQuestion: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editquestion/${questionId}`,
    apiURLGetQuestionStatus: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/getStatus/${questionId}`,
    apiURLPatchQuestionStatus : (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editQuestionStatus/${questionId}`
};

const STATUT_EVENT = ['Planifié','En direct', 'Archivé', 'Supprimé'];


// FONCTION QUI VA CHERCHER L'INFORMATION MIS EN PARAMÈTRES À PARTIR DE L'URL
function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// CONSTANTES FROM URL
const eventId = getQueryParam('event_id'); //eventId from url
const eventName = getQueryParam('event_titre'); //event title from url

// this is the div holding the title and the start live and end live buttons
const eventInfoElement = document.getElementById('event-titre');

//this is the main div encompassing all the questions
const questionsDiv = document.getElementById('questions'); 

refreshQuestions();

// GET EVENT DETAILS. LEFT SIDEBAR . 
fetch(API_ENDPOINTS.apiURLGetEventDetails(eventId))
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
})
.then (data=>{
    console.log(data);
    const section = document.getElementById('event-information');
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

    titlePage(data.nbrQuestions, data.listOfQuestions, data.statut);
})
.catch(error=>{
    console.error('Error fetching questions: ', error);
});


// FONCTIONS 
// 1. launchQuestion(qid) : Appelé quand le bouton launch de la question est appuyé.  
//      

function renderQuestions(data)
{
    console.log("renderQuestions function data: ", data);  //data = list of questions
    questionsDiv.innerHTML = '';

    data.forEach((item, index) => {
        const itemButton = document.getElementById('question-button-template');
        const itemClone = itemButton.cloneNode(true);  

    //CONSTANTES
        const uniqueId = (index + 1); 
        const questionId = item.id;

    // QUERY SELECTORS
        //1. questionValeur : <div> où la question s'affichera.  
        //2. questionValeurText : <p> où la question s'affichera. Valeur est pris directement de xano
        //4. btnCollapse : <div> de type button qui gère la fonction collapse
        //5. collapseDiv : section qui collapse où on retrouve les réponses possibles
        //6. questionEditBtn : le <button> qui edit les questions
        //7. modalEdit : <div> modal qui ouvre quand le bouton questionEditBtn est appuyé
        //8. questionDeleteBtn : le <button> qui delete les questions
        //9. modalDelete : <div> modal qui ouvre quand le bouton questionDeleteBtn est appuyé
        //10. newAnswerInputField : This is the input field where the new answers dans le format a / b / c ... 
        //11. oldAnswer : this is the answer currently found in xano (before any edits are made)
        //12. btnConfirmEdit : this is the submit button in the modalEdit window
        //13. reponsesString : les reponses tels que retrouvé dans xano
        //14. reponsesValeurDiv : this is the div where the answers go

        const questionValeurDiv = itemClone.querySelector('#question-text-div');
        const questionValeur = itemClone.querySelector('#question-text');

        const buttonCollapse = itemClone.querySelector('.btn');
        const collapseDiv = itemClone.querySelector('.collapse');
        const questionEditBtn = itemClone.querySelector('.btnEdit');
        const modalEdit = itemClone.querySelector('.modal.fade.editMod.modal-lg');
        const questionDeleteBtn = itemClone.querySelector('.btnDelete');
        const modalDelete = itemClone.querySelector('.modal.fade.deleteMod');
        const newAnswerInputField = itemClone.querySelector('#nouvelleReponse');
        const oldAnswer = item.Reponses;
        const btnConfirmEdit = itemClone.querySelector('#soumettreEdit');
        const btnConfirmDelete = itemClone.querySelector('#soumettreDelete');
        const reponsesValeurDiv = itemClone.querySelector('#reponsesPossibles')
        const reponsesString = item.Reponses;
        let answerListItems = reponsesString.split('/').map(item=>item.trim());
        const newListUl = document.createElement('ul');
        const questionSupprimer = itemClone.querySelector('#questionInModal');
        const btnLaunchQuestion = itemClone.querySelector('.Play');
        const btnEndLaunchQuestion = itemClone.querySelector('.Stop');
        const dot = itemClone.querySelector('.dot');
    //SET ATTRIBUTES 
        questionValeurDiv.setAttribute('question-id', questionId);
        buttonCollapse.setAttribute('aria-controls', `collapse${uniqueId}`);  //ex: aria-controls="collapse1"
        buttonCollapse.setAttribute('data-bs-target', `#collapse${uniqueId}`);  //ex: data-bs-target="#collapse1"
        collapseDiv.setAttribute('id', `collapse${uniqueId}`); //ex: id = "collapse1"
        questionEditBtn.setAttribute('data-bs-target', `#editQuestion${uniqueId}`); //ex: data-bs-target= "#editQuestion1"
        questionDeleteBtn.setAttribute('data-bs-target', `#deleteQuestion${uniqueId}`); //ex: data-bs-target= "#deleteQuestion1"
        modalEdit.setAttribute('id', `editQuestion${uniqueId}`); //ex: id = "editQuestion1"
        modalDelete.setAttribute('id', `deleteQuestion${uniqueId}`);  //ex: id = "deleteQuestion1"
        newAnswerInputField.setAttribute('value',oldAnswer); //put the old answer in the answer input field (in case we want to keep the old answers)
    
    //INNERTEXT & TEXTCONTENT
        questionValeur.innerText = item.question_valeur; //DISPLAY QUESTION INSIDE EACH QUESTION BUTTON
        questionSupprimer.textContent = item.question_valeur; //DISPLAY QUESTION IN DELETE MODAL WINDOW

    //DISPLAY ANSWERS 
        reponsesValeurDiv.replaceChildren();
        for(let i =0; i<answerListItems.length;i++)
        {
            const newListItem = document.createElement('li'); // Create a new <li> for each item
            newListItem.classList.add("reponsesPossiblesItem"); // Add the class
            const newDot = document.createElement('div');
            newDot.classList.add('smallerDot');
            newListItem.innerHTML=`<div class="smallerDot"></div>${answerListItems[i]} `
            newListUl.appendChild(newListItem); // Append the new <li> to the <ul>
        }
        reponsesValeurDiv.appendChild(newListUl);
    
    //ONCLICK
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
        
        btnLaunchQuestion.addEventListener('click', () => {
            launchQuestion(btnLaunchQuestion, btnEndLaunchQuestion);
            editQuestionStatus(questionId,'Live');
            dot.style.backgroundColor='red';
        });

        btnEndLaunchQuestion.addEventListener('click', () => {
            endLaunchQuestion(btnLaunchQuestion, btnEndLaunchQuestion);
            editQuestionStatus(questionId,'Launched');
            dot.style.backgroundColor='black';
        });

        itemClone.style.display = 'block';
        questionsDiv.appendChild(itemClone);
    });
}

function launchQuestion(btnLaunchQuestion, btnEndLaunchQuestion){
    if (btnLaunchQuestion && btnEndLaunchQuestion) {
        btnLaunchQuestion.disabled = true;
        btnEndLaunchQuestion.disabled = false;
        document.querySelector('.dot').style="background-color:red;"

    } else {
        console.error("One or both buttons are not valid elements.");
    }
}

function endLaunchQuestion(btnLaunchQuestion, btnEndLaunchQuestion){
    if (btnLaunchQuestion && btnEndLaunchQuestion) {
        btnLaunchQuestion.disabled = true;
        btnEndLaunchQuestion.disabled = true;
    } else {
        console.error("One or both buttons are not valid elements.");
    }
}

// DELETE 
function deleteQuestion(qid, questionDiv) {

    const deleteData = {
        questionId : qid, // Replace with your actual key-value pairs
    };

 
    fetch(API_ENDPOINTS.apiURLDeleteQuestion(qid), {
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
                console.log("Call refreshQuestions");
                refreshQuestions();
                

            })
            .catch((error) => {
                console.error('Error with delete request:', error);
            });
}

// PATCH
function editQuestion(qid, eventId) {
    const modal = document.querySelector('.modal.fade.editMod.modal-lg'); // Get the currently open modal
    const newQuestionValue = modal.querySelector('#nouvelleQuestion').value; // Input for the updated question
    const newAnswerValue = modal.querySelector('#nouvelleReponse').value; // Input for the updated answers
    const submitButton = modal.querySelector('#soumettreEdit');
    const alertPop = document.querySelector('.alert.alert-success');
    const patchData = {
        question_id: qid,
        question_valeur: newQuestionValue,
        event_id: eventId,
        Reponses: newAnswerValue
    };

    console.log("Patch data being sent:", patchData);

    fetch(API_ENDPOINTS.apiURLPatchQuestion(qid), {
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
        alert("Votre question a été changé avec succès");
        refreshQuestions();
    })
    .catch((error) => {
        console.error('Error with edit request:', error);
    });
}

function editQuestionStatus(qid,status) {
    const patchData = {
        question_id: qid,
        launch_status : status
    };

    console.log("Patch data being sent:", patchData);

    fetch(API_ENDPOINTS.apiURLPatchQuestionStatus(qid), {
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
        console.log(`Change question ${qid} status with ${status}`);
        if(status==='Live'){
            setTimeout(function(){
                alert(`La question ${qid} est live`);
            },1000);
        }
    })
    .catch((error) => {
        console.error('Error with edit request:', error);
    });
}

function refreshQuestions() {    
    fetch(API_ENDPOINTS.apiURLGetQuestionsPerEvent(eventId))
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Questions being refreshed");
            console.log("Fetched data: ", data); 
            renderQuestions(data);
            console.log("Questions successfully refreshed");
        })
        .catch(error => {
            console.error('Error fetching questions: ', error);
        });
}

function showAlert() {
    var alertBox = document.getElementById("customAlert");
    alertBox.style.display = "block";

    // Hide the alert after 3 seconds
    setTimeout(function() {
        alertBox.style.display = "none";
    }, 3000);
}

function toggleClass(element, className, shouldAdd) {
    if (shouldAdd) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

function titlePage(nbrQuestions, list, statutEvent){
    // SI L'ÉVÉNEMENT N'A PAS DE QUESITON (AUCUN DES DEUX DONNÉES SONT NULL)
    // AFFICHER LE TITRE ET MODIFIER LE STYLE 
    // SINON AFFICHER MESSAGE QU'IL N'Y A PAS DE DONNÉES DISPONIBLES
    // id de eventInfoElement : 'event-titre'
    if (nbrQuestions > 0 && list[0] !== "") {
        eventInfoElement.style = `text-align:center;`;
        eventInfoElement.innerHTML = `
                                        ${eventName} 
                                        <div style="width: 100vw;">
                                            <div style="display: flex; justify-content: center; align-items: center;">
                                                <button style="border:none; background-color:rgba(0, 0, 0, 0)"id="startBtn" class="btnPlayStop">
                                                    <i class ="bi bi-play-fill playEvent">START LIVE</i>
                                                </button>
                                                <button style="border:none; background-color:rgba(0, 0, 0, 0)" id="stopBtn" class="btnPlayStop">
                                                    <i class="bi bi-stop-fill stopEvent" id="stopEvent">STOP LIVE</i>
                                                </button>
                                            </div>
                                        </div>`;
    } else { 
        eventInfoElement.style = `text-align:center; font-size:5rem`;
        eventInfoElement.innerText= `Aucune question assigné.`;
    }

    if(statutEvent == STATUT_EVENT[0]){
        toggleClass(stopBtn, 'disabled', true);
        console.log("successfully disabled stop");
    }
    else if(statutEvent == STATUT_EVENT[1]){
        toggleClass(stopBtn, 'disabled', false);
        toggleClass(startBtn, 'disabled', true);
        console.log("successfully disabled start and enabled stop");
    }
    else{
        toggleClass(startBtn, 'disabled', true);
        toggleClass(stopBtn, 'disabled', true);
        console.log("successfully disabled both");
    }
   
}