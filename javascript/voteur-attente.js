const API_ENDPOINTS = {
    urlGetQuestionsPerEvent: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/question?event_id=${eventId}`,
    urlGetEventDetails: (eventId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/event/${eventId}`,
    urlDeleteQuestion: (questionId) =>  `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/deleteQuestion/${questionId}`,
    urlPatchQuestion: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editquestion/${questionId}`,
    urlGetQuestionStatus: (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/getStatus/${questionId}`,
    urlPatchQuestionStatus : (questionId) => `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/editQuestionStatus/${questionId}`,
    urlGetClientDetails : (clientId) => `https://x8ki-letl-twmt.n7.xano.io/api:nBe9gsiM/client/${clientId}`
};

function getQueryParam (name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const eventId = getQueryParam ('event_id');
const clientId = getQueryParam ('client_id');
const statusArray = [];

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
    })
    .catch(error => {
        console.error('Error:', error);
    })


fetch (API_ENDPOINTS.urlGetQuestionsPerEvent(eventId))
.then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    console.log(data);
    console.log(typeof data);
    Object.values(data).forEach(item => {
        statusArray.push(item.launch_status);
    });
    
    if(statusArray.indexOf('Live')!== -1){
        const x = statusArray.indexOf('Live');
        const qid = data[x];
        newPage(qid.id);
    };
    
})
.catch(error => {
    console.error('Error:', error);
})

function newPage(questionIndex) {
    setTimeout(function() {
        window.location.href = `voteur-question.html?question_id=${questionIndex}`;
    }, 2000);    
}

