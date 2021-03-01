import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

const db = admin.firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  console.log("Hello world");
  response.send("Hello from Firebase!");
});

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;

  const writeResult = await db.collection("messages").add({ original });

  res.json({ result: `Message with ID ${writeResult.id} added!` });
});

exports.makeUppercase = functions.firestore
  .document(`/messages/{documentId}`)
  .onCreate((snap, context) => {
    const original = snap.data().original;

    functions.logger.log("Uppercasing", context.params.documentId, original);

    const upperCase = original.toUpperCase();

    return snap.ref.set({ upperCase }, { merge: true });
  });
