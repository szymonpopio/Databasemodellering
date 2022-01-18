var firebaseConfig = {
	apiKey: "AIzaSyBRHox6r96AVRfVzzVlMjtbWNwSV_tQ_Gc",
	authDomain: "dbtest-fe374.firebaseapp.com",
	projectId: "dbtest-fe374",
	storageBucket: "dbtest-fe374.appspot.com",
	messagingSenderId: "366748871047",
	appId: "1:366748871047:web:8cd0e0d9a2564f4f854b22"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();