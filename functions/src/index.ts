import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  console.log("Hello world");
  response.send("Hello from Firebase!");
});

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;

  const writeResult = await admin
    .firestore()
    .collection("messages")
    .add({ original });

  res.json({ result: `Message with ID ${writeResult.id} added!` });
});

exports.deleteMessage = functions.https.onRequest(async (req, res) => {
  const fieldValue = admin.firestore.FieldValue;

  const message = admin
    .firestore()
    .collection("messages")
    .doc("coktxh7Iad9S0dwnZIfJ");

  const result = await message.update({
    original: fieldValue.delete(),
  });

  res.send(result);
});

exports.addUser = functions.https.onRequest(async (req, res) => {
  const { name, email } = req.body;

  const data = {
    name,
    email,
  };

  const writeResult = await admin.firestore().collection("users").add({ data });

  res.json({ result: `User with ID ${writeResult.id} added!` });
});

exports.users = functions.https.onRequest(async (req, res) => {
  const result = admin.firestore().collection("users");

  const snapshot = await result.get();

  let data: any = [];

  snapshot.forEach((doc) => {
    data.push(doc.data());
  });

  res.json({ data });
});

exports.makeUppercase = functions.firestore
  .document(`/messages/{documentId}`)
  .onCreate((snap, context) => {
    const original = snap.data().original;

    functions.logger.log("Uppercasing", context.params.documentId, original);

    const upperCase = original.toUpperCase();

    return snap.ref.set({ upperCase }, { merge: true });
  });
