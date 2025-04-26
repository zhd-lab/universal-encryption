🛠️ Installation
Cette application utilise Svelte comme framework principal. Pour installer le projet localement :

Clonez le dépôt

bash

git clone [git url]
cd universal-encryption
Installez les dépendances

bash

npm install
Cela installera toutes les dépendances nécessaires à l'exécution de l'application.

🔄 Mise à jour des paquets
Pour maintenir vos paquets à jour :

Vérifiez les mises à jour disponibles


npm outdated
Mettez à jour les dépendances

npm update
Pour mettre à jour manuellement un paquet spécifique

bash
Copier
Modifier
npm install [nom-du-paquet]@latest
Optionnel : pour vérifier les vulnérabilités de sécurité

npm audit
npm audit fix
🖥️ Démarrer l'application en mode développement
Après l'installation des dépendances, lancez l'application avec :

bash
Copier
Modifier
npm run dev
L'application sera accessible sur http://localhost:5000/ (ou un autre port si celui-ci est déjà utilisé).

🛡️ Sécurité et Confidentialité : Comment ça marche ?
Chiffrement local : Vos fichiers, textes ou données sont chiffrés directement dans votre navigateur. Aucune donnée n'est envoyée à un serveur externe.

Algorithme de chiffrement : Basé sur un modèle symétrique où la même clé est utilisée pour chiffrer et déchiffrer vos données.

Stockage : Si vous sauvegardez un fichier ou un message, il est stocké sous forme encryptée uniquement.

Transparence totale : Le code source est disponible et auditable dans ce respertoire.

📜 Licence
Ce projet est sous licence MIT.
