# Décrassage — un chat qui montre ce qu'il fait

Objectif : un chat React qui stream la réponse d'un modèle, qu'on peut
interrompre, qui appelle un outil et montre ce qu'il fait, et qui gère
une erreur proprement. Fait pour sentir les quatre mots les plus fréquents
des offres : streaming, état en cours, appel d'outil, état d'erreur.

Méthode : je code à la main par défaut (mode M). Le mode P n'est utilisé que
quand le mentor le propose. Chaque ticket a un critère de fin et une question
d'interface à laquelle je réponds par écrit avant de passer au suivant.

## T0 — Mise en place — FAIT

Next.js + AI SDK v7 + Gemini, dépôt GitHub, `.env.local` ignoré.

## T1 — Chat qui stream — FAIT

Route `app/api/chat/route.ts`, page avec `useChat`, texte qui arrive
progressivement.
Appris : affichage optimiste du message utilisateur ; un message est une
liste de `parts` typés.

## T2 — Stop et état en cours — FAIT

`status` et `stop()` de `useChat`, composer fixe en bas, Stop à la place
d'Envoyer pendant la génération, indicateur « réflexion / réponse ».
Appris : désactiver la frappe punit l'utilisateur ; bloquer l'envoi suffit.

## T3 — Un outil, et on le voit travailler — FAIT

Outil `searchDocuments` déclaré dans la route (délai 2 s, deux documents en
dur, `stopWhen: isStepCount(5)`). Côté page, un composant `ToolCard` qui lit
`part.state`, `part.input.query`, `part.output`.
État : route faite, `ToolCard` écrit, il y avait une erreur TypeScript « part.input is of
type unknown » malgré `useChat<ChatMessage>()` et le type exporté depuis la
route avec `InferUITools`. L'erreur a été réglée.
Critères de fin : la carte apparaît avant la réponse, affiche « en cours »
2 s, puis les documents, puis la réponse du modèle ; « quelle heure est-il ? »
n'appelle pas l'outil.
Question d'interface : les documents sont-ils visibles par défaut ou repliés
derrière un clic ? Pour quel utilisateur, et pourquoi ?

## T4 — L'erreur est un cas normal - FAIT

Provoquer une erreur (clé fausse, ou `throw` une fois sur deux dans la route).
Afficher un état d'erreur lisible dans le fil, avec un bouton Réessayer qui
relance le dernier message. `useChat` expose `error` et `regenerate` (ou
équivalent dans la version installée : à vérifier).
Critères de fin : l'erreur ne casse pas la page, le message est compréhensible
par un non-dev, Réessayer fonctionne. Bonus : l'erreur d'un outil
(`state === 'output-error'`) s'affiche dans la `ToolCard`.
Question : le message d'erreur dit-il ce qui s'est passé, ou ce que
l'utilisateur peut faire ? Lequel compte le plus pour lui ?

## T5 — Finition minimale (optionnel)

Défilement automatique vers le bas pendant le streaming ; Entrée envoie,
Maj+Entrée fait un retour à la ligne (passer l'input en textarea) ; message
d'accueil qui dit ce que l'assistant sait faire.
Le Markdown affiché brut : la réponse peut contenir des ### et des ** au lieu de titres et de gras.
Les documents dépliés par défaut : On veux plutôt « repliés pour un utilisateur lambda et pas pour un utilisateur dont les documents sont au centre de la question », mais ToolCard les affiche dépliés quoiqu'il arrive.
Critère de fin : trente secondes d'usage sans souris, rien n'agace.
Question : les trois choses qui agacent encore.

## T6 — Livraison

Déploiement Vercel (plan Hobby, clé API dans les variables d'environnement),
vérification en ligne, vidéo de 15 secondes montrant le streaming, un Stop et
l'outil au travail.
Critère de fin : un lien public et une vidéo.

## Bilan de fin (à écrire avec le mentor)

Dix lignes : ce que j'ai appris, ce qui m'a surpris, ce que je changerais.
Sert de base au post LinkedIn et décide de la taille du projet 1.
