
document.addEventListener("DOMContentLoaded", function (){
//on s'assure que le token est bien présent ici pour la suite des modifs
const token = localStorage.getItem("authToken");
if (token){
  //si le token est présent on utilise la fonction qui modifie l'interface d'admin d'index
  afficherInterfaceAdmin();

}else{
  //sinon on execute l'interface classique
  afficherInterfaceClassique();

}
fetchData();

//ajout code de la modale

 // Code pour afficher et fermer la modale

 const openModal = function (e) {
  e.preventDefault();
  //const target =document.querySelector(e.target.getAttribute("href"));
  const href = e.target.getAttribute(".js-modal");
  const target = document.querySelector(href);
  
  console.log("Trying to open modal with href:", href);
  console.log("Target element:", target);
  target.style.display = "block";
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true")
 }
 
document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", openModal);
})
});
function afficherInterfaceAdmin(){
  const divFiltreCategories = document.querySelector(".filtre-categories");
  if (divFiltreCategories){
    divFiltreCategories.style.display = "none";//on cache le filtre
  }
  //on remplace login par logout
  const loginButton = document.querySelector(".login-button");
  if (loginButton){
    loginButton.textContent = "logout";
    //on ajout un ecouteur au bouton pour retourner sur la page login quand on se deconnecte
    loginButton.addEventListener("click", function(){
      localStorage.removeItem("authToken");
      window.Location.href = "login.html";
    })
  }
  //on ajoute le logo crayon  texte modification
  const mesProjets = document.querySelector(".mes-projets");
  if (mesProjets) {
    const linkIcon = document.createElement("a");
    const editIcon = document.createElement("i");
    const iconText = document.createElement("span");
    linkIcon.href = "#modal1";    
    linkIcon.classList.add("js-modal");
    iconText.classList.add("modify")
    editIcon.classList.add("fa-regular","fa-pen-to-square","edit-icon");
    iconText.textContent = "modifier";
    
    linkIcon.appendChild(editIcon);
    linkIcon.appendChild(iconText);

    mesProjets.appendChild(linkIcon);  
  }
}
function afficherInterfaceClassique() {
  function afficherInterfaceNonAuthentifie() {
    const divFiltreCategories = document.querySelector(".filtre-categories");
    if (divFiltreCategories) {
        divFiltreCategories.style.display = "block";
    }

    const loginButton = document.querySelector(".login-button");
    if (loginButton) {
        loginButton.textContent = "Login";
    }
}
}


//console.log("test liaison");
async function fetchData() {
//Récupération des travaux depuis l'API
const reponseTravaux = await fetch("http://localhost:5678/api/works");
const listeTravaux = await reponseTravaux.json(); //works a remplacer par ListeProjets
//console.log(reponse); test recup sur console
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const listeCategories = await reponseCategories.json();

// appel des fonctions pour générer les travaux et les filtres
genererTravaux(listeTravaux);
genererFiltres(listeCategories, listeTravaux);
ajouterListenerFiltres(listeTravaux);

}

//----------------------Construction de la fonction qui va permettre de récupérer tous les travaux depuis l'API---------------------------
function genererTravaux(listeTravaux) {
  //recuperation de l'élément du DOM qui accueillera les projets
  const divGallery = document.querySelector(".gallery");
  // Vérifiez que l'élément existe avant d'essayer de modifier son contenu
  if (!divGallery) {
    console.error("L'élément .gallery n'existe pas sur cette page.");
    return;}
  //Effacement de l'écran et regénération de la page  
  divGallery.innerHTML = "";

  // boucle qui va lister les projets
  for (let i = 0; i < listeTravaux.length; i++) {
    const projets = listeTravaux[i];
    
    //création d'une balise figure pour accueillir chaque projet
    const projetItem = document.createElement("figure");

    //creation des balises du projet
    const imageItem = document.createElement("img");    
    imageItem.src = projets.imageUrl;
    const titleItem = document.createElement("figcaption");
    titleItem.innerText = projets.title;    
    const categoryIdElement = document.createElement("p");//caché à l'affichage
    categoryIdElement.innerText = projets.categoryId;
    
    //on rattache les éléments à chaque balise figure
    projetItem.appendChild(imageItem);
    projetItem.appendChild(titleItem);
    projetItem.appendChild(categoryIdElement);
    //on rattache l'objet figure à la div gallery
    divGallery.appendChild(projetItem);    
  }
}

// ---------------gestion des boutons filtres--------------------------------

function genererFiltres(listeCategories, listeTravaux) {
   //const listeDesCategories = listeCategories.map((categorie) => categorie);     

  const divFiltreCategories = document.querySelector(".filtre-categories");
  // Vérifiez que l'élément existe avant d'essayer de modifier son contenu
  if (!divFiltreCategories) {
    console.error("L'élément .filtre-categories n'existe pas sur cette page.");
    return;
  }
  divFiltreCategories.innerHTML= "";
  //creation de la balise button "tous" en dehors de la boucle puisque hors catégorie
  const boutonFiltrerTous = document.createElement("button");
  boutonFiltrerTous.setAttribute("class", "btn-tous");
  boutonFiltrerTous.textContent = "Tous";
  divFiltreCategories.appendChild(boutonFiltrerTous);

  //boucle pour afficher le nom de chaque catégorie de l'api
  for (let i = 0; i < listeCategories.length; i++) {
    //console.log("test");
    const boutonFiltrer = document.createElement("button");
    //recup de l'id du bouton pour le futur event listener
    boutonFiltrer.dataset.id = listeCategories[i].id;
    //console.log(boutonFiltrer.dataset.id); //affiche bien 1 2 et 3 dans la console
    boutonFiltrer.setAttribute("class", "btn-filtre");
    boutonFiltrer.innerText = listeCategories[i].name;
    divFiltreCategories.appendChild(boutonFiltrer);
  }
// -----------------------ajout event litener sur les boutons ---------------------  
boutonFiltrerTous.addEventListener("click", () =>{
  genererTravaux(listeTravaux);
})
}

 function ajouterListenerFiltres(listeTravaux){
  const listeBoutons = document.querySelectorAll(".btn-filtre"); 
    for (let i = 0; i < listeBoutons.length; i++) {
      const boutonActuel = listeBoutons[i];     
      boutonActuel.addEventListener("click", (event) => {
        const categoryId = parseInt(event.target.dataset.id, 10); 
        const listeTravauxFiltres = listeTravaux.filter(travail => travail.categoryId === categoryId);
        genererTravaux(listeTravauxFiltres); 
      });
    }
 }
 // appel de la fonction fetchData pour initialiser les travaux et les filtres
 fetchData();

//--------------------------fonction pour le login à la page de connexion---------------------------------------------------------

 document.getElementById("loginForm").addEventListener("submit", async function(event) {
  //permet de ne pas envoyer le formulaire tout de suite    
          event.preventDefault();
  //on declare les constantes qui vont récupérer les value de chaque input   
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          const errorMessage = document.getElementById("error-message");
      
          try {
              //on fait une requete pour envoyer les données de connexion
              const reponseLogin = await fetch("http://localhost:5678/api/users/login", {
              //Création de la charge utile au format JSON
                  method: "POST",
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify({ email, password })
              });         
   
              if (reponseLogin.ok) {
                  const data = await reponseLogin.json();
                  //stokage du token d'authentification pour pouvoir agir dans la page index
                  const token = data.token
                  localStorage.setItem("authToken", token);              
                  //trouver le moyen de vérifier que le token est stoké avec un console.log
                  // on desactive temporairement le window location et on peut voir dans la console le token
                  //console.log(token); 
                  // la connexion est réussie on retourne sur la page d'accueil en modification
                  window.location.href = ("index.html");                                            
              } else {
                  // on complete la balise p prevu pour les erreurs
                  const errorData = await reponseLogin.json();
                  errorMessage.textContent = errorData.message || "Email ou mot de passe incorrect";
              }
           //on attrape aussi l'exeption qui peut etre une erreur de serveur   
          } catch (error) {
              errorMessage.textContent = "Erreur de connexion. Veuillez réessayer plus tard.";
          }
      });

  