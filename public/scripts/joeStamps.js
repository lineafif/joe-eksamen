// joeStamps.js

// Eksempel på stempler (kan tilpasses eller hentes fra en API)
const stamps = [
    { src: './static/img/Stempler/lillehavfrue.png', title: 'Copenhagen' }, //bare eksempel, nedenstående ska have logo/titel
    { src: './static/img/Stempler/HCAHus.png', title: 'Odense' },
    { src: './static/img/Stempler/Koldinghus.png', title: 'Kolding' },
    { src: './static/img/Stempler/RoskildeVikingMuseum.png', title: 'Roskilde' },
    // Jeg tilføjer stmeplerne her
  ];
  
  function displayStamps() {
    const stampList = document.querySelector('.stamp-list');
  
    stamps.forEach(stamp => {
        const stampItem = document.createElement('div');
        stampItem.className = 'stamp-item';
        
        stampItem.innerHTML = `
            <img src="${stamp.src}" alt="${stamp.title}">
            <h3>${stamp.title}</h3>
        `;
        
        stampList.appendChild(stampItem);
    });
  }
  
  // Kald funktionen for at vise stemplerne
  displayStamps();