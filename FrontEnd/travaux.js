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
    const categoryIdElement = document.createElement("p");
    categoryIdElement.innerText = projets.categoryId;

    //on rattache l'objet figure à la div gallery
    divGallery.appendChild(projetItem);
    //on rattache les balises à chaque objet
    projetItem.appendChild(imageItem);
    projetItem.appendChild(titleItem);
    projetItem.appendChild(categoryIdElement);

    //on rattache la balise figure au body
    //document.body.appendChild(figure);
   //console.log(projets);
  }
}

//appel de la fonction genererWorks
genererTravaux(listeTravaux);
genererFiltres();
//ajoutListenerFiltre();

// ---------------gestion des boutons filtres--------------------------------
// creation liste de noms
function genererFiltres() {
  //création d'une liste des catégories avec l'id et le name
  const listeDesCategories = listeCategories.map((categorie) => categorie);
  //console.log(listeDesCategories);
  //recuperation de l'element du dom qui accueillera les filtres
  const divFiltreCategories = document.querySelector(".filtre-categories");
  //creation de la balise button "tous" en dehors de la boucle puisque hors catégorie
  const boutonFiltrerTous = document.createElement("button");
  boutonFiltrerTous.setAttribute("class", "btn-tous");
  boutonFiltrerTous.textContent = "Tous";
  divFiltreCategories.appendChild(boutonFiltrerTous);
  //boucle pour afficher le nom des catégories de l'api
  for (let i = 0; i < listeDesCategories.length; i++) {
    //console.log("test");
    const boutonFiltrer = document.createElement("button");
    //recup de l'id du bouton pour le futur event listener
    boutonFiltrer.dataset.id = listeDesCategories[i].id;
    //console.log(boutonFiltrer.dataset.id); //affiche bien 1 2 et 3 dans la console
    boutonFiltrer.setAttribute("class", "btn-filtre");
    boutonFiltrer.innerText = listeDesCategories[i].name;
    divFiltreCategories.appendChild(boutonFiltrer);
  }
}
// -----------------------ajout event litener sur le bouton ---------------------  
function filterCategory(boutonActuel,projets) {
//console.log(listeTravaux);

const travauxFiltres = listeTravaux.filter(function(projetsFiltres){
  if (projetsFiltres.categoryId === boutonActuel.dataCategory){
   console.log(projetsFiltres);
    return projetsFiltres;
  }
})
}
  const listeBoutons = document.querySelectorAll(".btn-filtre");
    for (let i = 0; i < listeBoutons.length; i++) {
      const boutonActuel = listeBoutons[i];
      boutonActuel.setAttribute("id", "dataCategory");
    //console.log(boutonActuel);
      boutonActuel.addEventListener("click", filterCategory );
    }
  //console.log(boutonActuel);
  // return listeTravaux.categoryId === 1;
  //const travauxFiltres = listeTravaux.filter(function (listeTravaux) {
  //ici appel de la liste filtre pour la categorie recupere dans l'event

  //Effacement de l'écran et regénération de la page
 /*document.querySelector(".gallery").innerHTML = "";
  genererTravaux(listeTravaux);*/
/*}*/
/*
/*document.querySelectorAll(".btn-filtre").forEach((button) => {
  //console.log(button);
  button.addEventListener("click", function (event) {
    console.log(event.currentTarget);
    const travauxFiltres = listeTravaux.filter(function (listeTravaux) {
      return listeTravaux.categoryId;
    });
  });
  //Effacement de l'écran et regénération de la page
  document.querySelector(".gallery").innerHTML = "";
  genererTravaux(listeTravaux);
});

const listeTravauxFiltres = listeTravaux.filter(function (listeTravaux) {
  console.log(listeTravaux.categoryId === 1);
});*/

/*button.addEventListener("click", function () {
  const travauxFiltres = listeTravaux.filter(function (listeTravaux) {
  if (listeTravaux.categoryId === 1) {
    return listeTravaux.categoryId;
   }
  });
  //Effacement de l'écran et regénération de la page
  document.querySelector(".gallery").innerHTML = "";
  genererTravaux(listeTravaux);
});*/

//function onClickFiltre(event) {
// console.log(event.currentTarget);
//création d'une liste des catégories avec l'id et le name

/*document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", function (event) {
    const projetsFiltres = listeTravaux.filter(function (listeTravaux) {
      console.log(projetsFiltres);
    });
    //Effacement de l'écran et regénération de la page
    document.querySelector(".gallery").innerHTML = "";
    genererProjets(projetsFiltres);
  });
});*/

/*function ajoutListenerFiltre() {
  const boutonFiltrer = document.querySelectorAll(".btn-filtre");
  for (let i = 0; i < boutonFiltrer.length; i++) {
    boutonFiltrer[i].addEventListener("click", function (event) {
      const id = event.target.dataset.id;
      console.log;
      // genererTravaux(listeTravaux);
    });*/
/*}/*
}*/
// -----------------------ajout event litener sur le bouton Objets---------------------//
//boutonFiltrerObjets.addEventListener("click", function () {
//const projetsFiltres = projets.filter(function (projets) {
// return projets.categoryId === 1;
//});
// Effacement de l'écran et regénération de la page
//document.querySelector(".gallery").innerHTML = "";
//genererProjets(projetsFiltres);
//console.log(worksFiltres);
//});
