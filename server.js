// Import des modules WebSocket depuis la bibliothèque 'ws'
import { WebSocketServer, WebSocket } from "ws";

// Création d'un serveur WebSocket sur le port 8080
const wss = new WebSocketServer({ port: 8080 });

// Événement déclenché lors d'une nouvelle connexion client
wss.on("connection", (socket, request) => {
  // Récupération de l'adresse IP du client qui se connecte
  const ip = request.socket.remoteAddress;

  // Événement déclenché lorsque le serveur reçoit un message d'un client
  socket.on("message", (rawData) => {
    // Conversion des données brutes (Buffer) en chaîne de caractères
    const message = rawData.toString();

    // Affichage du message reçu dans la console du serveur
    console.log({ rawData });

    // Diffusion du message à tous les clients connectés (broadcast)
    wss.clients.forEach((client) => {
      // Vérification que le client est bien connecté (état OPEN)
      // avant d'envoyer le message
      if (client.readyState === WebSocket.OPEN) {
        // Envoi du message avec un préfixe "Server Broadcast:"
        client.send(`Server Broadcast: ${message}`);
      }
    });
  });

  // Événement déclenché en cas d'erreur sur la connexion
  socket.on("error", (err) => {
    // Affichage de l'erreur avec l'adresse IP du client concerné
    console.error(`Error: ${err.message}: ${ip}`);
  });

  // Événement déclenché lorsqu'un client se déconnecte
  socket.on("close", () => {
    // Message de confirmation de déconnexion dans la console
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
