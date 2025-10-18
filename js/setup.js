function setupDateInserts() {
    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');
    if (date !== null) {
      Array.from(document.getElementsByClassName('date')).forEach(el => el.textContent = date);
    }
}

function setup() {
    setupDateInserts();
}