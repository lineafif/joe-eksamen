import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const auth = getAuth();

document.getElementById("logout-button").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Bruger er logget ud.");
      // Send brugeren tilbage til login-siden
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Fejl ved logout:", error);
    });
});
