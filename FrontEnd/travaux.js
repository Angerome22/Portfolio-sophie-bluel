//console.log("coucou");
//Récupération des travaux depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
//console.log(reponse);

//Construction de la fonction qui va permettre de récupérer tous les travaux depuis l'API
//function genererWorks(works) {
// boucle qui va lister les projets
for (let i = 0; i < works.length; i++) {
  const figure = works[i];
  //recuperation de l'élément du DOM qui accueillera les projets
  const divGallery = document.querySelector(".gallery");
  //création d'une balise figure pour accueillir chaque projet
  const worksElement = document.createElement("figure");

  //creation des balises du projet
  const imageElement = document.createElement("img");
  imageElement.src = figure.imageUrl;
  const titleElement = document.createElement("figcaption");
  titleElement.innerText = figure.title;
  const categoryIdElement = document.createElement("p");
  categoryIdElement.innerText = figure.categoryId;

  //on rattache la balise figure à la div gallery
  divGallery.appendChild(worksElement);
  //on rattache l'image et le title à figure(la balise)

  worksElement.appendChild(imageElement);
  worksElement.appendChild(titleElement);
  worksElement.appendChild(categoryIdElement);

  //on rattache la balise figure au body
  //document.body.appendChild(figure);
}
//}
//premier affichage de la page
//genererWorks(works);
// gestion des boutons filtres
const boutonFiltrer = document.querySelector(".btn-filtrer");
// ajout event litener sur le bouton
boutonFiltrer.addEventListener("click", function () {
  //la fonction filter cree une copie de la liste de travaux
  const worksFiltres = works.filter(function (works) {
    return works.categoryId === 2;
  });
  console.log(worksFiltres);
});

