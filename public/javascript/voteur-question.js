const API_ENDPOINTS = {
    apiURLGetQuestionsPerEvent: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question?event_id=${eventId}`,
    apiURLGetEventDetails: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/event/${eventId}`,
    apiURLDeleteQuestion: (questionId) =>  `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`,
    apiURLPatchQuestion: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editquestion/${questionId}`,
    apiURLGetQuestionStatus: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/getStatus/${questionId}`,
    apiURLPatchQuestionStatus : (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editQuestionStatus/${questionId}`,
    apiURLGetQuestionDetails : (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question/${questionId}`,
    apiURLPostVoteurQuestion : () => `https://x8ki-letl-twmt.n7.xano.io/api:x_2QV0_G/voteur_question`
};



// FONCTION QUI VA CHERCHER L'INFORMATION MIS EN PARAMÈTRES À PARTIR DE L'URL
function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// CONSTANTES FROM URL
const questionId = getQueryParam('question_id'); //eventId from url
const voterId = getQueryParam ('vid');

async function getClientId(eid) {
    try {
        const response = await fetch(API_ENDPOINTS.apiURLGetEventDetails(eid));
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data.client_id; // This will return a resolved value
    } catch (error) {
        console.error('Error fetching client ID:', error);
        throw error; // Re-throw the error if needed
    }
}


fetch(API_ENDPOINTS.apiURLGetQuestionDetails(questionId))
.then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    console.log(data);
    document.getElementById('questionDiv').innerText=data.question_valeur;
    const parentDiv = document.getElementById('parent');
    let answerListItems = data.Reponses.split('/').map(item=>item.trim());
    const nbrQuestions = answerListItems.length;
    var x = document.querySelector('.main-container');
    const exitClicked = document.getElementById('close');
    const submitClicked = document.getElementById('submit');

    answerListItems.forEach((item, index) => {
        const newDiv = document.createElement('div'); // Create a new <div> element
        newDiv.id = index+1;
        newDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.527)';
        newDiv.style.display='flex'
        newDiv.style.flex = '1';
        newDiv.style.justifyContent = 'center';
        newDiv.style.alignItems = 'center';
        newDiv.style.fontSize= '2rem';
        newDiv.textContent = item; 
        newDiv.classList.add('answerBtn');
        newDiv.setAttribute('type', 'button');
        parentDiv.appendChild(newDiv); 
    });

    for (let i = 1; i <= nbrQuestions; i++) {
        const divClicked = document.getElementById(i);
        
        if (divClicked) { // Ensure the element exists
            divClicked.addEventListener('click', () => {
                const slide = document.getElementById('modalWindowBox');
                const slideTitle = document.getElementById('modalWindowTitle');
                slideTitle.textContent = data.question_valeur;
                document.getElementById('answer').setAttribute('value',divClicked.innerText);
                
                x.classList.add('blur');
                slide.classList.add('active');
            });
        }
    }
    
    exitClicked.addEventListener('click', () => {
        const slide = document.getElementById('modalWindowBox');
        slide.classList.remove('active');
        x.classList.remove('blur');    
    });

    submitClicked.addEventListener('click', () => {
        //send qid, send answer chosen, send voterid, send eventid
        submitClicked.disabled = true;
        alert('votre reponse a bel et bien été enregistré. veuillez patienter');
        refreshStatus(questionId, document.getElementById('answer').value, voterId, data.event_id);  
    });
    

})
.catch(error => {
    console.error('Error:', error);
})

function refreshStatus (questionId, answer, voterId,event_id){
    fetch(API_ENDPOINTS.apiURLGetQuestionStatus(questionId))
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            //console.log("from refreshStatus: ", data.launch_status);
            (async () => {
                try {
                    const clientId = await getClientId(event_id);
                    // console.log('Client ID:', clientId);
                    renderStatus(data.launch_status, questionId, answer, voterId,event_id, clientId);
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
            
        })
        .catch(error => {
            console.error('Error fetching questions: ', error);
        });
}

function renderStatus(status, questionId, answer, voterId,event_id, clientId){
    let arrArg = [questionId, answer, voterId,event_id, clientId];
    let myObject = {
        questionStatus : status ,
        argumentArray: arrArg
    }
    goBackToWaitingPage(myObject);
}


function goBackToWaitingPage(obj){
    const status = obj.questionStatus;
    const arr = obj.argumentArray;
    console.log(arr); //qid, answer, voterid,eventid,clientId
    if(status !== 'Live'){
        postVoteurEvent(arr);
        setTimeout(function() {
            window.location.href = `voteur-attente.html?event_id=${arr[3]}&client_id=${arr[4]}&vid=${arr[2]}`;
        }, 3000);   
    }
    else{
        setTimeout(function() {
            refreshStatus(arr[0],arr[1],arr[2],arr[3]);
    }, 20000);  
        
    }
    //refreshStatus (questionId, answer, voterId,event_id)
}


function submitAnswer(questionId, answer, voterId,event_id){
    console.log("Arguments", questionId, answer, voterId,event_id);
    //console.log("info passed", submitAnswer.arguments);
}

function postVoteurEvent(arr){
   
    const patchData = {
        voteurs_id: arr[2],
        question_id: arr[0],
        event_id : arr[3],
        reponse : arr[1]
    };

    console.log("Patch data being sent:", patchData);

    fetch(API_ENDPOINTS.apiURLPostVoteurQuestion(), {
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
    .then(()=>{
        console.log("Voter answers logged successfully");
    })
    .catch((error) => {
        console.error('Error with edit request:', error);
    });
}


