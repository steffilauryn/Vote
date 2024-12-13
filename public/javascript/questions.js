const API_ENDPOINTS = {
    apiURLGetQuestionsPerEvent: (eventId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/question?event_id=${eventId}`,

    apiURLGetEventDetails: (eventId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/event/${eventId}`, //USED FOR TITLE AND EVENT DETAILS BOX BELOW

    apiURLDeleteQuestion: (questionId) =>  `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`,  //USED 

    apiURLPatchQuestion: (question_id) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/editquestion/${question_id}`,//USED

    
    apiURLGetQuestionStatus: (questionId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/getStatus/${questionId}`,

    apiURLPatchStatus : () => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/editStatus`,

    apiURLGetQuestionVoters : (questionId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:x_2QV0_G/voteur_question?question_id=${questionId}`,

    apiURLAddQuestion : () => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/question`
};

const STATUT_EVENT = ['Planifié','En direct', 'Archivé', 'Supprimé'];

// FONCTION QUI VA CHERCHER L'INFORMATION MIS EN PARAMÈTRES À PARTIR DE L'URL
// function getQueryParam (name){
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(name);
// }
const params = new URLSearchParams(window.location.search);
// CONSTANTES FROM URL
const eventId = params.get('event_id'); //eventId from url
const eventName = params.get('event_titre'); //event title from url
console.log ("eventId = ", eventId);
console.log ("eventName = ", eventName);
// this is the div holding the title and the start live and end live buttons
const eventInfoElement = document.getElementById('event-titre');

//this is the main div encompassing all the questions
const questionsDiv = document.getElementById('questions'); 
const tableQA = document.getElementById('tableResults');
refreshQuestions();



// FONCTIONS 
// 1. launchQuestion(qid) : Appelé quand le bouton launch de la question est appuyé.  
//      

function renderQuestions(data)
{
    //console.log(data.length); = 5
    console.log("renderQuestions function data: ", data);  //data = list of questions
    questionsDiv.innerHTML = '';
    tableQA.innerHTML=`<tr>
                  <td>Question</td>
                  <td>Nombre de voteurs</td>
                  <td>Vote majoritaire</td>
                  <td>Repartition des votes</td>
              </tr>`;
    data.forEach((item, index) => {
        console.log('item', item, ' item status', item.launch_status);
        const itemButton = document.getElementById('question-button-template');
        const itemClone = itemButton.cloneNode(true); 
        const itemTableRow = document.getElementById('table-row-template'); 
        console.log(document.getElementById('table-row-template'))

        const itemTableClone = itemTableRow.cloneNode(true);
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
        if (questionValeurDiv) {
            console.log('questionValeurDiv exists');
            if (item.launch_status === 'Live') {
                questionValeurDiv.style.backgroundColor = 'var(--stopLightRed)';
            } else if (item.launch_status === 'Launched') {
                questionValeurDiv.style.backgroundColor = 'grey';
            } else {
                questionValeurDiv.style.backgroundColor = 'white';
            }
        } else {
            console.error('No #question-text-div found in the cloned element!');
        }
        

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
    

    //Table Rows
        const questionTD1 = itemTableClone.querySelector('.question-valeur');
        questionTD1.innerText = item.question_valeur;
        const questionTD2 = itemTableClone.querySelector('.nombre-voteurs');
        const questionTD3 = itemTableClone.querySelector('.reponseMaj');
        const questionTD4 = itemTableClone.querySelector('.allVotes');
        tableResults(item.id, answerListItems,questionTD2, questionTD3,questionTD4);
        itemTableClone.style.display = 'table-row';
        tableQA.appendChild(itemTableClone);


    const editBtn = itemClone.querySelector('#toggleButton');
    itemClone.querySelector('.offcanvasEdit').setAttribute('id',`offcanvasEdit${uniqueId}`);
    itemClone.querySelector('.offcanvasEdit').setAttribute('id',`offcanvasEdit${uniqueId}`);
    //ONCLICK
        // DELETE QUESTION
        btnConfirmDelete.setAttribute(
            'onclick',
            `deleteQuestion('${questionId}', this.closest('.question-div'))`
        );

        editBtn.setAttribute(
            'onclick',
            `openOffCanvas("${questionValeur.innerHTML}", "offcanvasEdit${uniqueId}", this.closest('#question-button-template'))`
        );

        btnLaunchQuestion.addEventListener('click', () => {
            launchQuestion(btnLaunchQuestion, btnEndLaunchQuestion);
            //editQuestionStatus(questionId,'Live');
            editStatus(null, questionId, null, 'Live', questionValeurDiv);
        });

        btnLaunchQuestion.addEventListener('click', () => {
            launchQuestion(btnLaunchQuestion, btnEndLaunchQuestion);
            //editQuestionStatus(questionId,'Live');
            editStatus(null, questionId, null, 'Live', questionValeurDiv);
        });

        btnEndLaunchQuestion.addEventListener('click', () => {
            endLaunchQuestion(btnLaunchQuestion, btnEndLaunchQuestion);
            //editQuestionStatus(questionId,'Launched');
            editStatus(null, questionId, null, 'Launched', questionValeurDiv);
        });

        itemClone.style.display = 'block';
        questionsDiv.appendChild(itemClone);
    });

}


function tableResults(questionId, answerList,questionTD2,questionTD3, questionTD4){
    fetch(API_ENDPOINTS.apiURLGetQuestionVoters(questionId))
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
           console.log('tableresullts data:', data);
           console.log('questionid : ',questionId);

           const nbrDeVoteurs = data.length;
           let arrayGivenAnswers = [];
           data.forEach(question => {
            arrayGivenAnswers.push(question.reponse);
           })
           console.log('arrayGivenAnswers : ',arrayGivenAnswers); //array of user given answers 


           const obj={nombre_de_voteurs:nbrDeVoteurs};
           answerList.forEach(item=>{
                obj[item] = 0; 
           });
          
           //The obj list we start with; key value pairs of answer:number of votes
           console.log('obj : ',obj); 

           for(i=0; i<answerList.length;i++){
                const occurences = arrayGivenAnswers.filter(function (answer){
                    return answer === answerList[i];
                }).length;
                const occPourcentages = occurences / nbrDeVoteurs * 100;
                obj[answerList[i]]=occPourcentages.toFixed(2);
           }
           console.log('obj after occurences added: ',obj); 

           questionTD2.innerText=nbrDeVoteurs;
           
           objKeysArray = Object.getOwnPropertyNames(obj);
           objKeysArray.shift();
           console.log('objKeysArray',objKeysArray);
            let maj = obj[objKeysArray[0]];
            let majKey = objKeysArray[0];
            let tiesTemp = [majKey];
            console.log('tiesTemp before: ',tiesTemp)
            for (let i = 1; i < objKeysArray.length; i++) {
                    if(obj[objKeysArray[i]]>maj){
                        maj = obj[objKeysArray[i]];
                        majKey = objKeysArray[i];
                        tiesTemp = [];
                        console.log('If true -> maj = ',tiesTemp, ' / majKey = ', majKey, ' / tiesTemp =',tiesTemp)
                    }
                    else if(maj===obj[objKeysArray[i]]){
                        tiesTemp.push(objKeysArray[i]);
                    }
                
            }
            if(nbrDeVoteurs===0){
                majKey='-';
                tiesTemp=[];
            }
            console.log ('is it equal to -' ,majKey);
            console.log('tiesTemp after: ',tiesTemp);
            
            if (tiesTemp.length > 0){
                console.log('majKey when tiesTemp is not empty: ',majKey);
                questionTD3.innerHTML=tiesTemp.join('<br>');
            }
            else{
                console.log('majKey when tiesTemp is empty: ',majKey);
                
                if (isNaN(majKey)){
                    questionTD3.innerText='-';
                }else(questionTD3.innerText=majKey);
            }

            delete obj['nombre_de_voteurs'];
            let sortedObject = Object.fromEntries(
                Object.entries(obj).sort(([, a], [, b]) => a - b)
            );
            console.log('sortedObject: ',sortedObject);
            let txt = "";
            for (let x in sortedObject) {
                let value = sortedObject[x];
                if(isNaN(value)){
                    txt += x + ' : ---' + `<br>`;
                }
                else{
                    txt += x + ' : ' + value + `<br>`;
                }
                
            }

            
            questionTD4.innerHTML = txt;
        })
        .catch(error => {
            console.error('Error fetching questions: ', error);
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
    eventDetails(data);
})
.catch(error=>{
    console.error('Error fetching event details in apiURLGetEventDetails: ', error);
});

function showAlert() {
    var alertBox = document.getElementById("customAlert");
    alertBox.style.display = "block";

    // Hide the alert after 3 seconds
    setTimeout(function() {
        alertBox.style.display = "none";
    }, 3000);
}

function editStatus(eid, qid, eventStatus,questionStatus){
    const patchData = {
        statusEvent: eventStatus,
        event_id: eid,
        question_id: qid,
        statusQuestion: questionStatus
    };
    console.log("Patch data being sent:", patchData);

    fetch(API_ENDPOINTS.apiURLPatchStatus(), {
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
        if(eid===null && eventStatus===null){
            console.log(`Change question ${qid} status with ${questionStatus}`);
           
            if(questionStatus==='Live'){
                setTimeout(function(){
                    alert(`La question ${qid} est live`);
                },500);
            }
            if(questionStatus==='Launched'){
                setTimeout(function(){
                    alert(`La question ${qid} n'est plus live`);
                },500);
            }
        }
        else if(qid===null && questionStatus===null){
            console.log(`Change event ${eid} status with ${eventStatus}`);
            if(eventStatus==='En direct'){
                setTimeout(function(){
                    alert(`L'evenement est en direct`);
                },1000);
            }
            if(eventStatus==='Archivé'){
                setTimeout(function(){
                    alert(`L'evenement n'est plus en direct`);
                },1000);
            }
        }
        
    })
    .catch((error) => {
        console.error('Error with edit request:', error);
    });
}

function titlePage(nbrQuestions, list,eid,formattedStart,formattedEnd){
    if (nbrQuestions > 0 && list[0] !== "") {
        eventInfoElement.style = `text-align:center;`;
        eventInfoElement.innerHTML = `
                                        <h1>${eventName}</h1> 
                                        <p style="display: flex;justify-content: center;"id="eventDate"><b>Début: ${formattedStart} <br> Fin: ${formattedEnd}</b></p> 
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
        editStatus(eid, null, 'En direct',null);
    });

    stop.addEventListener('click', () => {
        stop.classList.add('disabled');
        start.classList.remove('disabled');
        editStatus(eid, null, 'Archivé',null);
    });

    console.log(eventInfoElement.innerHTML);
}

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
    const close = item.querySelector(`#${offCanvasId} #offCanvasClose`);
    submit.setAttribute(
        'onclick',
        `editQuestion(this.closest('#question-button-template'),${offCanvasId})`
    );

    close.addEventListener('click', () => {
        offCanvas.classList.remove('open');
        console.log(offCanvas.classList);
    });
    
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

function eventDetails(data){
    console.log (data);
    const section = document.getElementById('event-information');
    // section.querySelector('#eventDescription').textContent=data.description;
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
    titlePage(data.nbrQuestions, data.listOfQuestions, data.id, formattedStart, formattedEnd);
   
    if(data.client){
        const clientLogoURL = data.client.logo.url;
        
         // Set client logo
         const clientLogoElement = section.querySelector('#eventImg');
         if (clientLogoElement) {
             clientLogoElement.src = clientLogoURL;
         }
    }

    
}

document.getElementById('triggerAdd').addEventListener('click', () => {
    const target = document.getElementById('target');
    target.classList.add('active'); // Add or remove the class
});

document.getElementById('addQuestion').addEventListener('click', () => {
   addQuestions();
});

document.getElementById('annulerAjout').addEventListener('click',()=>{
    target.classList.remove('active');
});

function addQuestions(){

    const question = document.getElementById('one').value;
    const reponse = document.getElementById('two').value;

    const postData = {
        question_valeur: question,
        event_id : eventId,
        Reponses : reponse,
        launch_status : 'Idle'
    };
    console.log ('postData being sent : ', postData);
    fetch(API_ENDPOINTS.apiURLAddQuestion(),{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Question was added");
            refreshQuestions();
        })
        .catch(error => {
            console.error('Error fetching questions: ', error);
        });
}