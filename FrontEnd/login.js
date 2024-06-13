//ecouter le bouton se connecter
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
            
    //1er cas si 
            if (reponseLogin.ok) {
                const data = await reponseLogin.json();
                //stokage du token d'authentification pour pouvoir agir dans la page index
                const token = data.token
               localStorage.setItem("authToken", token);
                

                // la connexion est réussie on retourne sur la page d'accueil en modification
                window.location.href = ("index.html");            
               
                //stokage du token d'authentification pour pouvoir agir dans la page index
                window.localStorage.setItem("data", "reponseLogin");
                console.log("data");
                //ajout du crayon de modification
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
    

