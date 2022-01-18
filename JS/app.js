const list = document.querySelector('ul');
const form = document.querySelector('form');

function addPerson(newPerson) {
	db.collection('person_reg')
		.get()
		.then(snapshot => {
			const docs = snapshot.docs
			let isAvailable = true
			const docPersonnummer = document.querySelector('#fødselsnummer').value
			docs.forEach(doc => {
				const personnummer = doc.data().Personnummer
				if (docPersonnummer === personnummer) {
					isAvailable = false;
				}
			});

            if (isAvailable) {
                db.collection('person_reg')
                .add(newPerson)
                .then(() => {
                    alertPopup('Person Registrert!', true);
                })} else {
                alertPopup('Person ikke registrert, prøv igjen.', false)
            }
		});
};

form.addEventListener("submit", e => {
	e.preventDefault()
	const docFornavn = document.querySelector('#navn').value;
	const docEtternavn = document.querySelector('#etternavn').value
	const docPersonnummer = document.querySelector('#fødselsnummer').value
	const docPostadresse = document.querySelector('#postadresse').value
	const newPerson = {
		Fornavn: docFornavn,
		Etternavn: docEtternavn,
		Personnummer: docPersonnummer,
		Postadresse: docPostadresse,
	}
addPerson(newPerson)
});

db.collection('person_reg').onSnapshot(snapshot => {
	const docs = snapshot.docChanges()
	docs.forEach(doc => {
		if (doc.type == "added") {
			const docdata = doc.doc.data()
			const id = doc.doc.id
			const fornavn = docdata.Fornavn
			const etternavn = docdata.Etternavn

			list.innerHTML += `<li data-id="${id}">${fornavn} ${etternavn}</li>`
		}
	});
}); 

list.addEventListener("click", e => {
	const id = e.target.getAttribute("data-id");
	sessionStorage.setItem("key", id);
	window.location.href = "person.html";
});