function displayVoiceData() {
    // Fetch data.json using AJAX
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        // Get the voice list tbody element
        var voiceListBody = document.getElementById('voiceListBody');

        // Clear existing rows
        voiceListBody.innerHTML = '';

        // Iterate through each voice in the data
        data.voices.forEach(voice => {
          // Create a new row for each voice
          var row = voiceListBody.insertRow();

          // Add cells for name and actions
          var nameCell = row.insertCell(0);
          var actionsCell = row.insertCell(1);

          // Set the name cell content
          nameCell.innerHTML = voice.name;

          // Create a button for actions
          var detailsButton = document.createElement('button');
          detailsButton.innerHTML = 'Details';
          detailsButton.className = 'btn btn-info btn-sm';
          detailsButton.onclick = function() {
            showDetails(voice.id);
          };

          // Append the button to the actions cell
          actionsCell.appendChild(detailsButton);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Function to show details for a specific voice
  function showDetails(voiceId) {
    // Fetch data.json using AJAX
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        // Find the voice with the given ID
        var voice = data.voices.find(v => v.id === voiceId);

        // Display details in the details box
        var detailsText = document.getElementById('detailsText');
        detailsText.innerHTML = voice.text;

        var detailsBox = document.getElementById('detailsBox');
        detailsBox.style.display = 'block';
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Call displayVoiceData on page load
  window.onload = function() {
    displayVoiceData();
  };

let voiceCounter = 1;
function startVoiceToText() {
    const voiceResultElement = document.getElementById('voiceResult');
    const voiceDescription = document.getElementById('voiceDescription').value.trim();
    const voiceName = voiceDescription || `voicetranscript`;
    let voiceResult = ''; // Initialize voiceResult variable

    voiceResultElement.textContent = 'Listening...';

    // Directly initialize annyangInstance
    annyang.addCommands({
        'stop listening': function () {
            annyang.pause();
            voiceResultElement.textContent = 'Listening paused. Say "resume listening" to continue.';
        },
        'resume listening': function () {
            annyang.resume();
            voiceResultElement.textContent = 'Listening resumed...';
        },
        'pk': function () {
            annyang.abort(); // Stop listening completely
            let modifiedvoiceResult = voiceResult.replace(/\s+/g, " ").replace(/resume listening|stop listening|pk/gi, "").trim();;
            voiceResultElement.textContent = modifiedvoiceResult;
            addVoiceToList(voiceName)
        }
    });

    annyang.start({ autoRestart: true, continuous: true });
    annyang.addCallback('result', function (phrases) {
        const smallResult = phrases[0];
        voiceResult += `${smallResult} `;
        voiceResultElement.textContent = `Voice Result: ${voiceResult}`;

        // Check if a stop or abort command is recognized
        if (smallResult.toLowerCase() === 'stop listening') {
            annyang.pause(); // Pause annyang if the stop command is recognized
            voiceResultElement.textContent = 'Listening paused. Say "resume listening" to continue.';
        } else if (smallResult.toLowerCase() === 'pk') {
            annyang.abort(); // Stop listening completely if the abort command is recognized
            voiceResultElement.textContent = 'Listening aborted2.';
        }
    });
}
function addVoiceToList(voiceName) {
    const voiceListBody = document.getElementById('voiceListBody');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = voiceName;
    nameCell.addEventListener('click', () => {
        toggleVoiceDetails(voiceName);
    });
    row.appendChild(nameCell);

    const actionsCell = document.createElement('td');
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Details';
    detailsButton.className = 'btn btn-info btn-sm';
    detailsButton.addEventListener('click', () => {
        toggleVoiceDetails(voiceName);
    });
    actionsCell.appendChild(detailsButton);
    row.appendChild(actionsCell);

    voiceListBody.appendChild(row);

    // Add details box for the voice
    const detailsBox = document.createElement('div');
    detailsBox.className = 'details-box voice-details';
    detailsBox.id = `voiceDetails_${voiceName}`;
    detailsBox.style.display = 'none';

    const detailsHeader = document.createElement('h5');
    detailsHeader.textContent = `Details for ${voiceName}`;

    const detailsText = document.createElement('p');
    detailsText.textContent = `Voice Result:\n\n`;

    detailsBox.appendChild(detailsHeader);
    detailsBox.appendChild(detailsText);

    document.getElementById('voiceToText').appendChild(detailsBox);
    saveVoiceData();
}

function toggleVoiceDetails(voiceName) {
    const detailsBox = document.getElementById(`voiceDetails_${voiceName}`);

    // Check if the detailsBox is initialized before accessing its properties
    if (detailsBox && detailsBox.style) {
        const allDetailsBoxes = document.querySelectorAll('.details-box.voice-details');
        allDetailsBoxes.forEach((box) => {
            if (box.id !== `voiceDetails_${voiceName}`) {
                box.style.display = 'none';
            }
        });

        if (detailsBox.style.display === 'block') {
            detailsBox.style.display = 'none';
        } else {
            detailsBox.style.display = 'block';
            document.querySelector(`#voiceDetails_${voiceName} p`).textContent =
                `Voice Result:\n\n${document.getElementById('voiceResult').textContent}`;

        }
    }
}
function saveVoiceData() {
    const voiceName = document.getElementById('voiceDescription').value.trim() || `voicetranscript`;
    const voiceResult = document.getElementById('voiceResult').textContent;

    // addVoiceToList(voiceName); // Add voice to the list
    toggleVoiceDetails(voiceName); // Show details box

    // Save voice data to the server
    saveDataToServer({
        name: voiceName,
        text: voiceResult,
    });

    // Clear the voice result after saving
    document.getElementById('voiceResult').textContent = '';
}

function saveDataToServer(data) {
    fetch('http://localhost:3000/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log('Data saved successfully');
            } else {
                console.error('Failed to save data');
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
} 