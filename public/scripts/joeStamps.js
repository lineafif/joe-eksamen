// Eksempel på stempler (kan tilpasses eller hentes fra en API)
const stamps = [
  { src: 'static/img/Stempler/lillehavfrue.png', title: 'København' },
  { src: '/static/img/Stempler/HCAHus.png', title: 'Odense' },
  { src: '/static/img/Stempler/Koldinghus.png', title: 'Kolding' },
  { src: 'static/img/Stempler/RoskildeVikingMuseum.png', title: 'Roskilde' },
  { src: '/static/img/Stempler/Bernstorffslot.jpg', title: 'Gentofte' },
  { src: '/static/img/Stempler/Blaa planet.jpg', title: 'Kastrup' },
  { src: '/static/img/Stempler/Charlottenlundslot.jpg', title: 'Charlottenlund' },
  { src: '/static/img/Stempler/Frederiksbergslot.jpg', title: 'Frederiksberg' },
  { src: '/static/img/Stempler/Furesoe.jpg', title: 'Farum' },
  { src: '/static/img/Stempler/Hoersholmkirke.jpg', title: 'Hørsholm' },
  { src: '/static/img/Stempler/Odinsoeje.jpg', title: 'Herning' },
  { src: '/static/img/Stempler/Soelleroedsoe.jpg', title: 'Holte' },
  // Tilføj flere stempler her
];

function displayStamps(earnedStamps) {
  const stampList = document.querySelector('.stamp-list');
  stampList.innerHTML = ''; // Clear any previous stamps

  stamps.forEach(stamp => {
      if (earnedStamps.includes(stamp.title)) {
          const stampItem = document.createElement('div');
          stampItem.className = 'stamp-item';
          
          stampItem.innerHTML = `
              <img src="${stamp.src}" alt="${stamp.title}">
              <h3>${stamp.title}</h3>
          `;
          
          stampList.appendChild(stampItem);
      }
  });
}



async function loadUserStamps() {
  const userId = getCookie('userId');

  if (!userId) {
      alert("You must log in to view your stamps.");
      window.location.href = '/';
      return;
  }

  try {
      const response = await fetch(`/get-stamp-count?userId=${userId}`);
      const result = await response.json();
      console.log('Server response:', result);
      if (result.stamps) {
          displayStamps(result.stamps);
      } else {
          console.error('Failed to load stamp count. Response was:', result);
      }
  } catch (error) {
      console.error('Error loading user stamps:', error);
  }
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) return value;
  }
  return null;
}

loadUserStamps();