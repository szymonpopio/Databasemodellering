const id = localStorage.getItem("key");
const list = document.querySelector('ul');

db.collection("person_reg").doc(id).get().then(res => {
	const response = res.data()
	const fornavn = response.Fornavn
	const etternavn = response.Etternavn
	const personnummer = response.Personnummer
	const poststed = response.Postadresse

	list.innerHTML += `
	<li>Fornavn: ${fornavn}</li>
	<li>Etternavn: ${etternavn}</li>
	<li>Personnummer: ${personnummer}</li>
	<li>Postadresse: ${poststed}</li>`
});