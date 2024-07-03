
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
    editIcon.classList.add("fa-regular","fa-pen-to-square", "fa-2xs", "edit-icon");
    iconText.textContent = "modifier";
    
    linkIcon.appendChild(editIcon);
    linkIcon.appendChild(iconText);

    mesProjets.appendChild(linkIcon);  
  }
}

//-----------------------------------------ajout code de la modale-----------------------------------------------------------------------
let modal = null
const focusableSelector = "button, a, input"
let focusables = []
let previouslyFocusedElement = null

const openModal =  function (e) {
    e.preventDefault()
    modal =document.querySelector(e.target.getAttribute("href")) //donne #modal1
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(":focus")     
    modal.style.display = null
    focusables[0].focus() 
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")    
    modal.addEventListener("click" , closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal) 
    //on appelle le js-modal-stop pour lui dire qu'on veut arreter la propagation à ce moment là 
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal =  function (e) {
  if (modal === null) return
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
  e.preventDefault()  
  modal.style.display = "none"
  modal.setAttribute("aria-hidden", "true")
  modal.removeAttribute("aria-modal")
  modal.removeEventListener("click", closeModal)
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
  modal = null  
}

const stopPropagation = function (e) {
  e.stopPropagation()
}
const focusInModal = function (e) {
  e.preventDefault()
  let index = focusables.findIndex(f => f === modal.querySelector(":focus")) 
  if (e.shiftkey === true) {
    index--
  } else {
    index++
  }
   
  if (index >= focusables.length){
    index = 0
  }
  if (index < 0) {
    index = focusables.length - 1
  }
  focusables[index].focus()

}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click" , openModal)
})

//a l'action de la touche escape on devrait pouvoir sortir donc on écoute les touches du clavier
window.addEventListener("keydown" , function(e) {
  //console.log(e.key)//nous affiche la touche appuyée
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
  if (e.key === "Tab" && modal !== null){
    focusInModal(e)
  }
})

 //-----------------------------------------------------------------fin de la modale----------------------------------------------------------//
 //---------------------------------pose de l'evenement sur le clik pour remplir la photo ------------------------
// Sélection des éléments nécessaires
const imageInput = document.getElementById("imageInput");
const photoContainer = document.getElementById("photoContainer");


// Fonction pour prévisualiser l'image sélectionnée
function previewImage() {
  const file = imageInput.files[0];
  if (file) {
    console.log("Fichier sélectionné:", file); //pour info dans la console 
    const reader = new FileReader();
    reader.onload = function(event) {
      const imgElement = document.createElement("img");
      imgElement.src = event.target.result;
      imgElement.style.maxWidth = "100%";
      imgElement.style.maxHeight = "169px";
      photoContainer.innerHTML = ""; // on met à blanc la div photo-container
      photoContainer.appendChild(imgElement);
    };
    reader.readAsDataURL(file);   
  }
}

// Ajouter l'écouteur d'événement sur l'input pour afficher l'image lors de la sélection du fichier
imageInput.addEventListener("change", previewImage);

//----------------------vérifier et utiliser formData pour valider le formulaire et poster la requête--------------//
// Ajouter l'écouteur d'événement sur le formulaire pour le soumettre
photoForm.addEventListener("submit", async function(event) {
  event.preventDefault(); // Prévenir le comportement par défaut du formulaire

  // Récupérer les valeurs du formulaire
  const title = document.getElementById("titre").value;
  const categorySelect = document.getElementById("categorie");

  // Vérifier que les champs sont remplis
  if (!imageInput.files.length) {
    alert("Veuillez sélectionner une photo.");
    return;
  }

  if (!title) {
    alert("Veuillez entrer un titre.");
    return;
  }

  if (!categorySelect.value) {
    alert("Veuillez choisir une catégorie.");
    return;
  }

  const file = imageInput.files[0];
  const categorieName = categorySelect.value;

  // Mapping des noms de catégories vers leurs IDs
  const categoriesMap = {
    "Objets": 1,
    "Appartements": 2,
    "Hotels & restaurants": 3
  };

 const categoryId = categoriesMap[categorieName];
 /*
  if (!categoryId) {
    console.error("Erreur: la catégorie sélectionnée n'est pas valide.");
    return;
  }*/

  const formData = new FormData();
  formData.append("image", file, file.name);
  formData.append("title", title);
  formData.append("category", categoryId);

  // Log formData entries for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    const responseData = await response.json();
    console.log(responseData); // Log response data for debugging

    if (response.ok) {
      // Réponse réussie, on peut mettre à jour l'interface utilisateur
      alert("Le fichier a été envoyé avec succès.");      
      await fetchData(); // Recharger les données des projets
      closeModal(event); // Fermer la modale après ajout
    } else {
      // Gestion des erreurs
      const errorData = await response.json();
      alert(errorData.message || "Une erreur est survenue lors de l'ajout de la photo.");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la requête :", error);
    alert("Une erreur est survenue lors de l'envoi de la photo.");
  }
});


//----------------------------------------fin de validation formulaire et envoi requête--------------------------------//

  function afficherInterfaceClassique() {
    const divFiltreCategories = document.querySelector(".filtre-categories");
    if (divFiltreCategories) {
        divFiltreCategories.style.display = "block";
    }

    const loginButton = document.querySelector(".login-button");
    if (loginButton) {
        loginButton.textContent = "Login";
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
genererGaleriePhotoModal(listeTravaux);

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


function genererGaleriePhotoModal(listePhotos) {
        const divgalleryPhotoModal = document.querySelector(".galleryPhotoModal");
        if (!divgalleryPhotoModal) {
            console.error("L'élément .galleryPhotoModal n'existe pas sur cette page.");
            return;
        }
        divgalleryPhotoModal.innerHTML = "";

        for (const photo of listePhotos) {
            const projetItemModal = document.createElement("figure");

            const logoSupp = document.createElement("i");
            logoSupp.classList.add("fa-solid", "fa-trash-can", "trash-icon");            

            const imageItemModal = document.createElement("img");
            imageItemModal.src = photo.imageUrl;
           
            const categoryIdPhoto = document.createElement("p");
            categoryIdPhoto.innerText = photo.categoryId;
            categoryIdPhoto.style.display = "none";

            projetItemModal.appendChild(logoSupp);
            projetItemModal.appendChild(imageItemModal);
            projetItemModal.appendChild(categoryIdPhoto);
            divgalleryPhotoModal.appendChild(projetItemModal);
        }
        const ajoutPhotoButton = document.querySelector(".js-ajout-photo");
        const modal1 = document.getElementById("modal1");
        const modal2 = document.querySelector(".modal2");
        const backButton = document.querySelector(".js-modal-back");

            if (ajoutPhotoButton && modal1 && modal2 && backButton) {
                ajoutPhotoButton.addEventListener("click", () => {
                    // Cacher la première partie de la modale
                    modal1.querySelector(".galleryPhotoModal").style.display = "none";
                    ajoutPhotoButton.style.display = "none";
                    modal1.querySelector("h2").style.display = "none"; // Cacher le titre "Galerie photo"
                    modal1.querySelector(".js-modal-close").style.display = "none"; // Cacher le bouton close
                    // Afficher la seconde partie de la modale
                    modal2.style.display = "block";
                });
                backButton.addEventListener("click", () => {
                  // Afficher la première partie de la modale
                  modal1.querySelector(".galleryPhotoModal").style.display = "grid";
                  ajoutPhotoButton.style.display = "block";
                  modal1.querySelector("h2").style.display = "block"; // Afficher le titre "Galerie photo"
                  modal1.querySelector(".js-modal-close").style.display = "block"; // Afficher le bouton close
                  // Cacher la seconde partie de la modale
                  modal2.style.display = "none";
              });
  
              modal2.querySelector(".js-modal-close").addEventListener("click", closeModal);
          }
      }  
  

    })
 
 

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

  