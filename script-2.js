document.addEventListener('DOMContentLoaded', function () {
  // Event-Listener für den Button hinzufügen
  document.getElementById('add-box-button').addEventListener('click', openPopup);
  document.getElementById('closePopup').addEventListener('click', closePopup);
  document.getElementById('submitData').addEventListener('click', submitData);
  // Event-Listener für den Zurück-Button hinzufügen
  /*
  document.getElementById('back-button').addEventListener('click', function () {
    window.history.back(); // Zurück zur vorherigen Seite
  });
  */
  // Event-Listener für Klicks auf die Boxen hinzufügen
  var boxes = document.querySelectorAll('.craftsman-box');
  boxes.forEach(function (box) {
    box.addEventListener('click', function () {
      var companyId = box.dataset.companyId; // ID der Firma aus dem Datenattribut erhalten
      // Hier kannst du die Firma laden und die entsprechenden Informationen anzeigen
      loadCompanyDetails(companyId);
    });
  });
  // Event-Listener für Kategorien im Dropdown hinzufügen
  var categoryLinks = document.querySelectorAll('.dropdown-content a');
  categoryLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openPopup(link.dataset.category);
    });
  });

  // Laden der Firmendetails
  //loadCompanyDetails();

  // Event-Listener für Zurück-Button hinzufügen
  /*
  document.getElementById('back-button').addEventListener('click', function () {
    window.history.back(); // Zurück zur vorherigen Seite
  });
  */

  // Event-Listener für Sterne hinzufügen
  var stars = document.querySelectorAll('.star');
  stars.forEach(function (star) {
    star.addEventListener('click', function () {
      var rating = parseInt(star.dataset.rating); // Bewertungswert aus dem Datenattribut erhalten
      // Hier kannst du die Bewertung verarbeiten, z.B. an einen Server senden
      console.log('Bewertung:', rating);
    });
  });

  // Event-Listener für Bewertungsabsenden hinzufügen
  /*
  document.getElementById('submit-review').addEventListener('click', function () {
    var reviewText = document.getElementById('review-text').value; // Bewertungstext erhalten
    // Hier kannst du den Bewertungstext verarbeiten, z.B. an einen Server senden
    console.log('Bewertungstext:', reviewText);
  });
  */

  // Laden der Firmen
  loadCompanies();
});

// Funktion zum Anzeigen der Firmendetails
function displayCompanyDetails(company) {
  // Hier könntest du den HTML-Code für die Anzeige der Firmendetails generieren und in das DOM einfügen
}

// Funktion zum Laden der Firmendetails
function loadCompanyDetails() {
  // Simulierte Daten für die Handwerkerbox
  var company = {
    name: 'Firma XYZ',
    category: 'Schreiner',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    services: ['Möbelbau', 'Innenausbau'],
    location: 'Berlin, Deutschland',
    logo: 'logo.png',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24285.67829925695!2d13.37770429431232!3d52.51698701994484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDM4JzEyLjYiTiAxM8KwMDgnMTAuMCJF!5e0!3m2!1sen!2sde!4v1646349830464!5m2!1sen!2sde'
  };

  var companyDetailsContainer = document.getElementById('company-details-container');
  var html = `
    <div id="company-details">
      <img src="${company.logo}" alt="Firmenlogo">
      <h2>${company.name}</h2>
      <p>Kategorie: ${company.category}</p>
      <p>Beschreibung: ${company.description}</p>
      <p>Standort: ${company.location}</p>
      <p>Angebotene Dienstleistungen: ${company.services.join(', ')}</p>
      <iframe src="${company.mapUrl}" width="100%" height="300" frameborder="0" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>
  `;
  companyDetailsContainer.innerHTML = html; // Füge HTML-Inhalt in den Container ein
}

// Funktion zum Öffnen des Popup-Fensters für das Hinzufügen einer neuen Handwerkerbox
function openPopup(selectedCategory) {
  document.getElementById('overlay').style.display = 'flex';
  // Setze die ausgewählte Kategorie im Popup
  document.getElementById('category').value = selectedCategory || '';
}

// Funktion zum Schließen des Popup-Fensters
function closePopup() {
  document.getElementById('overlay').style.display = 'none';
  // Zurücksetzen der ausgewählten Kategorie im Popup und Felder leeren
  document.getElementById('category').value = '';
  document.getElementById('companyName').value = '';
  document.getElementById('location').value = '';
  document.getElementById('shortDescription').value = '';
}

// Funktion zum Hinzufügen einer neuen Handwerkerbox
async function submitData() {
  // Daten aus den Eingabefeldern abrufen
  var companyName = document.getElementById('companyName').value;
  var location = document.getElementById('location').value;
  var category = document.getElementById('category').value;
  var shortDescription = document.getElementById('shortDescription').value;

  // Überprüfen, ob alle Felder ausgefüllt sind
  if (companyName.trim() === '' || location.trim() === '' || category.trim() === '' || shortDescription.trim() === '') {
    alert('Bitte füllen Sie alle Felder aus.');
    return; // Beende die Funktion, wenn nicht alle Felder ausgefüllt sind
  }

  // Daten an die API senden
  try {
    const response = await fetch('https://crafttune.de/cgi-bin/db.py/companies/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Name: companyName,
        Standort: location,
        Kategorie: category,
        Kurzbeschreibung: shortDescription
      })
    });

    if (!response.ok) {
      throw new Error('Fehler beim Anlegen der neuen Firma');
    }

    const newCompany = await response.json();

    // Beispiel: Daten in einer neuen Box anzeigen
    addCraftsmanBox(newCompany.Name, newCompany.Standort, newCompany.Kategorie, newCompany.Kurzbeschreibung, newCompany.ID);

    // Schließe das Popup
    closePopup();
  } catch (error) {
    console.error('Fehler beim Anlegen der neuen Firma:', error);
  }
}

// Funktion zum Hinzufügen einer Handwerkerbox
function addCraftsmanBox(companyName, location, category, shortDescription) {
  // Überprüfe, ob ein Container für die Kategorie bereits existiert
  let categoryContainer = document.querySelector(`.craftsman-category[data-category="${category}"]`);

  // Wenn kein Container existiert, erstelle einen neuen
  if (!categoryContainer) {
    categoryContainer = document.createElement('div');
    categoryContainer.className = 'craftsman-category';
    categoryContainer.dataset.category = category;
    document.getElementById('craftsman-box-container').appendChild(categoryContainer);
  }

  // Neue Box erstellen
  var newCraftsmanBox = document.createElement('div');
  newCraftsmanBox.className = 'craftsman-box';

  // Inhalt der Box
  newCraftsmanBox.innerHTML = `
    <h3>${companyName}</h3>
    <p>Standort: ${location}</p>
    <p>Kategorie: ${category}</p>
    <p>Kurzbeschreibung: ${shortDescription}</p>
  `;

  // Box zum Kategorien-Container hinzufügen
  categoryContainer.appendChild(newCraftsmanBox);
}

/*
document.addEventListener('DOMContentLoaded', function () {
  // Event-Listener für den Button zum Wechseln zwischen den Portalen hinzufügen
  document.getElementById('business-portal').addEventListener('click', function () {
    togglePortal('business');
  });
  document.getElementById('consumer-portal').addEventListener('click', function () {
    togglePortal('consumer');
  });
});
*/

// Funktion zum Wechseln zwischen den Portalen
function togglePortal(portal) {
  if (portal === 'business') {
    document.getElementById('business-portal').classList.add('active');
    document.getElementById('consumer-portal').classList.remove('active');
    // Hier den Code einfügen, um zum Geschäftskundenportal zu wechseln
  } else if (portal === 'consumer') {
    document.getElementById('consumer-portal').classList.add('active');
    document.getElementById('business-portal').classList.remove('active');
    // Hier den Code einfügen, um zum Privatkundenportal zu wechseln
  }
}
// JavaScript zum Umschalten zwischen Geschäfts- und Privatkunden
document.getElementById('customer-toggle').addEventListener('change', function () {
  // Hier kannst du die Logik für den Wechsel zwischen Geschäftskunden und Privatkunden implementieren
  if (this.checked) {
    // Geschäftskunden ausgewählt
    console.log('Geschäftskunden ausgewählt');
  } else {
    // Privatkunden ausgewählt
    console.log('Privatkunden ausgewählt');
  }
});



async function loadCompanies() {
  // Container für die Handwerkerboxen
  const craftsmanBoxContainer = document.getElementById("craftsman-box-container");

  try {
    // Firmen laden und anzeigen
    const response = await fetch("https://crafttune.de/cgi-bin/db.py/companies/");
    const data = await response.json();

    data.forEach(company => {
      const companyLink = document.createElement("a");
      companyLink.href = "craftman-box.html";

      const companyBox = document.createElement("div");
      companyBox.classList.add("craftsman-box");
      companyBox.setAttribute("data-company-id", company.ID);

      const img = document.createElement("img");
      img.src = "example-image.jpg";  // Sie können hier den tatsächlichen Bildpfad verwenden
      img.alt = `Bild der Firma ${company.Name}`;

      const h3 = document.createElement("h3");
      h3.textContent = company.Name;

      const location = document.createElement("p");
      location.textContent = `Standort: ${company.Standort}`;

      const category = document.createElement("p");
      category.textContent = `Kategorie: ${company.Kategorie}`;  // Hier wird der tatsächliche Kategoriename angezeigt

      const shortDescription = document.createElement("p");
      shortDescription.textContent = `Kurzbeschreibung: ${company.Kurzbeschreibung}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Löschen";
      deleteButton.classList.add("delete-button");
      deleteButton.setAttribute("data-company-id", company.ID);
      deleteButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (confirm('Sind Sie sicher, dass Sie diese Firma löschen möchten?')) {
          deleteCompany(company.ID);
        }
      });

      companyBox.appendChild(img);
      companyBox.appendChild(h3);
      companyBox.appendChild(location);
      companyBox.appendChild(category);
      companyBox.appendChild(shortDescription);
      companyBox.appendChild(deleteButton);

      companyLink.appendChild(companyBox);
      craftsmanBoxContainer.appendChild(companyLink);
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
}

async function deleteCompany(companyId) {
  try {
    const response = await fetch(`https://crafttune.de/cgi-bin/db.py/companies/${companyId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Firma');
    }

    const result = await response.json();
    if (result.success) {
      // Entferne die Box der gelöschten Firma aus dem DOM
      const companyBox = document.querySelector(`.craftsman-box[data-company-id="${companyId}"]`);
      if (companyBox) {
        companyBox.closest('a').remove();
      }
    } else {
      alert('Fehler beim Löschen der Firma');
    }
  } catch (error) {
    console.error('Fehler beim Löschen der Firma:', error);
  }
}