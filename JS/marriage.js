const reg_ekteskap = document.querySelector('.ekteskap_register');
const list = document.querySelector('ul');
const form = document.querySelector('form');
const form_div = document.querySelector('.form_div');
const selectElement = document.querySelector('#dropdown');
const popupList = document.querySelector('.popupList');

function addMarriage(marriageObject, person1, person2) {
	db.collection('ekteskap_reg')
		.get()
		.then(snapshot => {
			const docs = snapshot.docs
			let isAvailable = true

			docs.forEach(doc => {
				const docPerson1 = doc.data().person1fødselsnummer
				const docPerson2 = doc.data().person2fødselsnummer
				if (person1 === docPerson1 || person2 === docPerson1 || person1 === docPerson2 || person2 === docPerson2) {
					isAvailable = false;
				}
			});
			if (isAvailable) {
				db.collection('ekteskap_reg')
					.add(marriageObject)
					.then(() => alertPopup('Ekteskap registrert', true));
			} else {
				alertPopup('En person allerede gift', false);
			}
		});
};

form.addEventListener("submit", e => {
	e.preventDefault()
	const partner_1 = document.querySelector('#partner_1').value;
	const partner_2 = document.querySelector('#partner_2').value;

	const object = {
		person1fødselsnummer: partner_1,
		person2fødselsnummer: partner_2
	}
addMarriage(object, partner_1, partner_2)
});

db.collection('ekteskap_reg').onSnapshot(snapshot => {
	const docs = snapshot.docChanges()

	docs.forEach(doc => {
		if (doc.type == "added") {
			const docdata = doc.doc.data()
			const id = doc.doc.id
			const person1 = docdata.person1fødselsnummer
			const person2 = docdata.person2fødselsnummer

			list.innerHTML += `<li data-id="${id}"><span class="foreignKey">${person1}</span>, <span class ="foreignKey2">${person2}</span></li>`
		}
	});
});

list.addEventListener("click", e => {
	if (e.target.classList.contains("foreignKey")) {
		db.collection("person_reg").where("Personnummer", "==", e.target.textContent)
		.get()
		.then(res => {
			const object = res.docs[0].data()
			const fornavn = object.Fornavn
			const etternavn = object.Etternavn
			const personnummer = object.Personnummer
			const postadresse = object.Postadresse
			popupList.style.display = "block";
			popupList.innerHTML = `
			<li>${fornavn}</li>
			<li>${etternavn}</li>
			<li>${personnummer}</li>
			<li>${postadresse}</li>
			<li class="closerList">X</li>`
		})
	}
});

list.addEventListener("click", e => {
	if (e.target.classList.contains("foreignKey2")) {
		db.collection("person_reg").where("Personnummer", "==", e.target.textContent)
		.get()
		.then(res => {
			const object = res.docs[0].data()
			const fornavn = object.Fornavn
			const etternavn = object.Etternavn
			const personnummer = object.Personnummer
			const postadresse = object.Postadresse
			popupList.style.display = "block";
			popupList.innerHTML = `
			<li>${fornavn}</li>
			<li>${etternavn}</li>
			<li>${personnummer}</li>
			<li>${postadresse}</li>
			<li class="closerList">X</li>`
		})
	}
});

popupList.addEventListener('click', e => {
	if (e.target.classList.contains('closerList')) {
		closePopup(true)
	}
})