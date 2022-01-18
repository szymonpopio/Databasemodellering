const form = document.querySelector('form');
const list = document.querySelector('ul');
const popupList = document.querySelector('.popupList');

// const newVehicle = {
// 		Registreringsnummer: regNumber,
// 		Registreringsår: regYear,
// 		Drivstofftype: fuelType,
// 		Antallseter: seats,
// 		Eier: owner
// };

form.addEventListener("submit", e => {
	e.preventDefault();
	const regNumber = document.querySelector("#registreringsnummer").value;
	const regYear = document.querySelector("#registreringsår").value;
	const fuelType = document.querySelector("#drivstofftype").value;
	const seats = document.querySelector("#antallseter").value;
	const owner = document.querySelector("#eier").value;

	const newVehicle = {
		Registreringsnummer: regNumber,
		Registreringsår: regYear,
		Drivstofftype: fuelType,
		Antallseter: seats,
		Eier: owner
	};

	let isPersonReal = false;
        db.collection('person_reg')
        .get()
        .then(snapshot => {
            const docs = snapshot.docs;
            docs.forEach(doc => {
				let isPersonReal = false;
                const docPersonnummer = doc.data().Personnummer;
                if (docPersonnummer === owner) {
                    isPersonReal = true;

					db.collection('kjøretøy_reg')
					.get()
					.then(snapshot => {
						const docs = snapshot.docs;
						let isAvailable = true;
						docs.forEach(doc => {
							const docRegNumber = doc.data().Registreringsnummer;
							if (docRegNumber === regNumber) isAvailable = false;
							console.log(isAvailable, isPersonReal);
						});
						if (isAvailable && isPersonReal) {
							db.collection('kjøretøy_reg')
							.add(newVehicle)
							.then(() => {
								alertPopup('Kjøretøy Registrert', true);
							});
						} else {
							alertPopup('Kjøretøy utilgjengelig', false)
						}
					});
                }
            })
        });
});

db.collection('kjøretøy_reg').onSnapshot(snapshot => {
	const docs = snapshot.docChanges()

	docs.forEach(doc => {
		if (doc.type == "added") {
			const docdata = doc.doc.data()
			const id = doc.doc.id
			const reg_nummer = docdata.Registreringsnummer
			const reg_år = docdata.Registreringsår
			const drivstoff = docdata.Drivstofftype
			const seter = docdata.Antallseter
			const eier = docdata.Eier

			list.innerHTML += `<li data-id="${id}">${reg_nummer} ${reg_år} ${drivstoff} ${seter} <span class ="foreignKey">${eier}</span></li>`
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

