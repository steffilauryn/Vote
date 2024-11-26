function enterCode(){
    const codeEnteredByUser = document.getElementById('enterCode').value;
    const apiURLCodeEntered = `https://x8ki-letl-twmt.n7.xano.io/api:25UbIoB1/getEventCode?userCode=${codeEnteredByUser}`;
    return apiURLCodeEntered;
}

function fetchData() {
    const apiurl = enterCode();
    fetch(apiurl)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
    .then(data => {
        console.log(data);
        if(data === "Invalid Code"){
            document.getElementById('error-message').style="text-decoration: red double underline; color:red;"
        }
        else{
            window.location.href = `voteur-attente.html?client_id=${data.client_id}&event_id=${data.id}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    })
}

// Set the onclick attribute of the button dynamically
document.getElementById('submitButton').setAttribute('onclick', 'fetchData();');