//-------------------INITIALISATION-------------------//

document.addEventListener("DOMContentLoaded", function () {
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


//---------------------------------------------------INTERFACE ADMINISTRATION------------------------------------//

function afficherInterfaceAdmin(){
  const divFiltreCategories = document.querySelector(".filtre-categories");
  if (divFiltreCategories){
      divFiltreCategories.style.display = "none";//on cache le filtre
  }
  //on remplace login par logout
  const loginButton = document.querySelector(".login-button");
if (loginButton) {    
    loginButton.textContent = "logout";
    loginButton.classList.add("logout");  
    // Vérifier si le bouton de déconnexion est bien créé    
    const logoutButton = document.querySelector(".logout");  
    if (logoutButton) {
            logoutButton.addEventListener("click", function() {            
            localStorage.removeItem("authToken");            
            logoutButton.href = "index.html";            
        });
    } else {
        console.log("Logout button not found");
    }
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


//---------------------------------------------------INTERFACE CLASSIQUE------------------------------------//

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

//-----------------------------------------------------------GESTION DES-MODALES------------------------------------------------//

let modal = null
const focusableSelector = "button, a, input, href, select, option, label"
let focusables = []
let previouslyFocusedElement = null

const openModal =  function (e) {
    e.preventDefault()
    modal =document.querySelector(e.target.getAttribute("href")) //donne #modal1
    resetModal()
    focusables = Array.from(modal.querySelectorAll(focusableSelector)) //resoudre le probleme à l'appui sur le crayon ou modifier cela ne fait rien, juste à gauche du crayon//
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

 //---------------------------------------RECUPERATION DE DONNEES----------------------------------------------//

async function fetchData() {
  //Récupération des travaux depuis l'API
  const reponseTravaux = await fetch("http://localhost:5678/api/works");
  const listeTravaux = await reponseTravaux.json(); //works a remplacer par ListeProjets
  //console.log(reponse); test recup sur console
  const reponseCategories = await fetch("http://localhost:5678/api/categories");
  const listeCategories = await reponseCategories.json();
  
  // appel des fonctions pour générer les travaux et les filtres
  genererTravaux(listeTravaux);
  genererFiltres(listeCategories);
  ajouterListenerFiltres(listeTravaux);
  genererGaleriePhotoModal(listeTravaux);
  ajouterListenerSuppressionPhoto();
  genererCategorieModalAjoutPhoto(listeCategories);
  }

//---------------------------------------GENERATION DES GALERIES ET DES FILTRES---------------------------------//
//-----------------------------------RECUPERATION DE TOUS LES TRAVAUX DEPUIS L'API---------------------------//
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

// ----------------------------------------GENERATION DES FILTRES DES TRAVAUX A PARTIR DES CATEGORIES DE L'API--------------------------------

function genererFiltres(listeCategories) {
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
  boutonFiltrerTous.setAttribute("class", "btn-tous actif");
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
}
// -------------------------------------------------AJOUT DE LISTENER SUR BOUTONS FILTRES ---------------------


function ajouterListenerFiltres(listeTravaux) {
  const listeBoutons = document.querySelectorAll(".btn-filtre, .btn-tous");
  listeBoutons.forEach(bouton => {
    bouton.addEventListener("click", (event) => {
      // Retirer la classe active de tous les boutons
      listeBoutons.forEach(b => b.classList.remove("actif"));


      // Ajouter la classe active au bouton cliqué
      bouton.classList.add("actif");

      // Appliquer le filtre
      if (bouton.classList.contains("btn-tous")) {
        genererTravaux(listeTravaux);
      } else {
        const categoryId = parseInt(event.target.dataset.id, 10);
        const listeTravauxFiltres = listeTravaux.filter(travail => travail.categoryId === categoryId);
        genererTravaux(listeTravauxFiltres);
      }
    });
  });
}
 //-----------GESTION MODALE PARTIE 2 : SELECTION ET RECUPERATION D'UNE NOUVELLE PHOTO ET REMPLISSAGE DU CADRE PREVU ---------------//

  const imageInput = document.getElementById("imageInput");
  const photoContainer = document.getElementById("photoContainer");
  


  // Fonction pour prévisualiser l'image sélectionnée
  function previewImage() {
    const file = imageInput.files[0];
    const maxSizeInBites = 4 * 1024 *1024;
    if (file && file.size > maxSizeInBites) {
      /*console.log("Fichier sélectionné:", file); //pour info dans la console */
      alert("La taille du fichier dépasse la limite autorisée (4 Mo). Veuillez sélectionner un fichier plus petit.");
      Input.value = "";
    } else {
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
  
  imageInput.addEventListener("change", previewImage);

  //-----------GESTION MODALE PARTIE 2 : RECUPERATION DES CATEGORIES DEPUIS L'API ---------------//


  function genererCategorieModalAjoutPhoto (listeCategories){

    const labelCategory = document.querySelector(".ajout-categorie")
    labelCategory.innerHTML = "";

    const titleCategory = document.createElement("label");
    titleCategory.classList.add("ajout-categorie");
    titleCategory.textContent = "Catégorie";
    const choiceCategory = document.createElement("select");
    choiceCategory.setAttribute = ("name" , "categorie");
    choiceCategory.classList.add("ajout-categorie");
    choiceCategory.id = "categorie";
    labelCategory.appendChild(titleCategory);
    labelCategory.appendChild(choiceCategory);  
    //-------------------option value à blanc en premier-------------//
    const optionCategoryEmpty = document.createElement("option");
    optionCategoryEmpty.innerText = "";
    choiceCategory.appendChild(optionCategoryEmpty);
    //boucle pour afficher le nom de chaque catégorie de l'api dans les options du select
    for (let i = 0; i < listeCategories.length; i++) {
      //console.log("test");
      const optionCategory = document.createElement("option");
      //recup de l'id du bouton pour le futur event listener
      optionCategory.dataset.id = listeCategories[i].id;
      //console.log(optionCategory.dataset.id); //affiche bien 1 2 et 3 dans la console
      optionCategory.value = listeCategories[i].id;
      optionCategory.innerText = listeCategories[i].name;
      choiceCategory.appendChild(optionCategory);
    }
  }

//----------------------GESTION MODALE PARTIE 2 : SOUMISSION DU FORMULAIRE AVEC FORMDATA ET ENVOI REQUETE AJOUT NOUVEAU TRAVAIL--------------//


const photoForm = document.getElementById("photoForm");
const submitButton = document.getElementById("submitButton");



// Ajouter l'écouteur d'événement sur le formulaire pour le soumettre
photoForm.addEventListener("submit", async function(event) {
  event.preventDefault(); 

  // Récupérer les valeurs du formulaire
  const title = document.getElementById("titre").value;
  /*console.log("title");*/
  const categorySelect = document.getElementById("categorie");
  const categoryId = categorySelect.options[categorySelect.selectedIndex].dataset.id;
 /* console.log("Selected Category ID:", categoryId);*/

  // Vérifier que les champs sont remplis 
  if (!imageInput.files.length) {
    alert("Veuillez sélectionner une photo.");
    return;
  }
  if (!title) {
    alert("Veuillez entrer un titre.");
    return;
  }
  if (!categoryId) {
    alert("Veuillez choisir une catégorie.");
    return;
  }
//---------------on change la couleur du bouton si tous les champs sont remplis-------------//
if (imageInput.files.length && title && categoryId) {
  submitButton.style.backgroundColor = "#1d6154";
  submitButton.style.color = "white";
  submitButton.disabled = false;
} 

  const file = imageInput.files[0]; 

  const formData = new FormData();
  formData.append("image", file, file.name);
  formData.append("title", title);
  formData.append("category", categoryId);

  /* Log formData entries for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }*/

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    /*const responseData = await response.json();
    /*console.log(responseData); // Log response data for debugging*/

    if (response.ok) {
      // Réponse réussie, on peut mettre à jour l'interface utilisateur
      alert("Le fichier a été envoyé avec succès.");      
      await fetchData(); // Recharger les données des projets
      resetModal();      
      resetForm();
      closeModal(event); // Fermer la modale après ajout
      //openModalById('modal1'); // Rediriger vers la modal
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

//-------------------------------GESTION MODALE PARTIE 1 : GENERATION DE LA GALERIE PHOTOS------------------------//

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
            logoSupp.id = "suppPhoto"; 
            logoSupp.dataset.photoId = photo.id; //Ajouter l'ID du photo pour référence          

            const imageItemModal = document.createElement("img");
            imageItemModal.src = photo.imageUrl;
           
            const categoryIdPhoto = document.createElement("p");
            categoryIdPhoto.id = "categoryPhoto";
            categoryIdPhoto.innerText = photo.categoryId;            
            categoryIdPhoto.style.display = "none";

            projetItemModal.appendChild(logoSupp);
            projetItemModal.appendChild(imageItemModal);
            projetItemModal.appendChild(categoryIdPhoto);
            divgalleryPhotoModal.appendChild(projetItemModal);
        }

//---------------------------GESTION MODALE PARTIE 2 : LISTENER SUR LES BOUTONS FERMER MODALES ET RETOUR MODALE 1 ET  AJOUTER UNE PHOTO---------------//  

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

//---------------------------GESTION MODALE PARTIE 1 : AJOUT DE LISTENER SUR ICONE POUBELLE POUR SUPPRIMER UN TRAVAIL ---------------------------------//
function ajouterListenerSuppressionPhoto () {
           const trashIcons = document.querySelectorAll(".trash-icon");
           trashIcons.forEach(icon => {
              icon.addEventListener("click", async (event) => {
                const photoId = event.target.dataset.photoId;
                /*console.log(photoId);*/
                const token = localStorage.getItem("authToken");

                if (confirm("confirmer la suppression de la photo")) {
                  try{
                    const suppPhoto = await fetch(`http://localhost:5678/api/works/${photoId}`, {
                      method: "DELETE",
                      headers: {
                        "Authorization": `Bearer ${token}`
                      }
                    });
                  if (suppPhoto.ok) {                                                  
                    const figure = event.target.closest("figure");
                    if (figure) {
                      figure.remove();
                    }
                    alert("La photo a été supprimée avec succés");        
                    closeModal(event); // Fermer la modale après supp                    
                   await fetchData(); // Recharger les données des projets
                    
                  }  else {
                      const errorData = await suppPhoto.json();
                      alert(errorData.message || "Erreur lors de la suppression de la photo");
                  }
                } catch (error) {
                  console.error("Erreur lors de la suppression de la photo :", error);
                  alert("Une erreur est survenue lors de la suppression de la photo.");
              }
          }
      });
  }); 
};  
//---------------------------RESET DE LA MODALE POUR RETOURNER A LA PREMIERE PARTIE DE LA  MODALE 
function resetModal() {
  const modal1 = document.getElementById("modal1");
  const modal2 = document.querySelector(".modal2");
  const ajoutPhotoButton = document.querySelector(".js-ajout-photo");
  
  // Réinitialiser l'affichage des éléments
  modal1.querySelector(".galleryPhotoModal").style.display = "grid";
  ajoutPhotoButton.style.display = "block";
  modal1.querySelector("h2").style.display = "block"; // Afficher le titre "Galerie photo"
  modal1.querySelector(".js-modal-close").style.display = "block"; // Afficher le bouton close
  modal2.style.display = "none";
}


//---------------------------------RESET DU FORMULAIRE APRES ENVOI--------------------------//
function resetForm() {
  document.getElementById("photoForm").reset();
  photoContainer.innerHTML = '<i class="fa-regular fa-image"></i><button class="btn-ajout-fichier">+ ajouter photo<input type="file" accept="image/*" id="imageInput" name="files"></button><span>jpeg, png: 4mo max</span>';
  document.getElementById("submitButton").style.backgroundColor = "";
  document.getElementById("submitButton").style.color = "";
  document.getElementById("submitButton").disabled = true;
  imageInput.addEventListener("change", previewImage);
}


});//-------------fermeture de l'écoute du DOMContentLOAD
 
 


  