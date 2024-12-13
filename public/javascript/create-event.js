const API_ENDPOINTS = {
	apiAllClients: () => `https://xxbp-6khy-eo0w.n2.xano.io/api:nBe9gsiM/client`,
    apiPostClient:() => ``
};

//TABS
document.addEventListener('DOMContentLoaded', () => {
    const all_tabs = document.querySelectorAll('.tab_btn');
    const all_content = document.querySelectorAll('.content');
    var count=0;
    all_tabs.forEach((tab,index)=>{
        tab.addEventListener('click',()=>{
            all_tabs.forEach(tab=>{tab.classList.remove('active')});
            tab.classList.add('active');
            all_content.forEach(content=>{content.classList.remove('active')});
            all_content[index].classList.add('active');
        });
    });

    const addQ = document.querySelector('.addQuestionBtn');
    addQ.addEventListener('click',()=>{
        count++;
        addNewQuestion(count);
        console.log(count);
    });

});

//GET ALL QUESTIONS
fetch(API_ENDPOINTS.apiAllClients())
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const selectDropDownClients =  document.querySelector('.selectDropdownMenu');
        const optionLast = document.createElement('option');
        optionLast.value='+ Add New';
        optionLast.innerText='+ Add New';
        data.forEach((client) =>{
            const newOption = document.createElement('option');
            newOption.value = client.nom_compagnie;
            newOption.innerText = client.nom_compagnie;
            console.log(newOption.innerHTML);
            selectDropDownClients.appendChild(newOption);
        })
        selectDropDownClients.appendChild(optionLast);
    })
    .catch(error => {
        console.error('Error fetching questions: ', error);
    });

//ADD NEW CLIENT



//CHECK + ADD NEW
function checkValue(){
    var selectedDropdownValue = document.querySelector('#selectDropdownMenu').value;
    var cnid = document.querySelector('.companyNameInputDiv');
    if((selectedDropdownValue === '+ Add New')){
        cnid.classList.add('active');
    }
    else {
        cnid.classList.remove('active');
        prefillValues(selectedDropdownValue);
    }
}

function prefillValues(selectedDropdownValue){
    fetch(API_ENDPOINTS.apiAllClients())
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // const inputValue1 = document.getElementById('newCompany');
        const inputValue2 = document.getElementById('personneRessource');
        const inputValue3 = document.getElementById('courrielPersonneRessource');
        const inputValue4 = document.getElementById('telPersonneRessource');
        const inputValue5 = document.getElementById('logoImg');


        data.forEach((client) =>{
            if(client.nom_compagnie===selectedDropdownValue){
                inputValue2.value = client.personne_ressource;
                inputValue3.value = client.courriel_personne_ressource;
                inputValue4.value = client.numero_de_telephone;
                inputValue5.src = client.logo.url;
            }
        })
    })
    .catch(error => {
        console.error('Error fetching questions: ', error);
    });
}

//ADD NEW CATEGORY
function addNewValue(){
    var selectedDropdown = document.querySelector('#eventCategory');
    var dialogBox = document.querySelector('.dialog-box');
    if(selectedDropdown.value === '+ Add New'){
        turnOnOverlay();
    }
}

//TURN ON OVERLAY AND ACTIVATE DIALOG BOX TO ADD NEW CATEGORY
function turnOnOverlay(){
    document.querySelector('.dialog-box').style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

//TURN OFF OVERLAY AND CLOSE DIALOG BOX TO ADD NEW CATEGORY. ADD NEW CATEGORY TO DROPDOWN LIST
function turnOffOverlay(){
    const newCat = document.getElementById('icategory').value;
    const selectDropDown = document.getElementById('eventCategory');
    const newOption = document.createElement('option');
    var oldElem = selectDropDown[selectDropDown.length-1];
    newOption.value=newCat;
    newOption.innerText=newCat;
    selectDropDown.remove(selectDropDown.length-1);
    selectDropDown.appendChild(newOption);
    selectDropDown.appendChild(oldElem);
    newOption.selected = true;
    document.querySelector('.dialog-box').style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function addNewQuestion(count){
    const box = document.querySelector('.dynamicDiv');
    var newDiv = document.createElement('div');
    newDiv.classList.add('questionAnswerContainer');
    newDiv.innerHTML=`
        <div class="boxQuestions">
                <div class="input-group mb-3">
                    <span class="input-group-text">Question ${count}</span> 
                    <div class="form-floating">
                        <input type="text" class="form-control" id="floatingInputGroup1" placeholder="Question">
                        <label for="floatingInputGroup1">Question</label>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">Réponses</span> 
                    <div class="form-floating">
                        <input type="text" class="form-control" id="floatingInputGroup1" placeholder="Réponses">
                        <label for="floatingInputGroup1">Réponses</label>
                    </div>
                </div> 
        </div>
        <div class="inputDiv">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
        </div>
    `
    box.appendChild(newDiv);

}