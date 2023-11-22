//Anzeige verschiedener Alternativen je nach Auswahl
function anzeigeSammeldienst() {
    let sammeldienstChecked = document.getElementById('sammeldienst').checked;
    let sammeldienstAktiv = document.getElementById('sammeldienstAktiv');
    let abgabeAktiv = document.getElementById(`abgabeAktiv`);

    let strasse = document.getElementById('strasse');
    let nummer = document.getElementById('hausnummer');
    let plz = document.getElementById('plz');
    let ort = document.getElementById('ort');
    let phone = document.getElementById(`phone`);

    if (sammeldienstChecked) {
      sammeldienstAktiv.style.display = 'block';
      abgabeAktiv.style.display = `none`;
      strasse.required = true;
      nummer.required = true;
      plz.required = true;
      ort.required = true;
      phone.required = true;
    } else {
      //Setze Input-Felder für die Adressen zurück, da diese nun nicht mehr benötigt werden
      sammeldienstAktiv.style.display = 'none';
      abgabeAktiv.style.display = `block`;
      strasse.required = false;
      strasse.value = "";
      nummer.required = false;
      nummer.value = "";
      plz.required = false;
      plz.value = "";
      plz.setCustomValidity('');
      ort.required = false;
      ort.value = "";
      phone.required = false;
    }
}

function validatePLZ(value, element) {
    // Überprüfen, ob die PLZ in 20--- Hamburg liegt
    let validPLZ = /^20\d{3}$/.test(value);

    // Anzeige der Fehlermeldung je nach Validierungsergebnis
    if (validPLZ) {
        element.setCustomValidity('');
    } else {
        element.setCustomValidity('Die PLZ muss in 20--- Hamburg liegen, damit wir Ihre Spende abholen können!');
    }
}


function validateCheckboxes() {
    // Hole alle Checkboxen mit dem Namen "selectedCheckboxes"
    const checkboxes = document.querySelectorAll('input[name="kleiderCheckboxes"]');
      
    // Überprüfe, ob mindestens eine Checkbox ausgewählt ist
    const atLeastOneSelected = Array.from(checkboxes).some(checkbox => checkbox.checked);

    // Zeige eine Meldung, wenn keine Checkbox ausgewählt ist
    if (!atLeastOneSelected) {
      checkboxes.forEach(checkbox => {
        checkbox.setCustomValidity("Bitte wähle mindestens ein Kleidungsstück aus!");
      })
    } else {
      // Hier könntest du das Formular absenden oder weitere Aktionen durchführen
      checkboxes.forEach(checkbox => {
        checkbox.setCustomValidity("");
      })
    }
}

// Funktion zum Zurücksetzen des Formulars
function resetForm() {
    document.getElementById('registrierungsFormular').reset();
    anzeigeSammeldienst();
  }

window.onload = anzeigeSammeldienst();

// Bootstrap Validierung der Daten
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


//Hinzufügen Eingaben zum lokalen Speicher
document.getElementById(`registrierungsFormular`).addEventListener(`submit`, function(event) {
    validateCheckboxes(event);
    if(!document.getElementById(`registrierungsFormular`).checkValidity()) {
      document.getElementById(`registrierungsFormular`).reportValidity();
    }
    else {
      //Speichern der Eingaben im Local Storage
      const registrierungsFormular = document.getElementById(`registrierungsFormular`);
      const formData = {};
      const kleiderCheckboxesList = {};

      for (const element of registrierungsFormular.elements) {
        // Element der Gruppe kleiderCheckboxes
        if (element.name == `kleiderCheckboxes`) {
          kleiderCheckboxesList[element.value] = element.checked;
        }
        else if (element.type == `radio`) {
          if (element.checked) {
            formData[element.name] = element.value;
          }
        }
        else if (element.name) {
          // Wenn es eine Checkbox ist, speichere einen booleschen Wert abhängig vom checked-Zustand
          formData[element.name] = (element.type === 'checkbox') ? element.checked : element.value;
        }
      }
      formData[`kleider`] = kleiderCheckboxesList;

      let datum = new Date();
      let registrierDatum = datum.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
      let registrierZeit = formatZeroes(datum.getHours()) + ":" + formatZeroes(datum.getMinutes()) + ":" + formatZeroes(datum.getSeconds());
      formData[`registrierZeit`] = registrierZeit;
      formData[`registrierDatum`] = registrierDatum;

      let registrierOrt = "";
      if (formData[`ort`] != "") {
        registrierOrt = formData[`ort`];
      }
      formData[`registrierOrt`] = registrierOrt;

      localStorage.setItem('formData', JSON.stringify(formData));
      console.log('Formulardaten im Local Storage:', formData);
      event.preventDefault();
      window.location.href = "./registriert.html"

      //Anpassung Darstellung Zeit
      function formatZeroes(time) {
        time = time.toString();
        return time.length < 2 ? "0" + time : time;
    }
    }
  })
