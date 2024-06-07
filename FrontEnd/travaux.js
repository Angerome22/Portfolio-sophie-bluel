//console.log("test liaison");

//Récupération des travaux depuis l'API
const reponseTravaux = await fetch("http://localhost:5678/api/works");
const listeTravaux = await reponseTravaux.json(); //works a remplacer par ListeProjets
//console.log(reponse); test recup sur console
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const listeCategories = await reponseCategories.json();

//Construction de la fonction qui va permettre de récupérer tous les travaux depuis l'API
function genererTravaux(listeTravaux) {
  // boucle qui va lister les projets
  for (let i = 0; i < listeTravaux.length; i++) {
    const projets = listeTravaux[i];
    //recuperation de l'élément du DOM qui accueillera les projets
    const divGallery = document.querySelector(".gallery");
    //création d'une balise figure pour accueillir chaque projet
    const projetItem = document.createElement("figure");

    //creation des balises du projet
    const imageItem = document.createElement("img");
    imageItem.src = projets.imageUrl;
    const titleItem = document.createElement("figcaption");
    titleItem.innerText = projets.title;
    // creation de balise utile pour la récupération mais caché à l'affichage
    //const categoryIdElement = document.createElement("p");
    //categoryIdElement.innerText = figure.categoryId;

    //on rattache l'objet figure à la div gallery
    divGallery.appendChild(projetItem);
    //on rattache les balises à chaque objet
    projetItem.appendChild(imageItem);
    projetItem.appendChild(titleItem);
    //projetItem.appendChild(categoryIdElement);

    //on rattache la balise figure au body
    //document.body.appendChild(figure);
  }
}

//appel de la fonction genererWorks
genererTravaux(listeTravaux);
genererFiltres();

// ---------------gestion des boutons filtres--------------------------------
// creation liste de noms
function genererFiltres() {
  //création d'une liste des catégories avec l'id et le name
  const listeDesCategories = listeCategories.map((categorie) => categorie);
  //verification de la liste
  console.log(listeDesCategories);

  //recuperation de l'element du dom qui accueillera les filtres
  const divFiltreCategories = document.querySelector(".filtre-categories");
  //creation de la balise button "tous" en dehors de la boucle puisque hors catégorie
  const boutonFiltrerTous = document.createElement("button");
  boutonFiltrerTous.setAttribute("class", "btn-filtre");
  boutonFiltrerTous.textContent = "Tous";
  divFiltreCategories.appendChild(boutonFiltrerTous);

  for (let i = 0; i < listeDesCategories.length; i++) {
    //console.log("test");
    const boutonFiltrer = document.createElement("button");
    //recup de l'id du bouton pour le futur event listener
    boutonFiltrer.dataset.id = listeDesCategories[i].id;
    boutonFiltrer.setAttribute("class", "btn-filtre");
    boutonFiltrer.innerText = listeDesCategories[i].name;
    divFiltreCategories.appendChild(boutonFiltrer);
  }

  // -----------------------ajout event litener sur le bouton tous---------------------
  boutonFiltrerTous.addEventListener("click", function () {
    genererTravaux(listeTravaux);
  });
  // Effacement de l'écran et regénération de la page  A revoir
  //document.querySelector(".gallery").innerHTML = "";
  //genererworks(); //
} /*
// -----------------------ajout event litener sur les boutons filtres---------------------
//on recupere toutes les balises buttons presentes dans la section filtres-categories
//const boutonFiltrerCategorie = document.querySelector(
//  ".filtres-categories button"
// );

// boutonFiltrerCategorie[i].addEventListener("click", function (event) {
//  const id = event.target.dataset.id;
//    return works.categoryId === 1;
//  });
// Effacement de l'écran et regénération de la page
//   document.querySelector(".gallery").innerHTML = "";
//  genererWorks(worksFiltres);
//console.log(worksFiltres);
// });
//  }*/
// -----------------------ajout event litener sur le bouton Objets---------------------
/*boutonFiltrerObjets.addEventListener("click", function () {
  const worksFiltres = works.filter(function (works) {
    return works.categoryId === 1;
  });
  // Effacement de l'écran et regénération de la page
  document.querySelector(".gallery").innerHTML = "";
  genererWorks(worksFiltres);
  //console.log(worksFiltres);
});*/
