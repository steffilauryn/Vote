const API_ENDPOINTS = {
	apiAllClients: () => `https://xxbp-6khy-eo0w.n2.xano.io/api:nBe9gsiM/client`,
    apiPostClient:() => ``
    
};

//Variables
const all_tabs = document.querySelectorAll('.tab_btn');
const all_content = document.querySelectorAll('.content');
const addQ = document.querySelector('.addQuestionBtn');
const selectDropDownClients =  document.querySelector('.selectDropdownMenu');
var cnid = document.querySelector('.companyNameInputDiv');
var companyName = document.getElementById('newCompany');
const inputValue2 = document.getElementById('personneRessource');
const inputValue3 = document.getElementById('courrielPersonneRessource');
const inputValue4 = document.getElementById('telPersonneRessource');
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
var selectedDropdown = document.querySelector('#eventCategory');
var dialogBox = document.querySelector('.dialog-box');
var overlay = document.getElementById("overlay");
const icat = document.getElementById('icategory');
const colorPickedBackground = document.getElementById("colorPickerBackground");
const colorPickedAnswerBox = document.getElementById("colorPickerAnswersBox");
const colorPickedText= document.getElementById("colorPickerText");
const box = document.querySelector('.dynamicDiv');
const eventNameInput = document.getElementById('eventName');
const eventType = document.getElementById('eventType');
const savePage1 = document.getElementById('saveP1');
const savePage2 = document.getElementById('saveP2');
const savePage3 = document.getElementById('saveP3');
const savePage4 = document.getElementById('saveP4');


//TABS
document.addEventListener('DOMContentLoaded', () => {
    var count=0;
    all_tabs.forEach((tab,index)=>{
        tab.addEventListener('click',()=>{
            all_tabs.forEach(tab=>{tab.classList.remove('active')});
            tab.classList.add('active');
            all_content.forEach(content=>{content.classList.remove('active')});
            all_content[index].classList.add('active');
        });
    });

    addQ.addEventListener('click',()=>{
        count++;
        addNewQuestion(count);
        console.log(count);
    });
});

//Page 1
//GET ALL clients
fetch(API_ENDPOINTS.apiAllClients())
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
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


//CHECK + ADD NEW
function checkValue(){
    var selectedDropdownValue = selectDropDownClients.value;
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
        console.log("apiAllClients : ", data);

        data.forEach((client) =>{
            if(client.nom_compagnie===selectedDropdownValue){
                companyName = selectedDropdownValue;
                inputValue2.value = client.personne_ressource;
                inputValue3.value = client.courriel_personne_ressource;
                inputValue4.value = client.numero_de_telephone;
                preview.innerHTML = `<img src="${client.logo.url}" alt="Preview" class="logoImg" />`;
            }
        })
    })
    .catch(error => {
        console.error('Error fetching client information: ', error);
    });
}

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="logoImg" />`;
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload a valid image.");
    }
});

var tablePageOne = {companyName:"", nomPersonne:"",courriel:"",telephone:"", logoUrl:""};
var infoManquante = document.getElementById("infoManquante1");

savePage1.addEventListener("click", ()=>{
    tablePageOne.companyName = companyName;
    tablePageOne.nomPersonne = inputValue2.value;
    tablePageOne.courriel = inputValue3.value;
    tablePageOne.telephone = inputValue4.value;
    tablePageOne.logoUrl = document.querySelector(".logoImg").src;
    var pageComplete = Object.values(tablePageOne);
    if(pageComplete.indexOf('')!=-1){
        infoManquante.innerHTML=`Certaines informations sont manquantes. Veuillez revérifier vos réponses.`
        infoManquante.style.display="block";
    }
    else{
        infoManquante.style.display="none";
        console.log(tablePageOne);
    }
})

//Page 2
//ADD NEW CATEGORY
function addNewValue(){
    if(selectedDropdown.value === 'Autre catégorie'){
        turnOnOverlay();
    }
}

//TURN ON OVERLAY AND ACTIVATE DIALOG BOX TO ADD NEW CATEGORY
function turnOnOverlay(){
    dialogBox.style.display = "block";
    overlay.style.display = "block";
}

//TURN OFF OVERLAY AND CLOSE DIALOG BOX TO ADD NEW CATEGORY. ADD NEW CATEGORY TO DROPDOWN LIST
function turnOffOverlay(){
    const newCat = icat.value;
    const newOption = document.createElement('option');
    var oldElem = selectedDropdown[selectedDropdown.length-1];
    newOption.value=newCat;
    newOption.innerText=newCat;
    selectedDropdown.remove(selectedDropdown.length-1);
    selectedDropdown.appendChild(newOption);
    selectedDropdown.appendChild(oldElem);
    newOption.selected = true;
    dialogBox.style.display = "none";
    overlay.style.display = "none";
}

var tablePageTwo = {eventName:"", eventCategory:"",eventType:""};
var infoManquante2 = document.getElementById("infoManquante2");

savePage2.addEventListener("click", ()=>{
    tablePageTwo.eventName = eventNameInput.value;
    tablePageTwo.eventCategory = selectedDropdown.value;
    tablePageTwo.eventType = eventType.value;
    var pageComplete = Object.values(tablePageTwo);
    if(pageComplete.indexOf('')!=-1){
        infoManquante2.innerHTML=`Certaines informations sont manquantes. Veuillez revérifier vos réponses.`
        infoManquante2.style.display="block";
    }
    else{
        infoManquante2.style.display="none";
        console.log(tablePageTwo);
    }
})

//Page 3
colorPickedBackground.addEventListener("input",()=>{
  document.getElementById("backgroundPreview").style.backgroundColor = colorPickedBackground.value;
})

colorPickedAnswerBox.addEventListener("input",()=>{
    var allAnswerBoxes = document.querySelectorAll(".answerPreview");
   allAnswerBoxes.forEach(box => {
    box.style.backgroundColor=colorPickedAnswerBox.value;
   })
})

colorPickedText.addEventListener("input",()=>{
  document.getElementById("questionPreview").style.color = colorPickedText.value;

  var allAnswerBoxes = document.querySelectorAll(".answerPreview");
   allAnswerBoxes.forEach(box => {
   box.style.color=colorPickedText.value;
  })
})

var tablePageThree = {couleur_arriere_plan:"", couleur_bouton:"",couleur_texte:""};
var infoManquante3 = document.getElementById("infoManquante3");

savePage3.addEventListener("click", ()=>{
    tablePageThree.couleur_arriere_plan = colorPickedBackground.value;
    tablePageThree.couleur_bouton = colorPickedAnswerBox.value;
    tablePageThree.couleur_texte = colorPickedText.value;
    console.log(tablePageThree);
    
    var pageComplete = Object.values(tablePageThree);
    if(pageComplete.indexOf('')!=-1){
        infoManquante3.innerHTML=`Certaines informations sont manquantes. Veuillez revérifier vos réponses.`
        infoManquante3.style.display="block";
    }
    else{
        infoManquante3.style.display="none";
        console.log(tablePageThree);
    }
})

//Page 4
function addNewQuestion(count){
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

var tablePageFour = {};

savePage4.addEventListener("click", ()=>{
    const allqr = document.querySelectorAll('.form-control');
    const onlyQ = [];
    const onlyR = [];
    for(var i = 0; i<allqr.length; i++)
    {
        if (i%2===0){
            onlyQ.push(allqr[i].value);
        }
        else{
            onlyR.push(allqr[i].value);
        }
    }

    for(var i = 0; i<onlyQ.length;i++){
        tablePageFour[onlyQ[i]]=onlyR[i];
    }
    console.log(onlyQ);
    console.log(onlyR);
    console.log(tablePageFour);
})


































//to add a new event to the table i need the following information
//titre de l'evenement 
//description
//card_description
//statut
//date_heure_debut
//date_heure_fin
//nbr_inscrits
//nbr_voteurs
//nbr_questions
//slug
//theme_id
//client_id
//type
//entry_code
//category