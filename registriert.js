
function registriertAnzeigeAbgeschlossen() {
    // Überprüfen, ob formData im Local Storage vorhanden ist
    if (localStorage.getItem('formData')) {
        // formData abrufen und in einer Variable speichern
        const formData = JSON.parse(localStorage.getItem('formData'));
        let titel = formData[`title`];
        titel = titel.toUpperCase().charAt(0) + titel.slice(1)
        document.getElementById(`registriertName`).innerText = "Name: " + titel + " " + formData[`vorname`] + " " + formData[`nachname`];
        document.getElementById('registriertEmail').innerText = "E-Mail: " + formData[`email`];
        
        if (formData[`phone`] != "") {
            document.getElementById(`registriertPhone`).innerText = "Telefon-Nummer: " + formData[`phone`];
        }

        if (formData[`sammeldienstAbfrage`] == `sammeldienst`) {
            //Sicherheitsvorkehrung -> Validierung müsste leere Felder hier abfangen
            if (formData[`strasse`] != "" && formData[`hausnummer`] != "" && formData[`plz`] != "" && formData[`ort`] != "") {
                document.getElementById(`registriertAdresse`).innerText = 
                    "Ihre Adresse: " + 
                    formData[`strasse`] + " " + 
                    formData[`hausnummer`] + ",  " + 
                    formData[`plz`] + " " +
                    formData[`ort`];
            }
        }

        if (formData[`kommentar`] != "") {
            document.getElementById(`existiertKommentar`).innerHTML = "Ihr Kommentar an uns: "
            document.getElementById(`registriertKommentar`).innerText = formData[`kommentar`];
        }

        if (Number(formData[`anzahl`]) == 1) {
            document.getElementById(`registriertAnzahlPakete`).innerText = formData[`anzahl`] + " Paket / Tüte mit folgender Kleidung:";
        }
        else {
            document.getElementById(`registriertAnzahlPakete`).innerText = formData[`anzahl`] + " Pakete / Tüten mit folgender Kleidung:";
        }

        const kleider = formData[`kleider`];
        let kleiderAktiv = "";

        Object.entries(kleider).forEach(([key, value]) => {
            if (kleider[key]) {
                kleiderAktiv += key.toUpperCase().charAt(0) + key.slice(1) + ", ";
            }
        });
        //Entferne letztes , 
        kleiderAktiv = kleiderAktiv.slice(0, -2);
        document.getElementById(`registriertKleidung`).innerText = kleiderAktiv;

        if (formData[`krisengebiet`] == "unbestimmt") {
            document.getElementById(`registriertKrisengebiet`).innerText = "Sie haben uns die Auswahl des Krisengebietes überlassen!"
        }
        else {
            let krisengebiet = formData[`krisengebiet`];
            krisengebiet = krisengebiet.toUpperCase().charAt(0) + krisengebiet.slice(1)
            document.getElementById(`registriertKrisengebiet`).innerText = "Das Krisengebiet für Ihre Spende ist: " + krisengebiet;
        }

        if (formData[`sammeldienstAbfrage`] == `sammeldienst`) {
            document.getElementById(`abgabeMethode`).innerText = "Abgabe-Methode: Sammeldienst";
            document.getElementById(`registriertAbgabe`).innerText = "Es wird sich bald jemand telefonisch bei Ihnen melden, um die weitere Organisation zu besprechen!"
        }
        else {
            document.getElementById(`abgabeMethode`).innerText = "Abgabe-Methode: Persönliche Abgabe";
            document.getElementById(`registriertAbgabe`).innerText = "Unsere Abgabestelle befindet sich in der Musterstraße 123, 20095 Hamburg. Die Öffnungszeiten sind Mo.- Sa. 10-17 Uhr. Vor Ort können Sie mithilfe Ihrer E-Mail-Adresse Ihre Angaben aufrufen."
        }

        if (formData[`registrierOrt`] == "") {
            document.getElementById(`registriertDatum`).innerText = formData[`registrierDatum`] + " um " + formData[`registrierZeit`] + " Uhr";
        }
        else {
            document.getElementById(`registriertDatum`).innerText = formData[`registrierOrt`] +  ", der " + formData[`registrierDatum`] + " um " + formData[`registrierZeit`] + " Uhr";
        }

        console.log(formData);

    } else {
        console.log('Es gibt keine formData im Local Storage.');
    }
}

window.onload = registriertAnzeigeAbgeschlossen();
