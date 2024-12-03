const API_ENDPOINTS = {
    apiURLGetQuestionsPerEvent: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question?event_id=${eventId}`,
    apiURLGetEventDetails: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/event/${eventId}`,
    apiURLDeleteQuestion: (questionId) =>  `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`,
    apiURLPatchQuestion: (question_id) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editquestion/${question_id}`,
    apiURLGetQuestionStatus: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/getStatus/${questionId}`,
    apiURLPatchQuestionStatus : (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editQuestionStatus/${questionId}`,
    apiURLPatchEventStatus : (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editEventStatus/${eventId}`
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

    titlePage(data.nbrQuestions, data.listOfQuestions, data.id);
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
        console.log('item', item, ' item status', item.launch_status);
        const itemButton = document.getElementById('question-button-template');
        const itemClone = itemButton.cloneNode(true);  
    //CONSTANTES
        const uniqueId = (index + 1); 
        const questionId = item.id;

        const questionValeurDiv = itemClone.querySelector('#question-text-div');
        const questionValeur = itemClone.querySelector('#question-text');
        const buttonCollapse = itemClone.querySelector('.btn');
        const collapseDiv = itemClone.querySelector('.collapse');
        const questionDeleteBtn = itemClone.querySelector('.btnDelete');
        const modalDelete = itemClone.querySelector('.modal.fade.deleteMod');
        const btnConfirmDelete = itemClone.querySelector('#soumettreDelete');
        const reponsesValeurDiv = itemClone.querySelector('#reponsesPossibles')
        const reponsesString = item.Reponses;
        let answerListItems = reponsesString.split('/').map(item=>item.trim());
        const newListUl = document.createElement('ul');
        const questionSupprimer = itemClone.querySelector('#questionInModal');
        const btnLaunchQuestion = itemClone.querySelector('.Play');
        const btnEndLaunchQuestion = itemClone.querySelector('.Stop');
        
       // console.log(itemClone.querySelector('#offcanvas-body-div').innerText);

        //SET ATTRIBUTES 
        questionValeurDiv.setAttribute('question-id', questionId);
        buttonCollapse.setAttribute('aria-controls', `collapse${uniqueId}`);  //ex: aria-controls="collapse1"
        buttonCollapse.setAttribute('data-bs-target', `#collapse${uniqueId}`);  //ex: data-bs-target="#collapse1"
        collapseDiv.setAttribute('id', `collapse${uniqueId}`); //ex: id = "collapse1"
        questionDeleteBtn.setAttribute('data-bs-target', `#deleteQuestion${uniqueId}`); //ex: data-bs-target= "#deleteQuestion1"
        
        modalDelete.setAttribute('id', `deleteQuestion${uniqueId}`);  //ex: id = "deleteQuestion1"
        questionValeurDiv.setAttribute('status', item.launch_status);
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
    
    const editBtn = itemClone.querySelector('#toggleButton');

    itemClone.querySelector('.offcanvasEdit').setAttribute('id',`offcanvasEdit${uniqueId}`);
    //ONCLICK
        // DELETE QUESTION
        btnConfirmDelete.setAttribute(
            'onclick',
            `deleteQuestion('${questionId}', this.closest('.question-div'))`
        );

        // editBtn.setAttribute(
        //     'onclick',
        //     `openOffCanvas("${questionValeur.innerHTML}", this.closest('#question-button-template'))`
        // );
        editBtn.setAttribute(
            'onclick',
            `openOffCanvas("${questionValeur.innerHTML}", "offcanvasEdit${uniqueId}", this.closest('#question-button-template'))`
        );
        
        
        btnLaunchQuestion.addEventListener('click', () => {
            launchQuestion(btnLaunchQuestion, btnEndLaunchQuestion);
            editQuestionStatus(questionId,'Live');
        });

        btnEndLaunchQuestion.addEventListener('click', () => {
            endLaunchQuestion(btnLaunchQuestion, btnEndLaunchQuestion);
            editQuestionStatus(questionId,'Launched');
        });

        itemClone.style.display = 'block';
        questionsDiv.appendChild(itemClone);
    });
}

function launchQuestion(btnLaunchQuestion, btnEndLaunchQuestion){
    if (btnLaunchQuestion && btnEndLaunchQuestion) {
        btnLaunchQuestion.disabled = true;
        btnEndLaunchQuestion.disabled = false;

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
            document.querySelector('#question-text-div').style.backgroundColor='red';
        }
        if(status==='Launched'){
            setTimeout(function(){
                alert(`La question ${qid} n'est plus live`);
            },1000);
            document.querySelector('#question-text-div').style.backgroundColor='grey';
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
            if(data.launch_status==='Live'){
                document.querySelector('.question-text-div').style.backgroundColor = 'red';
            }
            else if(data.launch_status==='Launched'){
                document.querySelector('.question-text-div').style.backgroundColor = 'grey';
            }
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
function editEventStatus(eid,status) {
    const patchData = {
        eventStatus: status,
        event_id : eid
    };

    console.log("Patch data being sent:", patchData);

    fetch(API_ENDPOINTS.apiURLPatchEventStatus(eid), {
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
        console.log(`Change event status to ${status}`);
        if(status==='Live'){
            setTimeout(function(){
                alert(`L'événement a commencé`);
            },1000);
        }
        if(status==='Launched'){
            setTimeout(function(){
                alert(`L'événement est terminé`);
            },1000);
        }
    })
    .catch((error) => {
        console.error('Error with edit request:', error);
    });
}
function titlePage(nbrQuestions, list,eid){
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
                                                <button style="border:none; background-color:rgba(0, 0, 0, 0)"id="startBtn" class="btnPlayStop ">
                                                    <i class ="bi bi-play-fill playEvent">START LIVE</i>
                                                </button>
                                                <button style="border:none; background-color:rgba(0, 0, 0, 0)" id="stopBtn" class="btnPlayStop disabled">
                                                    <i class="bi bi-stop-fill stopEvent" id="stopEvent">STOP LIVE</i>
                                                </button>
                                            </div>
                                        </div>`;
    } else { 
        eventInfoElement.style = `text-align:center; font-size:5rem`;
        eventInfoElement.innerText= `Aucune question assigné.`;
    }
    const start = document.getElementById('startBtn');
    const stop = document.getElementById('stopBtn');

    start.addEventListener('click', () => {
        stop.classList.remove('disabled');
        start.classList.add('disabled');
        editEventStatus(eid, 'En direct');
    });

    stop.addEventListener('click', () => {
        stop.classList.add('disabled');
        start.classList.remove('disabled');
        editEventStatus(eid, 'Archivé');
    });
}

// function openOffCanvas(questionOG, item){
//     document.getElementById('offcanvasEdit').classList.add('open');
//     document.getElementById('oldquestion').innerText = questionOG;
//     const submit = item.querySelector('#submitBtn');
//     submit.setAttribute(
//         'onclick',
//         `editQuestion(this.closest('#question-button-template'))`
//     );
//     console.log(item.innerHTML);
// }

function openOffCanvas(questionOG, offCanvasId, item) {
    // console.log(item.innerHTML);
    const offCanvas = document.getElementById(offCanvasId);
    if (!offCanvas) {
        console.error(`Offcanvas with ID ${offCanvasId} not found.`);
        return;
    }
    offCanvas.classList.add('open');
    offCanvas.querySelector('#oldquestion').innerText = questionOG;

    const submit = item.querySelector(`#${offCanvasId} #submitBtn`);
    submit.setAttribute(
        'onclick',
        `editQuestion(this.closest('#question-button-template'),${offCanvasId})`
    );
    console.log(item.innerHTML);
}


function editQuestion(item,offCanvasId){
    console.log(offCanvasId.id);
    console.log(offCanvasId);
    // console.log('in editQuestion: ',item.innerHTML);
    const newQ = item.querySelector('#newQuestion').value;
    const newA = item.querySelector('#newAnswer').value;
    const qidElem = item.querySelector('#question-text-div');
    const qid = qidElem.getAttribute('question-id');
    // console.log(qid.getAttribute('question-id'));
    const patchData = {
        question_id: qid,
        question_valeur : newQ,
        event_id : eventId,
        Reponses : newA
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
        console.log('questions have been edited');
        refreshQuestions();
    })
    .catch((error) => {
        console.error('Error with edit request:', error);
    });
}
