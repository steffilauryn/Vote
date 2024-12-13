const API_ENDPOINTS = {
    urlGetQuestionsPerEvent: (eventId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/question?event_id=${eventId}`,
    urlGetEventDetails: (eventId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/event/${eventId}`,
    urlDeleteQuestion: (questionId) =>  `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`,
    urlPatchQuestion: (questionId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/editquestion/${questionId}`,
    urlGetQuestionStatus: (questionId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/getStatus/${questionId}`,
    urlPatchQuestionStatus : (questionId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:25UbIoB1/editQuestionStatus/${questionId}`,
    urlGetClientDetails : (clientId) => `https://xxbp-6khy-eo0w.n2.xano.io/api:nBe9gsiM/client/${clientId}`
};

function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const eventId = getQueryParam ('event_id');
const clientId = getQueryParam ('client_id');
const voterId = getQueryParam ('vid');
const statusArray = [];

getClientLogo(clientId);

// Used to get the clients logo
function getClientLogo(clientId){
    fetch (API_ENDPOINTS.urlGetClientDetails(clientId))
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.getElementById('imgTest').src=data.logo.url;
            refreshData();
        })
        .catch(error => {
            console.error('Error:', error);
        })
}


// Check if question is live 



function refreshData (){
    setTimeout(function() {
        fetch (API_ENDPOINTS.urlGetQuestionsPerEvent(eventId))
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            renderData(data); 
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }, 1000); 
}

function renderData(data){
    Object.values(data).forEach(item => {
        statusArray.push(item.launch_status);
    });
    console.log("data passed in parameter : ", data);
    checkQuestionLive(statusArray, data);
   
}

function newPage(questionIndex) {
    setTimeout(function() {
        window.location.href = `voteur-question.html?question_id=${questionIndex}&vid=${voterId}&eid=${eventId}`;
    }, 500);    
}

function checkQuestionLive(statusArray, data){
    setTimeout(function(){
            console.log(statusArray)
            if(statusArray.indexOf('Live')!== -1){
                const x = statusArray.indexOf('Live');
                const qid = data[x];
                newPage(qid.id);
            }
            else{
                statusArray.length=0;
                refreshData();
            }
        // },600000)
    },500)
}