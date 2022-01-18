const form = document.querySelector('form');
const list = document.querySelector('ul');
const popupList = document.querySelector('.popupList');

form.addEventListener("submit", e => {
	e.preventDefault();
	const postNumber = document.querySelector("#Postnummer").value;
    const postOffice = document.querySelector("#Poststed").value;
    const streetName = document.querySelector("#Gatenavn").value;
    const streetNumber = document.querySelector("#Gatenummer").value;
    const houseNumber = document.querySelector("#Eiendomsnummer").value;
    const owner = document.querySelector("#eier").value;

    const newProperty = {
        Postnummer: postNumber,
        Poststed: postOffice,
        Gatenavn: streetName,
        Gatenummer: streetNumber,
        Eiendomsnummer: houseNumber,
        Eier: owner
    };

    let isPersonReal = false;

        db.collection('person_reg')
        .get()
        .then(snapshot => {
            const docs = snapshot.docs;
            docs.forEach(doc => {
                const docPersonnummer = doc.data().Personnummer;

                if (docPersonnummer === owner) {
                    isPersonReal = true;

                    db.collection('eiendom_reg')
                    .get()
                    .then(snapshot => {
                    const docs = snapshot.docs;
                    let isAvailable = true;

                    docs.forEach(doc => {
                        const docpostNumber = doc.data().Postnummer;
                        const docpostOffice = doc.data().Poststed;
                        const docstreetName = doc.data().Gatenavn;
                        const docstreetNumber = doc.data().Gatenummer;
                        const dochouseNumber = doc.data().Eiendomsnummer;

                        const docPropertyAddress = `${docpostNumber}, ${docpostOffice}, ${docstreetName}, ${docstreetNumber}, ${dochouseNumber}`;
                        const propertyAddress = `${postNumber}, ${postOffice}, ${streetName}, ${streetNumber}, ${houseNumber}`;

                        if (docPropertyAddress === propertyAddress) isAvailable = false;
                    });

                    if (isAvailable && isPersonReal) {
                        db.collection('eiendom_reg')
                            .add(newProperty)
                            .then(() => alertPopup('Eiendom Registrert', true));
                    } else {
                        alertPopup('Eiendom er ikke tilgjengelig', false);
                    }})
                }
            })
        });
});

db.collection('eiendom_reg').onSnapshot(snapshot => {
	const docs = snapshot.docChanges()

	docs.forEach(doc => {
		if (doc.type == "added") {
			const docdata = doc.doc.data()
			const id = doc.doc.id
			const docpostNumber = docdata.Postnummer;
			const docpostOffice = docdata.Poststed;
			const docstreetName = docdata.Gatenavn;
			const docstreetNumber = docdata.Gatenummer;
			const dochouseNumber = docdata.Eiendomsnummer;
            const docOwner = docdata.Eier;
			const docPropertyAddress = `${docpostNumber}, ${docpostOffice}, ${docstreetName} ${docstreetNumber}, ${dochouseNumber}`;

			list.innerHTML += `<li data-id="${id}">${docPropertyAddress} <span class="foreignKey">${docOwner}</span></li>`
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

popupList.addEventListener('click', e => {
	if (e.target.classList.contains('closerList')) {
		closePopup(true)
	}
})
