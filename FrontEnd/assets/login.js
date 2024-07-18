document.getElementById("loginForm").addEventListener("submit", async function(event) {
    //permet de ne pas envoyer le formulaire tout de suite    
            event.preventDefault();
    //on declare les constantes qui vont récupérer les value de chaque input   
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorMessage = document.getElementById("error-message");
  
            //conditions à mettre pour mauvais identifiant et afficher message//
            errorMessage.textContent = "";
            if (!email || !password) {
                errorMessage.textContent = "Veuillez remplir tous les champs.";
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
            errorMessage.textContent = "Veuillez entrer une adresse email valide.";
            return;
            }         
        
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
  