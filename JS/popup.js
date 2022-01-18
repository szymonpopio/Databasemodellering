const popup = document.querySelector('.popup');
const closer = document.querySelector('.closer');

function alertPopup(message, isSuccess) {
	popup.children[0].textContent = message;
	popup.style.display = 'block';
	if (isSuccess) {
		popup.style.background = 'limegreen';
	} else {
		popup.style.background = 'red';
	}
}

function closePopup(isList) {
	if (isList === true) {
		document.querySelector('.popupList').style.display = 'none';
	} else {
	popup.style.display = 'none';
	}
}
closer.addEventListener('click', closePopup);