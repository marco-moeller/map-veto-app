import { deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { database, lobbiesRef } from "./firebase";

export const getLobbiesFromDatabase = async () => {
  try {
    let lobbiesList = [];
    const snapshot = await getDocs(lobbiesRef);
    snapshot.docs.forEach((doc) => lobbiesList.push(doc.data()));
    return lobbiesList;
  } catch (error) {
    console.log(error);
  }
};

/*
 *    lobby = {id: id, activePlayer: "A"||"B", maps: [...maps], matchType: "bo3"||"bo5"||... , vetoSystem: "ABABAB", "ABBAABBAA", startingMap: "startingMap" }
 */
export const getLobbyFromDatabase = async (id) => {
  try {
    const lobbyRef = doc(database, "lobbies", id);
    const lobby = await getDoc(lobbyRef);
    return lobby.data();
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const addLobbyToDatabase = async (lobby) => {
  try {
    await setDoc(doc(lobbiesRef, lobby.id), lobby);
  } catch (error) {
    console.log(error);
  }
};

export const deleteLobbyFromDatabase = async (lobbyID) => {
  try {
    await deleteDoc(doc(database, "streams", lobbyID));
  } catch (error) {
    console.log(error);
  }
};
