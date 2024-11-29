const API_ENDPOINTS = {
    apiURLGetQuestionsPerEvent: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question?event_id=${eventId}`,
    apiURLGetEventDetails: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/event/${eventId}`,
    apiURLDeleteQuestion: (questionId) =>  `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`,
    apiURLPatchQuestion: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editquestion/${questionId}`,
    apiURLGetQuestionStatus: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/getStatus/${questionId}`,
    apiURLPatchQuestionStatus : (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editQuestionStatus/${questionId}`,
    apiURLGetQuestionDetails : (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question/${questionId}`
};

// FONCTION QUI VA CHERCHER L'INFORMATION MIS EN PARAMÈTRES À PARTIR DE L'URL
function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// CONSTANTES FROM URL
const questionId = getQueryParam('question_id'); //eventId from url

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
    const index = 0;
    
    answerListItems.forEach((item, index) => {
        const newDiv = document.createElement('div'); // Create a new <div> element
        newDiv.id = index+1;
        newDiv.style.backgroundColor = 'rgb(94, 94, 230)';
        newDiv.style.display='flex'
        newDiv.style.flex = '1';
        newDiv.style.justifyContent = 'center';
        newDiv.style.alignItems = 'center';
        newDiv.style.fontSize= '2rem';
        newDiv.textContent = item; 
        newDiv.setAttribute('type', 'button');
        parentDiv.appendChild(newDiv); 
    });

    for (let i = 1; i <= nbrQuestions; i++) {
        const divClicked = document.getElementById(i);
    
        if (divClicked) { // Ensure the element exists
            divClicked.onclick = function() {
                // console.log('button', i);
                // if clicked add modal window 
            };
        }
    }
    



})
.catch(error => {
    console.error('Error:', error);
})