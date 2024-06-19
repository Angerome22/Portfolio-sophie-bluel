//console.log("coucou")
document.addEventListener("DOMContentLoaded", function (){
    console.log("DOM fully loaded and parsed");

const modalLink = document.querySelector("js-modal");
if (modalLink){
    console.log("Adding click event listener to", modalLink);    
   modalLink.addEventListener("click", openModal);
};



function openModal(e) {
    e.preventDefault()
    console.log("openModal called");
    const target = document.querySelector(e.target.getAttribute("href"));
    if (target){
    console.log("Target found:", target);    
    target.style.display = "block";
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    }else{
        console.error("target modal not found");
    }
}
function closeModal(e) {
    if (modal === null) return;
    e.preventDefault()
    console.log("closeModal called");    
    modal.style.display = "none";
    modal.setAttribute("aria-hidden" , "true");
    modal.removeAttribute("aria-modal");    
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

});
