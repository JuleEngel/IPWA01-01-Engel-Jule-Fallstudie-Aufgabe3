/*
    Student: Jule Engel
    Modul: IPWA01-01 - Programmierung von Webanwendungen
    Aufgabe: Fallstudie, Aufgabe 3
*/


//Anzeige verschiedener Alternativen je nach Auswahl Abholung / Abgabe.
// Wird jedes Mal aktiviert, wenn zwischen Abholung und Abgabe gewechselt wird.
//Aufgabe 3.b.g
function anzeigeSammeldienst() {
    let sammeldienstChecked = document.getElementById('sammeldienst').checked;
    let sammeldienstAktiv = document.getElementById('sammeldienstAktiv');
    let abgabeAktiv = document.getElementById(`abgabeAktiv`);

    let strasse = document.getElementById('strasse');
    let nummer = document.getElementById('hausnummer');
    let plz = document.getElementById('plz');
    let ort = document.getElementById('ort');
    let phone = document.getElementById(`phone`);

    //Bei Abholung durch Sammeldienst stelle Adress-Einstellungen auf sichtbar.
    //Die Telefon-Nummer wird bei einer Abholung für organisatorische Zwecke angefordert.
    if (sammeldienstChecked) {
      sammeldienstAktiv.style.display = 'block';
      abgabeAktiv.style.display = `none`;
      strasse.required = true;
      nummer.required = true;
      plz.required = true;
      ort.required = true;
      phone.required = true;
    } 
    //Setze Input-Felder für die Adressen zurück, da diese nun nicht mehr benötigt werden; modifiziere Sichtbarkeit.
    else {
      sammeldienstAktiv.style.display = 'none';
      abgabeAktiv.style.display = `block`;
      strasse.required = false;
      strasse.value = "";
      nummer.required = false;
      nummer.value = "";
      plz.required = false;
      plz.value = "";
      //Da die Plz individuell validiert wird, muss der Wert hier zurückgesetzt werden.
      plz.setCustomValidity('');
      ort.required = false;
      ort.value = "";
      phone.required = false;
    }
}


//Überprüfung der Postleitzahl; 
//Aufgabe 3.b.h
function validatePLZ(value, element) {
    //Überprüfen, ob die PLZ in 20--- Hamburg liegt
    let validPLZ = /^20\d{3}$/.test(value);

    //Anzeige der Fehlermeldung je nach Validierungsergebnis
    if (validPLZ) {
        element.setCustomValidity('');
    } else {
        element.setCustomValidity('Die PLZ muss in 20--- Hamburg liegen, damit wir Ihre Spende abholen können!');
    }
}

//Die Funktion überprüft, ob mindestens eine Art von Kleidung für die Spende ausgewählt wurde.
function validateCheckboxes() {
    //Hole alle Checkboxen mit dem Namen "selectedCheckboxes".
    const checkboxes = document.querySelectorAll('input[name="kleiderCheckboxes"]');
      
    //Überprüfe, ob mindestens eine Checkbox ausgewählt ist.
    const atLeastOneSelected = Array.from(checkboxes).some(checkbox => checkbox.checked);

    //Zeige eine Meldung, wenn keine Checkbox ausgewählt ist -> Validierung fehlgeschlagen.
    if (!atLeastOneSelected) {
      checkboxes.forEach(checkbox => {
        checkbox.setCustomValidity("Bitte wähle mindestens ein Kleidungsstück aus!");
      })
    } else {
      //Validierung erfolgreich.
      checkboxes.forEach(checkbox => {
        checkbox.setCustomValidity("");
      })
    }
}


// Funktion zum Zurücksetzen des Formulars -> wird benötigt, um die Anzeigeeinstellungen für Abholung / Abgabe zurückzusetzen.
function resetForm() {
    document.getElementById('registrierungsFormular').reset();
    //Setzt Anzeige zurück und leert die Felder.
    anzeigeSammeldienst();
  }
//Verhindert Anzeige-Fehler beim Neuladen des Fensters.
window.onload = anzeigeSammeldienst();


//Bootstrap Validierung der Daten.
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
  
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


//Hinzufügen der Eingaben zum lokalen Speicher, um sie nach erfolgreicher Registrierung anzeigen zu lassen.
//Event-Listener reagiert auf Submit-Button.
//Aufgabe 3.b.i
document.getElementById(`registrierungsFormular`).addEventListener(`submit`, function(event) {
    //Vor der Speicherung der Angaben wird überprüft, ob alle Eingaben Valide sind. Bei Fehler wird eine Meldung ausgegeben.
    validateCheckboxes(event);
    if(!document.getElementById(`registrierungsFormular`).checkValidity()) {
      document.getElementById(`registrierungsFormular`).reportValidity();
    }
    //Speichern der Eingaben im Local Storage.
    else {
      const registrierungsFormular = document.getElementById(`registrierungsFormular`);
      const formData = {};
      const kleiderCheckboxesList = {};

      for (const element of registrierungsFormular.elements) {
        //Elemente der Gruppe kleiderCheckboxes für die Angabe der Kleidungsart.
        if (element.name == `kleiderCheckboxes`) {
          //Es werden alle Elemente mitsamt der Boolean-Werte in einem extra Object gespeichert.
          kleiderCheckboxesList[element.value] = element.checked;
        }
        //Elemente von "radio"-Eingaben.
        else if (element.type == `radio`) {
          //Es wird nur das aktive Element gespeichert.
          if (element.checked) {
            formData[element.name] = element.value;
          }
        }
        //Speicherung der restlichen Elemente.
        else if (element.name) {
          //Wenn es eine Checkbox ist, speichere einen booleschen Wert abhängig vom checked-Zustand.
          formData[element.name] = (element.type === 'checkbox') ? element.checked : element.value;
        }
      }
      //Die Liste mit der Auswahl der Kleidung wird nun unter dem key "kleider" gespeichert.
      formData[`kleider`] = kleiderCheckboxesList;

      //Speicherung Datum und Uhrzeit der Registrierung.
      let datum = new Date();
      //Formatierung zur besseren Lesbarkeit.
      let registrierDatum = datum.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
      let registrierZeit = formatZeroes(datum.getHours()) + ":" + formatZeroes(datum.getMinutes()) + ":" + formatZeroes(datum.getSeconds());
      formData[`registrierZeit`] = registrierZeit;
      formData[`registrierDatum`] = registrierDatum;

      //Wenn ein Ort in der Registrierung angegeben wurde, wird er hier gespeichert.
      let registrierOrt = "";
      if (formData[`ort`] != "") {
        registrierOrt = formData[`ort`];
      }
      formData[`registrierOrt`] = registrierOrt;

      //Speichere die Datei `formData` mit den Nutzer-Eingaben im lokalen Speicher.
      localStorage.setItem('formData', JSON.stringify(formData));
      //Verhindere das ursprüngliche Verhalten, um ein reines Neu-Laden der Seite mit den Eingabe-Feldern in der Adressleiste zu verhindern.
      //Dies ist notwendig, da keine explizite Methode der Datenverarbeitung genannt wurde und somit standardmäßig "Pre" genommen wird.
      //Post wäre hierbei sicherer, benötigt allerdings serverseitige Anbindungen, die nicht Teil der Aufgabenstellung sind.
      //Mehr Informationen in der Fallstudie.
      event.preventDefault();
      //Weiterleitung nach erfolgreicher Registrierung
      window.location.href = "./registriert.html"

      //Anpassung Darstellung Zeit für einstellige Werte.
      function formatZeroes(time) {
        time = time.toString();
        return time.length < 2 ? "0" + time : time;
    }
    }
  })
