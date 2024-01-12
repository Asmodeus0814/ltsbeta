function Users() {
  fetch('/fetch-users')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      document.body.innerHTML = html;
    })
    .catch(error => {
      console.error('Error navigating to users:', error);
    });``
}

function toggleUsers() {
  window.location.href = '/user';
  Users();
}

function toggleLogout() {
  window.location.href = '/logout';
}

function Dashboard() {
    fetch('/get-dashboard')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        document.body.innerHTML = html;
      })
      .catch(error => {
        console.error('Error navigating to dashboard:', error);
      });
  }
function toggleDashboard() {
  window.location.href = '/dashboard';
  Dashboard();
}

  async function addTrucking() {
    const trucking_name = document.getElementById('trucking_name').value;
    const trucking_address = document.getElementById('trucking_address').value;
    const trucking_phone = document.getElementById('trucking_phone').value;
  
    const isConfirmed = confirm('Are you sure you want to add this trucking company?');
  
    // Explicitly check the user's choice
    if (isConfirmed) {
      // Assuming you have a predefined API endpoint for adding trucking companies
      const apiEndpoint = `/add-trucking?trucking_name=${encodeURIComponent(trucking_name)}&trucking_address=${encodeURIComponent(trucking_address)}&trucking_phone=${encodeURIComponent(trucking_phone)}`;
  
      try {
        // Perform the POST request to add the trucking company
        const response = await fetch(apiEndpoint, {
          method: 'POST',
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert('Trucking company added successfully');
        Trucking();
      } catch (error) {
        console.error('Error adding trucking company:', error);
        toggleTrucking();
      }
    } else{
    }
    // If the user clicks "Cancel" in the confirmation dialog, do nothing
  }


  function Trucking() {
    // Select the content container
    const contentContainer = document.querySelector('.content');
  
    // Clear the existing content
    contentContainer.innerHTML = '';
  
    // Fetch and load the new content
    fetch('/trucking-companies')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        document.querySelector('.content').innerHTML = html;
      })
      .catch(error => {
        console.error('Error navigating to trucking companies:', error);
      });
  }

  

  function Drivers() {
        // Select the content container
    const contentContainer = document.querySelector('.content');
  
    // Clear the existing content
    contentContainer.innerHTML = '';

    fetch('/get-drivers')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        document.querySelector('.content').innerHTML = html;
      })
      .catch(error => {
        console.error('Error navigating to drivers:', error);
      });
  }

  function compareTruckingIdsAndNames() {
    // Get trucking IDs from the table
    var tableTruckingIds = getAllTruckingIds();
  
    // Get trucking names from the API
    getTruckingNames()
      .then(apiTruckingNames => {
        var truckingIdMapping = {};
        // Get only the trucking_ids from the API response as numbers
        apiTruckingNames.forEach(apiData => {
          truckingIdMapping[apiData.trucking_id] = apiData.trucking_name;
        });
  
        // Display trucking_names in the HTML table body
        var tableBody = document.getElementById('driversTableBody');
        if (tableBody) {
          tableTruckingIds.forEach(truckingId => {
            // Update the specific <td> with the trucking name for the corresponding trucking_id
            var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
            // Get the common source type name from the mapping
            var commonTruckingName = truckingIdMapping[truckingId];
  
            truckingNameCells.forEach(truckingNameCell => {
              if (truckingNameCell && commonTruckingName) {
                truckingNameCell.innerHTML = commonTruckingName;
              }
            });
          });
        } else {
          console.error('HTML table body not found');
        }
  
        return tableTruckingIds;
      })
      .catch(error => {
        console.error('Error fetching or comparing data:', error);
      });
  }

  function getAllTruckingIds() {
    var table = document.querySelector('table');
    var rows = table.getElementsByTagName('tr');
    var truckingIds = [];
  
    // Iterate over the rows (starting from index 1 to skip the header row)
    for (var i = 1; i < rows.length; i++) {
      var currentTruckingId = getTruckingIdFromRow(rows[i]);
      truckingIds.push(currentTruckingId);
    }
    console.log(truckingIds);
    return truckingIds;
  }
  function getTruckingIdFromRow(row) {
    // Assuming that the trucking ID is in the first column (index 0) of the row
    var truckingIdCell = row.cells[7]; // Adjust the index if needed
    var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
    return truckingId.trim(); // Trim any leading or trailing spaces
  }

  function toggleFormContainer() {
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
  } 

  function toggleModify() {
    const actionColumnHeader = document.getElementById('actionColumnHeader');
    const editButtonColumns = document.getElementsByClassName('edit-button-column');
    const deleteButtonColumns = document.getElementsByClassName('delete-button-column');

    for (const column of editButtonColumns) {
      column.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
    }

    for (const column of deleteButtonColumns) {
      column.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
    }

    actionColumnHeader.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
  }
  
  function deleteTrucking(truckingId) {
    // Assuming you have a confirmation from the user
    const isConfirmed = confirm('Are you sure you want to delete this trucking company?');
  
    if (isConfirmed) {
        fetch(`/delete-trucking/${truckingId}`, {
            method: 'POST',
        })
        .then(() => {
            // Display a success message
            alert('Trucking company deleted successfully');
            // Redirect to the trucking.ejs page after deletion
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting trucking company. Please try again.');
        });
    }
}

function deleteDriver(driverId) {
  // Assuming you have a confirmation from the user
  const isConfirmed = confirm('Are you sure you want to delete this trucking company?');

  if (isConfirmed) {
      fetch(`/delete-driver/${driverId}`, {
          method: 'POST',
      })
      .then(() => {
          // Display a success message
          alert('Driver deleted successfully');
          // Redirect to the trucking.ejs page after deletion
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error deleting driver company. Please try again.');
      });
  }
}

function editTrucking(truckingId) {
  // Fetch data for the specific truckingId
  const isConfirmed = confirm('Are you sure you want to edit this trucking company?');

  if (isConfirmed) {
    fetch(`/getInfo-trucking/${truckingId}`, {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      return response.json(); // Convert the response to JSON
    })
    .then(data => {
      console.log('Fetched data:', data);

      // Show the form overlay
      toggleEditFormOverlay();

      // Populate the form with fetched data after a short delay to ensure the form is displayed
      setTimeout(() => {
        document.getElementById('edit_trucking_id').value = data.trucking_id;
        document.getElementById('edit_trucking_name').value = data.trucking_name;
        document.getElementById('edit_trucking_address').value = data.trucking_address;
        document.getElementById('edit_trucking_phone').value = data.trucking_phone;
      }, 100);
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
      alert('Error fetching trucking data. Please try again.');
    });
  }
}

function toggleEditFormOverlay() {
  const editFormOverlay = document.getElementById('editFormOverlay');
  editFormOverlay.style.display = editFormOverlay.style.display === 'none' ? 'block' : 'none';
}

function editTruckingSubmit() {
  const truckingId = document.getElementById('edit_trucking_id').value;
  const truckingName = document.getElementById('edit_trucking_name').value;
  const truckingAddress = document.getElementById('edit_trucking_address').value;
  const truckingPhone = document.getElementById('edit_trucking_phone').value;

  // Construct the URL with query parameters
  const url = `/updateInfo-trucking/${truckingId}?truckingName=${encodeURIComponent(truckingName)}&truckingAddress=${encodeURIComponent(truckingAddress)}&truckingPhone=${encodeURIComponent(truckingPhone)}`;

  // Perform a PUT request to update the data
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to update data. Status: ${response.status}`);
    }

    // Optionally, you can handle the success case here
    console.log('Data updated successfully');
  })
  .catch(error => {
    console.error('Error updating trucking data:', error);
    alert('Error updating trucking data. Please try again.');
  });

  // Prevent the form from submitting in the traditional way
  return false;
}

function toggleFormAddDriver() {
  const formContainer = document.querySelector('.form-container');
  const form = formContainer.querySelector('form');

  // Reset the form fields to clear previous input
  form.reset();

  // Toggle the form container's display style
  formContainer.classList.toggle('active');

  populateTruckingDropdown()

  // Optionally, you can focus on the first input field for better user experience
  const firstInput = form.querySelector('input');
  if (firstInput) {
    firstInput.focus(); 
  }
}

function populateTruckingDropdown() {
  const dropdown = document.getElementById('driver_trucking_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/get-truckings')
    .then(response => response.json())
    .then(truckings => {
      // Populate the dropdown with trucking names and corresponding IDs
      truckings.forEach(trucking => {
        const option = document.createElement('option');
        option.value = trucking.trucking_id;
        option.textContent = trucking.trucking_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
    });
}

async function addDriver() {
  
  const driverName = document.getElementById('driver_name').value;
  const driverUsername = document.getElementById('driver_username').value;
  const driverPassword = document.getElementById('driver_password').value;
  const driverAge = document.getElementById('driver_age').value;
  const driverAddress = document.getElementById('driver_address').value;
  const driverPhone = document.getElementById('driver_phone').value;
  const driverLicenseNo = document.getElementById('driver_licence_no').value;
  const driverTruckingId = document.getElementById('driver_trucking_id').value;

  const isConfirmed = confirm('Are you sure you want to add this driver?');

  // Assuming you have a predefined API endpoint for adding drivers
  if (isConfirmed){
    const apiEndpoint = `/add-driver?driver_name=${encodeURIComponent(driverName)}&driver_username=${encodeURIComponent(driverUsername)}&driver_password=${encodeURIComponent(driverPassword)}&driver_age=${driverAge}&driver_address=${encodeURIComponent(driverAddress)}&driver_phone=${encodeURIComponent(driverPhone)}&driver_licence_no=${encodeURIComponent(driverLicenseNo)}&driver_trucking_id=${driverTruckingId}`;

    try{
      const response = await fetch(apiEndpoint, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert('Driver added successfully');
      setTimeout(() => {
        Drivers();
        }, 200);
      window.location.reload();
    } catch (error) {
      console.error('Error adding a driver:', error);
      toggleDrivers();
    }
  }
  toggleDrivers();
}

function getTruckingNames() {
  // Assuming you have a predefined API endpoint for getting trucking names
  const apiEndpoint = '/get-trucking-names';

  return fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(truckingNames => {
      // Log the fetched trucking names
      console.log('Fetched trucking names:', truckingNames);
      return truckingNames;
    })
    .catch(error => {
      console.error('Error fetching trucking names:', error);
      throw error; // Propagate the error to the calling code
    });
}
function toggleModifyDriver() {
  const actionColumnHeader = document.getElementById('actionColumnHeader');
  const editButtonColumns = document.getElementsByClassName('edit-button-column');
  const deleteButtonColumns = document.getElementsByClassName('delete-button-column');

  for (const column of editButtonColumns) {
    column.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
  }

  for (const column of deleteButtonColumns) {
    column.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
  }

  actionColumnHeader.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
}

function deleteTruckUnit(truckUnitId) {
  // Assuming you have a confirmation from the user
  const isConfirmed = confirm('Are you sure you want to delete this Truck Unit?');

  if (isConfirmed) {
      fetch(`/delete-truck-unit/${truckUnitId}`, {
          method: 'POST',
      })
      .then(() => {
          // Display a success message
          alert('Truck Unit deleted successfully');
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error deleting Truck Unit. Please try again.');
      });
  }
}

function editDriver(driverId) {
  const isConfirmed = confirm('Are you sure you want to edit this driver?');

  if (isConfirmed) {
    fetch(`/getInfo-driver/${driverId}`, {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      return response.json(); // Convert the response to JSON
    })
    .then(data => {
      console.log('Fetched data:', data);

      // Show the form overlay
      toggleEditFormOverlayDriver();

      populateEditTruckingDropdownDriver();

      setTimeout(() => {
        populateEditTruckingDropdownDriver();
        }, 100);

      // Populate the form with fetched data after a short delay to ensure the form is displayed
      setTimeout(() => {
        document.getElementById('edit_driver_id').value = data.driver_id;
        document.getElementById('edit_driver_name').value = data.driver_name;
        document.getElementById('edit_driver_address').value = data.driver_address;
        document.getElementById('edit_driver_password').value = data.password;
        document.getElementById('edit_driver_phone').value = data.driver_phone;
        document.getElementById('edit_driver_username').value = data.driver_username;
        document.getElementById('edit_driver_age').value = data.age;
        document.getElementById('edit_licence_no').value = data.licence_no;
        document.getElementById('edit_trucking_id').value = data.trucking_id;

      }, 100);
    })
    .catch(error => {
      console.error('Error fetching driver data:', error);
      alert('Error fetching driver data. Please try again.');
    });
  }
}


function toggleEditFormOverlayDriver() {
  const editFormOverlay = document.getElementById('editFormOverlay');
  editFormOverlay.style.display = editFormOverlay.style.display === 'none' ? 'block' : 'none';
}

function editTruckingSubmitDriver() {
  // Get values from form fields
  const driverId = document.getElementById('edit_driver_id').value;
  const driverName = document.getElementById('edit_driver_name').value;
  const driverUsername = document.getElementById('edit_driver_username').value;
  const driverPhone = document.getElementById('edit_driver_phone').value;
  const driverPassword = document.getElementById('edit_driver_password').value;
  const driverAge = document.getElementById('edit_driver_age').value;
  const driverAddress = document.getElementById('edit_driver_address').value;
  const licenceNo = document.getElementById('edit_licence_no').value;

  let truckingId;
  if (document.getElementById('edit_trucking_id').style.left === '-9999px') {
    // If source type input is hidden, use dropdown value
    truckingId = document.getElementById('drop_down_edit_trucking_id').value;
  } else {
    // If dropdown is hidden, use input value
    truckingId = document.getElementById('edit_trucking_id').value;
  }

  // Construct the URL with query parameters
  const url = `/updateDriverInfo/${driverId}?driverName=${encodeURIComponent(driverName)}&driverUsername=${encodeURIComponent(driverUsername)}&driverPhone=${encodeURIComponent(driverPhone)}&driverPassword=${encodeURIComponent(driverPassword)}&driverAge=${encodeURIComponent(driverAge)}&driverAddress=${encodeURIComponent(driverAddress)}&licenceNo=${encodeURIComponent(licenceNo)}&truckingId=${encodeURIComponent(truckingId)}`;

  // Perform a PUT request to update the data
  fetch(url, {
    method: 'PUT',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update data. Status: ${response.status}`);
      }

      // Optionally, you can handle the success case here
      console.log('Data updated successfully');
      alert('Driver edited successfully');
      toggleEditFormOverlay(); // Close the form on success
      toggleDrivers()
    })
    .catch(error => {
      console.error('Error updating driver data:', error);
      alert('Error updating driver data. Please try again.');
    });

  // Prevent the form from submitting in the traditional way
  return false;
}

function truckUnit() {
  fetch('/truck-units')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      document.querySelector('.content').innerHTML = html;
    })
    .catch(error => {
      console.error('Error navigating to truck units:', error);
    });
}

async function addTruckUnit() {
  
  const truckUnitName = document.getElementById('truckUnit_name').value;
  const truckUnitSourceType = document.getElementById('truckUnit_source_type').value;
  const truckUnitPlateNo = document.getElementById('truckUnit_plate_no').value;
  const truckUnitModel = document.getElementById('truckUnit_model').value;
  const truckUnitChasisNo = document.getElementById('truckUnit_chasis_no').value;
  const truckUnitTruckingId = document.getElementById('truckUnit_trucking_id').value;

  console.log('Truck Unit Name:', truckUnitName);
  console.log('Source Type:', truckUnitSourceType);
  console.log('Plate No:', truckUnitPlateNo);
  console.log('Model:', truckUnitModel);
  console.log('Chasis No:', truckUnitChasisNo);
  console.log('Trucking ID:', truckUnitTruckingId);

  const isConfirmed = confirm('Are you sure you want to add this truck unit?');

  // Assuming you have a predefined API endpoint for adding drivers
  if (isConfirmed){
    const apiEndpoint = `/add-truck-unit?truckUnitName=${encodeURIComponent(truckUnitName)}&truckUnitSourceType=${encodeURIComponent(truckUnitSourceType)}&truckUnitChasisNo=${encodeURIComponent(truckUnitChasisNo)}&truckUnitModel=${encodeURIComponent(truckUnitModel)}&truckUnitPlateNo=${encodeURIComponent(truckUnitPlateNo)}&truckUnitTruckingId=${encodeURIComponent(truckUnitTruckingId)}`;
  try{
    const response = await fetch(apiEndpoint, {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    alert('Truck Unit added successfully');
    truckUnit();
    console.log(data); // Log the response from the server
  } catch (error) {
        console.error('Error adding Truck Unit:', error);
        toggleTruckUnit();
  }
  }
  toggleTruckUnit();
}

function toggleFormAddTruckUnits() {
  const formContainer = document.querySelector('.form-container');
  const form = formContainer.querySelector('form');

  // Reset the form fields to clear previous input
  form.reset();

  // Toggle the form container's display style
  formContainer.classList.toggle('active');
  populateTruckingDropdownTruckUnit();
  populateSourceTypeDropdown();

  // Optionally, you can focus on the first input field for better user experience
  const firstInput = form.querySelector('input');
  if (firstInput) {
    firstInput.focus(); 
  }
}

function populateTruckingDropdownTruckUnit() {
  const dropdown = document.getElementById('truckUnit_trucking_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/get-truckings')
    .then(response => response.json())
    .then(truckings => {
      // Populate the dropdown with trucking names and corresponding IDs
      truckings.forEach(trucking => {
        const option = document.createElement('option');
        option.value = trucking.trucking_id;
        option.textContent = trucking.trucking_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
    });
}
function toggleTrucking() {
  window.location.href = '/truckings';
  Trucking();
}
function toggleDrivers() {
  window.location.href = '/driver';
  Drivers();
}

function toggleTruckUnit() {
  window.location.href = '/get-truck-units';
  truckUnit();
}



function compareTruckingIdsAndNamesTruckUnit() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllTruckingIdsTruckUnit();

  // Get trucking names from the API
  getTruckingNames()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.trucking_id] = apiData.trucking_name;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('truckUnitsTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllTruckingIdsTruckUnit() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var truckingIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentTruckingId = getTruckingIdFromRowTruckUnit(rows[i]);
    truckingIds.push(currentTruckingId);
  }
  console.log(truckingIds);
  return truckingIds;
}
function getTruckingIdFromRowTruckUnit(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var truckingIdCell = row.cells[6]; // Adjust the index if needed
  var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
  return truckingId.trim(); // Trim any leading or trailing spaces
}

function editTruckUnit(truckUnitId) {
  const isConfirmed = confirm('Are you sure you want to edit this truck unit?');

  if (isConfirmed) {
    fetch(`/getInfo-truck-unit/${truckUnitId}`, {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      return response.json(); // Convert the response to JSON
    })
    .then(data => {
      console.log('Fetched data:', data);

      // Show the form overlay
      toggleEditFormOverlayTruckUnit();
      populateEditTruckingDropdownTruckUnit();
      populateSourceTypeDropdownEdit();

      setTimeout(() => {
        populateEditTruckingDropdownTruckUnit();
        populateSourceTypeDropdownEdit();
        }, 100);
      
      // Populate the form with fetched data after a short delay to ensure the form is displayed
      setTimeout(() => {
        document.getElementById('edit_truck_id').value = data.truck_id;
        document.getElementById('edit_truck_name').value = data.truck_name;
        document.getElementById('edit_truck_plateno').value = data.truck_plateno;
        document.getElementById('edit_source_type').value = data.source_type;
        document.getElementById('edit_model').value = data.model;
        document.getElementById('edit_chasisno').value = data.chasisno;
        document.getElementById('edit_trucking_id').value = data.trucking_id;

        // Set the initial value of edit_trucking_id dropdown
        const editTruckingIdDropdown = document.getElementById('edit_trucking_id');
        const truckingIdOption = document.querySelector(`#edit_trucking_id option[value="${data.trucking_id}"]`);
        
        if (truckingIdOption) {
          editTruckingIdDropdown.value = data.trucking_id;
        }

      }, 100);
    })
    .catch(error => {
      console.error('Error fetching truck unit data:', error);
      alert('Error fetching truck unit data. Please try again.');
    });
  }
}
function toggleEditFormOverlayTruckUnit() {
  
  const editFormOverlay = document.getElementById('editFormOverlay');
  editFormOverlay.style.display = editFormOverlay.style.display === 'none' ? 'block' : 'none';
}

function toggleEditFormOverlayDelivery() {
  
  const editFormOverlay = document.getElementById('editFormOverlay');
  editFormOverlay.style.display = editFormOverlay.style.display === 'none' ? 'block' : 'none';
}

function printSelectedValue() {
  const editSourceTypeDropdown = document.getElementById('drop_down_edit_source_type');
  const selectedValue = editSourceTypeDropdown.value;
  console.log('Selected Source Type:', selectedValue);
}

function printSelectedValueAdd() {
  const editSourceTypeDropdown = document.getElementById('truckUnit_source_type');
  const selectedValue = editSourceTypeDropdown.value;
  const selectedInfo= editSourceTypeDropdown.label;
  console.log('Selected Source Type:', selectedValue);
}

function printSelectedValueEdit() {
  const editSourceTypeDropdown = document.getElementById('drop_down_edit_trucking_id');
  const selectedValue = editSourceTypeDropdown.value;
  console.log('Selected Source Type:', selectedValue);
}

function getSourceTypes() {
  // Assuming you have a predefined API endpoint for getting trucking names
  const apiEndpoint = '/get-source-types';

  return fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(sourceTypes => {
      console.log('Fetched Source Types:', sourceTypes);
      return sourceTypes;
    })
    .catch(error => {
      console.error('Error fetching source types:', error);
      throw error; // Propagate the error to the calling code
    });
}
function getAllSourceTypesTruckUnit() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var sourceTypes = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentSourceType= getSourceTypesFromRowTruckUnit(rows[i]);
    sourceTypes.push(currentSourceType);
  }
  console.log(sourceTypes);
  return sourceTypes;
}
function getSourceTypesFromRowTruckUnit(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var sourceTypeCell = row.cells[2]; // Adjust the index if needed
  var sourceType = sourceTypeCell.textContent || sourceTypeCell.innerText;
  return sourceType.trim(); // Trim any leading or trailing spaces
}

function compareSourceTypesAndNamesTruckUnit() {
  // Get source types from the table
  var tableSourceTypes = getAllSourceTypesTruckUnit();

  // Get source names from the API
  getSourceTypes()
    .then(apiSourceNames => {
      // Create a mapping object for source_type to source_type_name
      var sourceTypeMapping = {};
      apiSourceNames.forEach(apiData => {
        sourceTypeMapping[apiData.source_type_id] = apiData.source_type_name;
      });

      // Display source_names in the HTML table body
      var tableBody = document.getElementById('truckUnitsTableBody');
      if (tableBody) {
        tableSourceTypes.forEach(sourceType => {
          // Find all occurrences of <td> with the source type ID
          var sourceTypeCells = document.querySelectorAll(`[id^="sourceName_${sourceType}"]`);

          // Get the common source type name from the mapping
          var commonSourceTypeName = sourceTypeMapping[sourceType];

          // Update all occurrences with the common source type name
          sourceTypeCells.forEach(sourceNameCell => {
            if (sourceNameCell && commonSourceTypeName) {
              sourceNameCell.innerHTML = commonSourceTypeName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableSourceTypes; // Return the original array if needed
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}
function populateSourceTypeDropdown() {
  const dropdown = document.getElementById('truckUnit_source_type');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/get-source-types')
    .then(response => response.json())
    .then(sourceTypes => {
      // Populate the dropdown with trucking names and corresponding IDs
      sourceTypes.forEach(source_type => {
        const option = document.createElement('option');
        option.value = source_type.source_type_id;
        option.textContent = source_type.source_type_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching source type data:', error);
    });
}

function toggleTruckingName() {
  const truckingNameLabel = document.getElementById('truckingIdLabel');
  const editTruckingNameInput = document.getElementById('edit_trucking_id');
  const dropdownTruckingName = document.getElementById('drop_down_edit_trucking_id');
  const dropdownTruckingNameLabel = document.getElementById('dropdown_edit_trucking_id_label');

  if (editTruckingNameInput.style.left === '-9999px') {
    // If input is off-screen, make it visible
    editTruckingNameInput.style.position = 'unset';
    editTruckingNameInput.style.left = '';
    truckingNameLabel.style.display = 'block';

    // Hide dropdown
    dropdownTruckingName.style.position = 'absolute';
    dropdownTruckingName.style.left = '-9999px';
    dropdownTruckingNameLabel.style.display = 'none';
  } else {
    // If input is visible, make it off-screen
    editTruckingNameInput.style.position = 'absolute';
    editTruckingNameInput.style.left = '-9999px';
    truckingNameLabel.style.display = 'none';

    // Show dropdown
    dropdownTruckingName.style.position = 'unset';
    dropdownTruckingName.style.left = '';
    dropdownTruckingNameLabel.style.display = 'block';
  }
}

function toggleSourceType() {
  const sourceTypeLabel = document.getElementById('sourceTypeLabel');
  const editSourceTypeInput = document.getElementById('edit_source_type');
  const dropdownSourceType = document.getElementById('drop_down_edit_source_type');
  const dropdownSourceTypeLabel = document.getElementById('drop_down_edit_source_type_label');

  if (editSourceTypeInput.style.left === '-9999px') {
    // If input is off-screen, make it visible
    editSourceTypeInput.style.position = 'unset';
    editSourceTypeInput.style.left = '';
    sourceTypeLabel.style.display = 'block';

    // Hide dropdown
    dropdownSourceType.style.position = 'absolute';
    dropdownSourceType.style.left = '-9999px';
    dropdownSourceTypeLabel.style.display = 'none';
  } else {
    // If input is visible, make it off-screen
    editSourceTypeInput.style.position = 'absolute';
    editSourceTypeInput.style.left = '-9999px';
    sourceTypeLabel.style.display = 'none';

    // Show dropdown
    dropdownSourceType.style.position = 'unset';
    dropdownSourceType.style.left = '';
    dropdownSourceTypeLabel.style.display = 'block';
  }
}


function populateSourceTypeDropdownEdit() {
  toggleSourceType();
  const dropdown = document.getElementById('drop_down_edit_source_type');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/get-source-types')
    .then(response => response.json())
    .then(sourceType => {
      // Populate the dropdown with trucking names and corresponding IDs
      sourceType.forEach(source_type => {
        const option = document.createElement('option');
        option.value = source_type.source_type_id;
        option.textContent = source_type.source_type_name;
        dropdown.appendChild(option);
      });
      console.log(sourceType);
    })
    .catch(error => {
      console.error('Error fetching Source type:', error);
    });
}

function populateEditTruckingDropdownTruckUnit() {
  toggleTruckingName();
  const dropdown = document.getElementById('drop_down_edit_trucking_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/get-truckings')
    .then(response => response.json())
    .then(truckings => {
      // Populate the dropdown with trucking names and corresponding IDs
      truckings.forEach(trucking => {
        const option = document.createElement('option');
        option.value = trucking.trucking_id;
        option.textContent = trucking.trucking_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
    });
}

function submitEditTruckUnit() {

  const truckId = document.getElementById('edit_truck_id').value;
  const truckName = document.getElementById('edit_truck_name').value;
  const truckPlateNo = document.getElementById('edit_truck_plateno').value;
  const truckModel = document.getElementById('edit_model').value;
  const truckChasisNo = document.getElementById('edit_chasisno').value;

  let sourceType;
  if (document.getElementById('edit_source_type').style.left === '-9999px') {
    // If source type input is hidden, use dropdown value
    sourceType = document.getElementById('drop_down_edit_source_type').value;
  } else {
    // If dropdown is hidden, use input value
    sourceType = document.getElementById('edit_source_type').value;
  }

  let truckingId;
  if (document.getElementById('edit_trucking_id').style.left === '-9999px') {
    // If source type input is hidden, use dropdown value
    truckingId = document.getElementById('drop_down_edit_trucking_id').value;
  } else {
    // If dropdown is hidden, use input value
    truckingId = document.getElementById('edit_trucking_id').value;
  }

  const url = `/updateTruckUnitInfo/${truckId}?truckName=${encodeURIComponent(truckName)}&truckPlateNo=${encodeURIComponent(truckPlateNo)}&truckModel=${encodeURIComponent(truckModel)}&truckChasisNo=${encodeURIComponent(truckChasisNo)}&sourceType=${encodeURIComponent(sourceType)}&truckingId=${encodeURIComponent(truckingId)}`;
  // Perform a PUT request to update the data
  fetch(url, {
    method: 'PUT',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update data. Status: ${response.status}`);
      }
  
      // Optionally, you can handle the success case here
      console.log('Data updated successfully');
      alert('Truck Unit edited successfully');
      toggleEditFormOverlayTruckUnit(); // Close the form on success
      toggleTruckUnit();
    })
    .catch(error => {
      console.error('Error updating truck unit data:', error);
      alert('Error updating truck unit data. Please try again.');
    });
  
  // Prevent the form from submitting in the traditional way
  return false;
  }

  function Delivery() {
    // Select the content container
const contentContainer = document.querySelector('.content');

// Clear the existing content
contentContainer.innerHTML = '';

fetch('/get-deliveries')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then(html => {
    document.querySelector('.content').innerHTML = html;
  })
  .catch(error => {
    console.error('Error navigating to deliveries:', error);
  });
}

function toggleDeliveries() {
  Delivery();
  window.location.href = '/deliveries';
}
function toggleFormContainerDeliveries() {
  const formContainer = document.querySelector('.form-container');
  const form = formContainer.querySelector('form');


  // Toggle the form container's display style
  formContainer.classList.toggle('active');

  const hasnoInput = document.getElementById('hasno');
    hasnoInput.value = generateRandom4DigitNumber();

  populateTruckingDropdownDelivery();
  populateDriversDropdownDelivery();
  populateTruckUnitsDropdownDelivery();
  // Optionally, you can focus on the first input field for better user experience
  const firstInput = form.querySelector('input');
  if (firstInput) {
    firstInput.focus(); 
  }
}

function generateRandom4DigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

function populateTruckingDropdownDelivery() {
  const dropdown = document.getElementById('trucking_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/get-truckings')
    .then(response => response.json())
    .then(truckings => {
      // Populate the dropdown with trucking names and corresponding IDs
      truckings.forEach(trucking => {
        const option = document.createElement('option');
        option.value = trucking.trucking_id;
        option.textContent = trucking.trucking_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
    });
}

function populateDriversDropdownDelivery() {
  const dropdown = document.getElementById('driver_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/fetch-drivers')
    .then(response => response.json())
    .then(drivers => {
      // Populate the dropdown with trucking names and corresponding IDs
      drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.driver_id;
        option.textContent = driver.driver_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching drivers data:', error);
    });
}

function populateTruckUnitsDropdownDelivery() {
  const dropdown = document.getElementById('truck_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/fetch-truck-units')
    .then(response => response.json())
    .then(truckUnits => {
      // Populate the dropdown with trucking names and corresponding IDs
      truckUnits.forEach(truckUnit => {
        const option = document.createElement('option');
        option.value = truckUnit.truck_id
        option.textContent = truckUnit.truck_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching drivers data:', error);
    });
}


async function addDelivery() {
  const trucking_id = document.getElementById('trucking_id').value;
  const hasno = document.getElementById('hasno').value;
  const driver_id = document.getElementById('driver_id').value;
  const truck_id = document.getElementById('truck_id').value;
  const helper = document.getElementById('helper').value;
  const bussiness_name = document.getElementById('bussiness_name').value;
  const delivery_address = document.getElementById('delivery_address').value;
  const contact_person = document.getElementById('contact_person').value;
  const contactno = document.getElementById('contactno').value;
  const delivery_date = document.getElementById('delivery_date').value;
  const dispatch_by = document.getElementById('dispatch_by').value;
  const dispatch_date = document.getElementById('dispatch_date').value;
  const receive_by = null;
  const receive_date = null;
  const status_id = 0;

  const isConfirmed = confirm('Are you sure you want to add this delivery?');

  // Assuming you have a predefined API endpoint for adding deliveries
  if (isConfirmed) {
    const apiEndpoint = `/add-delivery?trucking_id=${encodeURIComponent(trucking_id)}&hasno=${encodeURIComponent(hasno)}&driver_id=${encodeURIComponent(driver_id)}&truck_id=${encodeURIComponent(truck_id)}&helper=${encodeURIComponent(helper)}&bussiness_name=${encodeURIComponent(bussiness_name)}&delivery_address=${encodeURIComponent(delivery_address)}&contact_person=${encodeURIComponent(contact_person)}&contactno=${encodeURIComponent(contactno)}&delivery_date=${encodeURIComponent(delivery_date)}&dispatch_by=${encodeURIComponent(dispatch_by)}&dispatch_date=${encodeURIComponent(dispatch_date)}&receive_by=${receive_by === null ? '' : encodeURIComponent(receive_by)}&receive_date=${receive_date === null ? '' : encodeURIComponent(receive_date)}&status_id=${encodeURIComponent(status_id)}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert('Delivery added successfully');
      Delivery();
      const data = await response.json();
    } catch (error) {
      console.error('Error adding Delivery:', error);
      toggleDeliveries();
    }
  }
  toggleDeliveries();
}

function logDateTime() {
  const deliveryDateInput = document.getElementById('delivery_date');
  const selectedDateTime = deliveryDateInput.value;

  console.log('Selected Date and Time:', selectedDateTime);
}

function deleteDelivery(delivery_id) {
  // Assuming you have a confirmation from the user
  const isConfirmed = confirm('Are you sure you want to delete this delivery?');

  if (isConfirmed) {
      fetch(`/delete-delivery/${delivery_id}`, {
          method: 'POST',
      })
      .then(() => {
          // Display a success message
          alert('delivery deleted successfully');
          // Redirect to the trucking.ejs page after deletion
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error deleting delivery. Please try again.');
      });
  }
}

function compareStatusIdAndNamesDelivery() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllStatusIdDelivery();

  // Get trucking names from the API
  getStatusNames()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.status_id] = apiData.status_name;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('deliveriesTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="statusName_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }
      

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllStatusIdDelivery() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var statusIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentStatusId = getStatusIdFromRowDelivery(rows[i]);
    statusIds.push(currentStatusId);
  }
  console.log(statusIds);
  return statusIds;
}
function getStatusIdFromRowDelivery(row) {

  var statusIdCell = row.cells[15]; // Adjust the index if needed
  var statusId = statusIdCell.textContent || statusIdCell.innerText;
  return statusId.trim(); // Trim any leading or trailing spaces
}

function getStatusNames() {
  // Assuming you have a predefined API endpoint for getting trucking names
  const apiEndpoint = '/get-status-names';

  return fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(statusNames => {

      console.log('Fetched status names:', statusNames);
      return statusNames;
    })
    .catch(error => {
      console.error('Error fetching status names:', error);
      throw error; // Propagate the error to the calling code
    });
}

function compareTruckingIdsAndNamesDelivery() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllTruckingIdsDelivery();

  // Get trucking names from the API
  getTruckingNames()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.trucking_id] = apiData.trucking_name;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('deliveriesTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllTruckingIdsDelivery() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var truckingIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentTruckingId = getTruckingIdFromRowDelivery(rows[i]);
    truckingIds.push(currentTruckingId);
  }
  console.log(truckingIds);
  return truckingIds;
}
function getTruckingIdFromRowDelivery(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var truckingIdCell = row.cells[2]; // Adjust the index if needed
  var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
  return truckingId.trim(); // Trim any leading or trailing spaces
}


function compareDriverIdsAndNamesDelivery() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllDriverIdsDelivery();

  // Get trucking names from the API
  getDriverNames()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.driver_id] = apiData.driver_name;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('deliveriesTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllDriverIdsDelivery() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var truckingIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentTruckingId = getDriverIdFromRowDelivery(rows[i]);
    truckingIds.push(currentTruckingId);
  }
  console.log(truckingIds);
  return truckingIds;
}
function getDriverIdFromRowDelivery(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var truckingIdCell = row.cells[4]; // Adjust the index if needed
  var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
  return truckingId.trim(); // Trim any leading or trailing spaces
}

function getDriverNames() {
  // Assuming you have a predefined API endpoint for getting trucking names
  const apiEndpoint = '/get-driver-names';

  return fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(driverNames => {

      console.log('Fetched driver names:', driverNames);
      return driverNames;
    })
    .catch(error => {
      console.error('Error fetching driver names:', error);
      throw error; // Propagate the error to the calling code
    });
}

function getTruckUnitNames() {
  // Assuming you have a predefined API endpoint for getting trucking names
  const apiEndpoint = '/get-truck-unit-names';

  return fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(truckUnitNames => {

      console.log('Fetched driver names:', truckUnitNames);
      return truckUnitNames;
    })
    .catch(error => {
      console.error('Error fetching driver names:', error);
      throw error; // Propagate the error to the calling code
    });
  }

  function compareTruckUnitIdsAndNamesDelivery() {
    // Get trucking IDs from the table
    var tableTruckingIds = getAllTruckUnitsDelivery();
  
    // Get trucking names from the API
    getTruckUnitNames()
      .then(apiTruckingNames => {
        var truckingIdMapping = {};
        // Get only the trucking_ids from the API response as numbers
        apiTruckingNames.forEach(apiData => {
          truckingIdMapping[apiData.truck_id] = apiData.truck_name;
        });
  
        // Display trucking_names in the HTML table body
        var tableBody = document.getElementById('deliveriesTableBody');
        if (tableBody) {
          tableTruckingIds.forEach(truckingId => {
            // Update the specific <td> with the trucking name for the corresponding trucking_id
            var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
            // Get the common source type name from the mapping
            var commonTruckingName = truckingIdMapping[truckingId];
  
            truckingNameCells.forEach(truckingNameCell => {
              if (truckingNameCell && commonTruckingName) {
                truckingNameCell.innerHTML = commonTruckingName;
              }
            });
          });
        } else {
          console.error('HTML table body not found');
        }
  
        return tableTruckingIds;
      })
      .catch(error => {
        console.error('Error fetching or comparing data:', error);
      });
  }
  
  function getAllTruckUnitsDelivery() {
    var table = document.querySelector('table');
    var rows = table.getElementsByTagName('tr');
    var truckingIds = [];
  
    // Iterate over the rows (starting from index 1 to skip the header row)
    for (var i = 1; i < rows.length; i++) {
      var currentTruckingId = getTruckUnitIdFromRowDelivery(rows[i]);
      truckingIds.push(currentTruckingId);
    }
    console.log(truckingIds);
    return truckingIds;
  }
  function getTruckUnitIdFromRowDelivery(row) {
    // Assuming that the trucking ID is in the first column (index 0) of the row
    var truckingIdCell = row.cells[5]; // Adjust the index if needed
    var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
    return truckingId.trim(); // Trim any leading or trailing spaces
  }

  function getTruckUnitPlateNo() {
    // Assuming you have a predefined API endpoint for getting trucking names
    const apiEndpoint = '/get-truck-unit-plate-no';
  
    return fetch(apiEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(truckUnitNames => {
  
        console.log('Fetched truck unit plate no:', truckUnitNames);
        return truckUnitNames;
      })
      .catch(error => {
        console.error('Error fetching truck unit plate no:', error);
        throw error; // Propagate the error to the calling code
      });
    }

    function compareTruckUnitIdsAndPlateNoDelivery() {
      // Get trucking IDs from the table
      var tableTruckingIds = getAllTruckUnitsPlateNoDelivery();
    
      // Get trucking names from the API
      getTruckUnitPlateNo()
        .then(apiTruckingNames => {
          var truckingIdMapping = {};
          // Get only the trucking_ids from the API response as numbers
          apiTruckingNames.forEach(apiData => {
            truckingIdMapping[apiData.truck_id] = apiData.truck_plateno;
          });
    
          // Display trucking_names in the HTML table body
          var tableBody = document.getElementById('deliveriesTableBody');
          if (tableBody) {
            tableTruckingIds.forEach(truckingId => {
              // Update the specific <td> with the trucking name for the corresponding trucking_id
              var truckingNameCells = document.querySelectorAll(`[id^="truckPlateNo_${truckingId}"]`);
              // Get the common source type name from the mapping
              var commonTruckingName = truckingIdMapping[truckingId];
    
              truckingNameCells.forEach(truckingNameCell => {
                if (truckingNameCell && commonTruckingName) {
                  truckingNameCell.innerHTML = commonTruckingName;
                }
              });
            });
          } else {
            console.error('HTML table body not found');
          }
    
          return tableTruckingIds;
        })
        .catch(error => {
          console.error('Error fetching or comparing data:', error);
        });
    }
    
    function getAllTruckUnitsPlateNoDelivery() {
      var table = document.querySelector('table');
      var rows = table.getElementsByTagName('tr');
      var truckingIds = [];
    
      // Iterate over the rows (starting from index 1 to skip the header row)
      for (var i = 1; i < rows.length; i++) {
        var currentTruckingId = getTruckUnitIdPlateNoFromRowDelivery(rows[i]);
        truckingIds.push(currentTruckingId);
      }
      console.log(truckingIds);
      return truckingIds;
    }
    function getTruckUnitIdPlateNoFromRowDelivery(row) {
      // Assuming that the trucking ID is in the first column (index 0) of the row
      var truckingIdCell = row.cells[6]; // Adjust the index if needed
      var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
      return truckingId.trim(); // Trim any leading or trailing spaces
    }

    function collectData(deliveryId) {
      // Log the collected data for testing
      console.log('Collected data for delivery_id:', deliveryId);
  
      // Get all rows in the table
      const rows = document.querySelectorAll('tbody tr');
  
      // Initialize text content for the file
      let fileContent = 'HAULING ASSIGNMENT SLIP' + '\n\n';
  
      // Iterate through each row
      rows.forEach(row => {
          // Check if the row contains the specified delivery_id
          const rowDeliveryId = row.querySelector('td:nth-child(1)').textContent; // Assuming delivery_id is in the first column
          if (rowDeliveryId === deliveryId) {
              // Retrieve data from the matching row
              const hasNo = row.querySelector('td:nth-child(2)').textContent;
              const truckingId = row.querySelector('td:nth-child(3)').textContent;
              const truckingCompany = row.querySelector('td:nth-child(4)').textContent;
              const driverName = row.querySelector('td:nth-child(5)').textContent;
              const truckUnitPlateNo = row.querySelector('td:nth-child(7)').textContent;
              const helper = row.querySelector('td:nth-child(8)').textContent;
              const bussinessName = row.querySelector('td:nth-child(9)').textContent;
              const deliveryAddress = row.querySelector('td:nth-child(10)').textContent;
              const contactPerson = row.querySelector('td:nth-child(11)').textContent;
              const contactNo = row.querySelector('td:nth-child(12)').textContent;
              const deliveryDate = row.querySelector('td:nth-child(13)').textContent;
              const dispatchBy = row.querySelector('td:nth-child(14)').textContent;
              const dispatchDate = row.querySelector('td:nth-child(15)').textContent;
  
              // Append data to the text content
              fileContent += 'Has No: ' + hasNo + '\n\n';
              fileContent += 'TRUCKER INFORMATION\n';
              fileContent += 'Trucker Name: ' + truckingCompany + '\n';
              fileContent += 'Trucker ID: ' + truckingId + '\n';
              fileContent += 'Driver: ' + driverName + '\n';
              fileContent += 'Plate No: ' + truckUnitPlateNo + '\n';
              fileContent += 'Helper: ' + helper + '\n\n';
  
              fileContent += 'DELIVERY TO:\n';
              fileContent += 'Business Name: ' + bussinessName + '\n';
              fileContent += 'Delivery Address: ' + deliveryAddress + '\n';
              fileContent += 'Contact Person: ' + contactPerson + '\n';
              fileContent += 'Contact No: ' + contactNo + '\n';
              fileContent += 'Delivery Date and Time: ' + deliveryDate + '\n\n';
  
              fileContent += 'Dispatch Information:\n';
              fileContent += 'Dispatched By: ' + dispatchBy + '\n';
              fileContent += 'Dispatched Date and Time: ' + dispatchDate + '\n\n';
  
              fileContent += 'Delivery Acknowledgement:\n';
              fileContent += 'Received By:\n';
              fileContent += 'Received Date and Time:\n';
          }
      });
  
      // Create a Blob with the file content
      const blob = new Blob([fileContent], { type: 'docx' });
  
      // Create an anchor element and set the download attribute
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'delivery_data.docx';
  
      // Append the anchor to the body and simulate a click to trigger the download
      document.body.appendChild(a);
      a.click();
  
      // Remove the anchor from the body
      document.body.removeChild(a);
  }

    function toggleModifyDelivery() {
      const actionColumnHeader = document.getElementById('actionColumnHeader');
      const editButtonColumns = document.getElementsByClassName('edit-button-column');
      const deleteButtonColumns = document.getElementsByClassName('delete-button-column');
      const generateButtonColumns = document.getElementsByClassName('generate-button-column');
      const changeButtonColumns = document.getElementsByClassName('change-button-column');
    
      for (const column of editButtonColumns) {
        column.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
      }
    
      for (const column of deleteButtonColumns) {
        column.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
      }
      for (const column of generateButtonColumns) {
        column.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
      }
      for (const column of changeButtonColumns) {
        column.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
      }
    
      actionColumnHeader.style.display = actionColumnHeader.style.display === 'none' ? '' : 'none';
    }

    function populateSourceTypeDropdownEdit() {
      toggleSourceType();
      const dropdown = document.getElementById('drop_down_edit_source_type');
      dropdown.innerHTML = ''; // Clear existing options
    
      // Fetch trucking data from the server
      fetch('/get-source-types')
        .then(response => response.json())
        .then(sourceType => {
          // Populate the dropdown with trucking names and corresponding IDs
          sourceType.forEach(source_type => {
            const option = document.createElement('option');
            option.value = source_type.source_type_id;
            option.textContent = source_type.source_type_name;
            dropdown.appendChild(option);
          });
          console.log(sourceType);
        })
        .catch(error => {
          console.error('Error fetching Source type:', error);
        });
    }
    

    function toggleTruckingNameDriver() {
      const truckingNameLabel = document.getElementById('truckingIdLabel');
      const editTruckingNameInput = document.getElementById('edit_trucking_id');
      const dropdownTruckingName = document.getElementById('drop_down_edit_trucking_id');
      const dropdownTruckingNameLabel = document.getElementById('drop_down_edit_trucking_id_label');
    
      if (editTruckingNameInput.style.left === '-9999px') {
        // If input is off-screen, make it visible
        editTruckingNameInput.style.position = 'unset';
        editTruckingNameInput.style.left = '';
        truckingNameLabel.style.display = 'block';
    
        // Hide dropdown
        dropdownTruckingName.style.position = 'absolute';
        dropdownTruckingName.style.left = '-9999px';
        dropdownTruckingNameLabel.style.display = 'none';
      } else {
        // If input is visible, make it off-screen
        editTruckingNameInput.style.position = 'absolute';
        editTruckingNameInput.style.left = '-9999px';
        truckingNameLabel.style.display = 'none';
    
        // Show dropdown
        dropdownTruckingName.style.position = 'unset';
        dropdownTruckingName.style.left = '';
        dropdownTruckingNameLabel.style.display = 'block';
      }
    }

    function populateEditTruckingDropdownDriver() {
      toggleTruckingNameDriver();
      const dropdown = document.getElementById('drop_down_edit_trucking_id');
      dropdown.innerHTML = ''; // Clear existing options
    
      // Fetch trucking data from the server
      fetch('/get-truckings')
        .then(response => response.json())
        .then(truckings => {
          // Populate the dropdown with trucking names and corresponding IDs
          truckings.forEach(trucking => {
            const option = document.createElement('option');
            option.value = trucking.trucking_id;
            option.textContent = trucking.trucking_name;
            dropdown.appendChild(option);
          });
        })
        .catch(error => {
          console.error('Error fetching trucking data:', error);
        });
    }
    function changePassword() {
      // Get the password input element
      const passwordInput = document.getElementById('edit_driver_password');
  
      // Check if the password input is readonly
      if (passwordInput.readOnly) {
          // Make the password input required
          passwordInput.readOnly = false;
          passwordInput.required = true;
  
          // Store the existing password value
          passwordInput.dataset.previousValue = passwordInput.value;
  
          // Clear the password input value
          passwordInput.value = '';
      } else {
          // If the password input is not readonly, revert to previous state
          passwordInput.readOnly = true;
          passwordInput.required = false;
  
          // Restore the previous password value
          passwordInput.value = passwordInput.dataset.previousValue || '';
      }
  }


  function editDelivery(deliveryId) {
    const isConfirmed = confirm('Are you sure you want to edit this driver?');
  
    if (isConfirmed) {
      fetch(`/getInfo-delivery/${deliveryId}`, {
        method: 'GET',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
  
        return response.json(); // Convert the response to JSON
      })
      .then(data => {
        console.log('Fetched data:', data);
  
        // Show the form overlay
        toggleEditFormOverlayDriver();
        populateEditTruckingDropdownDelivery();
        populateEditDriverDropdownDelivery();
        populateEditTruckUnitDropdownDelivery();

        setTimeout(() => {
          populateEditTruckingDropdownDelivery();
          populateEditDriverDropdownDelivery();
          populateEditTruckUnitDropdownDelivery();
        }, 100);
  
        // Populate the form with fetched data after a short delay to ensure the form is displayed
        setTimeout(() => {
          document.getElementById('edit_delivery_id').value = data.delivery_id;
          document.getElementById('edit_hasno').value = data.hasno;
          document.getElementById('edit_trucking_id').value = data.trucking_id;
          document.getElementById('edit_driver_id').value = data.driver_id;
          document.getElementById('edit_truck_id').value = data.truck_id;
          document.getElementById('edit_helper').value = data.helper;
          document.getElementById('edit_bussiness_name').value = data.bussiness_name;
          document.getElementById('edit_delivery_address').value = data.delivery_address;
          document.getElementById('edit_contact_person').value = data.contact_person;
          document.getElementById('edit_contactno').value = data.contactno;
          document.getElementById('edit_delivery_date').value = data.delivery_date;
          document.getElementById('edit_dispatch_by').value = data.dispatch_by;
          document.getElementById('edit_dispatch_date').value = data.dispatch_date;
  
        }, 100);
      })
      .catch(error => {
        console.error('Error fetching driver data:', error);
        alert('Error fetching driver data. Please try again.');
      });
    }
  }

  function toggleTruckingNameDriver() {
    const truckingNameLabel = document.getElementById('truckingIdLabel');
    const editTruckingNameInput = document.getElementById('edit_trucking_id');
    const dropdownTruckingName = document.getElementById('drop_down_edit_trucking_id');
    const dropdownTruckingNameLabel = document.getElementById('drop_down_edit_trucking_id_label');
  
    if (editTruckingNameInput.style.left === '-9999px') {
      // If input is off-screen, make it visible
      editTruckingNameInput.style.position = 'unset';
      editTruckingNameInput.style.left = '';
      truckingNameLabel.style.display = 'block';
  
      // Hide dropdown
      dropdownTruckingName.style.position = 'absolute';
      dropdownTruckingName.style.left = '-9999px';
      dropdownTruckingNameLabel.style.display = 'none';
    } else {
      // If input is visible, make it off-screen
      editTruckingNameInput.style.position = 'absolute';
      editTruckingNameInput.style.left = '-9999px';
      truckingNameLabel.style.display = 'none';
  
      // Show dropdown
      dropdownTruckingName.style.position = 'unset';
      dropdownTruckingName.style.left = '';
      dropdownTruckingNameLabel.style.display = 'block';
    }
  }

  function populateEditTruckingDropdownDriver() {
    toggleTruckingNameDriver();
    const dropdown = document.getElementById('drop_down_edit_trucking_id');
    dropdown.innerHTML = ''; // Clear existing options
  
    // Fetch trucking data from the server
    fetch('/get-truckings')
      .then(response => response.json())
      .then(truckings => {
        // Populate the dropdown with trucking names and corresponding IDs
        truckings.forEach(trucking => {
          const option = document.createElement('option');
          option.value = trucking.trucking_id;
          option.textContent = trucking.trucking_name;
          dropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching trucking data:', error);
      });
  }

  function toggleTruckingNameDelivery() {
    const truckingNameLabel = document.getElementById('truckingIdLabel');
    const editTruckingNameInput = document.getElementById('edit_trucking_id');
    const dropdownTruckingName = document.getElementById('drop_down_edit_trucking_id');
    const dropdownTruckingNameLabel = document.getElementById('drop_down_edit_trucking_id_label');
  
    if (editTruckingNameInput.style.left === '-9999px') {
      // If input is off-screen, make it visible
      editTruckingNameInput.style.position = 'unset';
      editTruckingNameInput.style.left = '';
      truckingNameLabel.style.display = 'block';
  
      // Hide dropdown
      dropdownTruckingName.style.position = 'absolute';
      dropdownTruckingName.style.left = '-9999px';
      dropdownTruckingNameLabel.style.display = 'none';
    } else {
      // If input is visible, make it off-screen
      editTruckingNameInput.style.position = 'absolute';
      editTruckingNameInput.style.left = '-9999px';
      truckingNameLabel.style.display = 'none';
  
      // Show dropdown
      dropdownTruckingName.style.position = 'unset';
      dropdownTruckingName.style.left = '';
      dropdownTruckingNameLabel.style.display = 'block';
    }
  }

  function populateEditTruckingDropdownDelivery() {
    toggleTruckingNameDelivery();
    const dropdown = document.getElementById('drop_down_edit_trucking_id');
    dropdown.innerHTML = ''; // Clear existing options
  
    // Fetch trucking data from the server
    fetch('/get-truckings')
      .then(response => response.json())
      .then(truckings => {
        // Populate the dropdown with trucking names and corresponding IDs
        truckings.forEach(trucking => {
          const option = document.createElement('option');
          option.value = trucking.trucking_id;
          option.textContent = trucking.trucking_name;
          dropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching trucking data:', error);
      });
  }

  function toggleDriverNameDelivery() {
    const truckingNameLabel = document.getElementById('driverIdLabel');
    const editTruckingNameInput = document.getElementById('edit_driver_id');
    const dropdownTruckingName = document.getElementById('drop_down_edit_driver_id');
    const dropdownTruckingNameLabel = document.getElementById('drop_down_edit_driver_id_label');
  
    if (editTruckingNameInput.style.left === '-9999px') {
      // If input is off-screen, make it visible
      editTruckingNameInput.style.position = 'unset';
      editTruckingNameInput.style.left = '';
      truckingNameLabel.style.display = 'block';
  
      // Hide dropdown
      dropdownTruckingName.style.position = 'absolute';
      dropdownTruckingName.style.left = '-9999px';
      dropdownTruckingNameLabel.style.display = 'none';
    } else {
      // If input is visible, make it off-screen
      editTruckingNameInput.style.position = 'absolute';
      editTruckingNameInput.style.left = '-9999px';
      truckingNameLabel.style.display = 'none';
  
      // Show dropdown
      dropdownTruckingName.style.position = 'unset';
      dropdownTruckingName.style.left = '';
      dropdownTruckingNameLabel.style.display = 'block';
    }
  }

  function populateEditDriverDropdownDelivery() {
    toggleDriverNameDelivery();
    const dropdown = document.getElementById('drop_down_edit_driver_id');
    dropdown.innerHTML = ''; // Clear existing options
  
    // Fetch trucking data from the server
    fetch('/fetch-drivers')
      .then(response => response.json())
      .then(drivers => {
        // Populate the dropdown with trucking names and corresponding IDs
        drivers.forEach(driver => {
          const option = document.createElement('option');
          option.value = driver.driver_id;
          option.textContent = driver.driver_name;
          dropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching trucking data:', error);
      });
  }

  function toggleTruckUnitNameDelivery() {
    const truckingNameLabel = document.getElementById('truckUnitIdLabel');
    const editTruckingNameInput = document.getElementById('edit_truck_id');
    const dropdownTruckingName = document.getElementById('drop_down_edit_truck_id');
    const dropdownTruckingNameLabel = document.getElementById('drop_down_edit_truck_id_label');
  
    if (editTruckingNameInput.style.left === '-9999px') {
      // If input is off-screen, make it visible
      editTruckingNameInput.style.position = 'unset';
      editTruckingNameInput.style.left = '';
      truckingNameLabel.style.display = 'block';
  
      // Hide dropdown
      dropdownTruckingName.style.position = 'absolute';
      dropdownTruckingName.style.left = '-9999px';
      dropdownTruckingNameLabel.style.display = 'none';
    } else {
      // If input is visible, make it off-screen
      editTruckingNameInput.style.position = 'absolute';
      editTruckingNameInput.style.left = '-9999px';
      truckingNameLabel.style.display = 'none';
  
      // Show dropdown
      dropdownTruckingName.style.position = 'unset';
      dropdownTruckingName.style.left = '';
      dropdownTruckingNameLabel.style.display = 'block';
    }
  }

  function populateEditTruckUnitDropdownDelivery() {
    toggleTruckUnitNameDelivery();
    const dropdown = document.getElementById('drop_down_edit_truck_id');
    dropdown.innerHTML = ''; // Clear existing options
  
    // Fetch trucking data from the server
    fetch('/fetch-truck-units')
      .then(response => response.json())
      .then(truck_units => {
        // Populate the dropdown with trucking names and corresponding IDs
        truck_units.forEach(truck_unit => {
          const option = document.createElement('option');
          option.value = truck_unit.truck_id;
          option.textContent = truck_unit.truck_name;
          dropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching trucking data:', error);
      });
  }

  function editDeliverySubmit() {
    // Get values from form fields
    const edit_delivery_id = document.getElementById('edit_delivery_id').value;
    const edit_hasno = document.getElementById('edit_hasno').value;
    const edit_helper = document.getElementById('edit_helper').value;
    const edit_bussiness_name = document.getElementById('edit_bussiness_name').value;
    const edit_delivery_address = document.getElementById('edit_delivery_address').value;
    const edit_contact_person = document.getElementById('edit_contact_person').value;
    const edit_contactno = document.getElementById('edit_contactno').value;
    const edit_delivery_date = document.getElementById('edit_delivery_date').value;
    const edit_dispatch_by = document.getElementById('edit_dispatch_by').value;
    const edit_dispatch_date = document.getElementById('edit_dispatch_date').value;
  
    let trucking_id;
    if (document.getElementById('edit_trucking_id').style.left === '-9999px') {
      // If source type input is hidden, use dropdown value
      trucking_id = document.getElementById('drop_down_edit_trucking_id').value;
    } else {
      // If dropdown is hidden, use input value
      trucking_id = document.getElementById('edit_trucking_id').value;
    }

    let driver_id;
    if (document.getElementById('edit_driver_id').style.left === '-9999px') {
      // If source type input is hidden, use dropdown value
      driver_id = document.getElementById('drop_down_edit_driver_id').value;
    } else {
      // If dropdown is hidden, use input value
      driver_id = document.getElementById('edit_driver_id').value;
    }

    let truck_id;
    if (document.getElementById('edit_truck_id').style.left === '-9999px') {
      // If source type input is hidden, use dropdown value
      truck_id = document.getElementById('drop_down_edit_truck_id').value;
    } else {
      // If dropdown is hidden, use input value
      truck_id = document.getElementById('edit_truck_id').value;
    }
  
    // Construct the URL with query parameters
    const url = `/update-info-delivery/${edit_delivery_id}?edit_hasno=${encodeURIComponent(edit_hasno)}&edit_helper=${encodeURIComponent(edit_helper)}&edit_bussiness_name=${encodeURIComponent(edit_bussiness_name)}&edit_delivery_address=${encodeURIComponent(edit_delivery_address)}&edit_contact_person=${encodeURIComponent(edit_contact_person)}&edit_contactno=${encodeURIComponent(edit_contactno)}&edit_delivery_date=${encodeURIComponent(edit_delivery_date)}&edit_dispatch_by=${encodeURIComponent(edit_dispatch_by)}&edit_dispatch_date=${encodeURIComponent(edit_dispatch_date)}&trucking_id=${encodeURIComponent(trucking_id)}&driver_id=${encodeURIComponent(driver_id)}&truck_id=${encodeURIComponent(truck_id)}`;
  
    // Perform a PUT request to update the data
    fetch(url, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update data. Status: ${response.status}`);
        }
  
        // Optionally, you can handle the success case here
        console.log('Data updated successfully');
        alert('Delivery edited successfully');
        toggleEditFormOverlayDelivery(); // Close the form on success
        toggleDeliveries();
      })
      .catch(error => {
        console.error('Error updating Delivery data:', error);
        alert('Error updating Delivery data. Please try again.');
      });
  
    // Prevent the form from submitting in the traditional way
    return false;
  }

  function editDeliverySubmit() {
    // Get values from form fields
    const edit_delivery_id = document.getElementById('edit_delivery_id').value;
    const edit_hasno = document.getElementById('edit_hasno').value;
    const edit_helper = document.getElementById('edit_helper').value;
    const edit_bussiness_name = document.getElementById('edit_bussiness_name').value;
    const edit_delivery_address = document.getElementById('edit_delivery_address').value;
    const edit_contact_person = document.getElementById('edit_contact_person').value;
    const edit_contactno = document.getElementById('edit_contactno').value;
    const edit_delivery_date = document.getElementById('edit_delivery_date').value;
    const edit_dispatch_by = document.getElementById('edit_dispatch_by').value;
    const edit_dispatch_date = document.getElementById('edit_dispatch_date').value;
  
    let trucking_id;
    if (document.getElementById('edit_trucking_id').style.left === '-9999px') {
      // If source type input is hidden, use dropdown value
      trucking_id = document.getElementById('drop_down_edit_trucking_id').value;
    } else {
      // If dropdown is hidden, use input value
      trucking_id = document.getElementById('edit_trucking_id').value;
    }

    let driver_id;
    if (document.getElementById('edit_driver_id').style.left === '-9999px') {
      // If source type input is hidden, use dropdown value
      driver_id = document.getElementById('drop_down_edit_driver_id').value;
    } else {
      // If dropdown is hidden, use input value
      driver_id = document.getElementById('edit_driver_id').value;
    }

    let truck_id;
    if (document.getElementById('edit_truck_id').style.left === '-9999px') {
      // If source type input is hidden, use dropdown value
      truck_id = document.getElementById('drop_down_edit_truck_id').value;
    } else {
      // If dropdown is hidden, use input value
      truck_id = document.getElementById('edit_truck_id').value;
    }
  
    // Construct the URL with query parameters
    const url = `/update-info-delivery/${edit_delivery_id}?edit_hasno=${encodeURIComponent(edit_hasno)}&edit_helper=${encodeURIComponent(edit_helper)}&edit_bussiness_name=${encodeURIComponent(edit_bussiness_name)}&edit_delivery_address=${encodeURIComponent(edit_delivery_address)}&edit_contact_person=${encodeURIComponent(edit_contact_person)}&edit_contactno=${encodeURIComponent(edit_contactno)}&edit_delivery_date=${encodeURIComponent(edit_delivery_date)}&edit_dispatch_by=${encodeURIComponent(edit_dispatch_by)}&edit_dispatch_date=${encodeURIComponent(edit_dispatch_date)}&trucking_id=${encodeURIComponent(trucking_id)}&driver_id=${encodeURIComponent(driver_id)}&truck_id=${encodeURIComponent(truck_id)}`;
  
    // Perform a PUT request to update the data
    fetch(url, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update data. Status: ${response.status}`);
        }
  
        // Optionally, you can handle the success case here
        console.log('Data updated successfully');
        alert('Delivery edited successfully');
        toggleEditFormOverlayDelivery(); // Close the form on success
        toggleDeliveries();
      })
      .catch(error => {
        console.error('Error updating Delivery data:', error);
        alert('Error updating Delivery data. Please try again.');
      });
  
    // Prevent the form from submitting in the traditional way
    return false;
  }

  function changeStatus(deliveryId) {
    var deliveryIdVariable = deliveryId;
    const formContainer = document.querySelector('.change-form-container');
    const form = formContainer.querySelector('form');
    
    const editFormOverlay = document.getElementById('changeformContainer');
    editFormOverlay.style.display = editFormOverlay.style.display === 'block' ? 'none' : 'block';

    document.getElementById('c_delivery_id').value = deliveryIdVariable;

    // Toggle the form container's display style
    formContainer.classList.toggle('active');
    // Optionally, you can focus on the first input field for better user experience
    const firstInput = form.querySelector('input');
    if (firstInput) {
      firstInput.focus(); 
    }
  }

  function toggleChangeEditFormOverlay() {
    const editFormOverlay = document.getElementById('changeformContainer');
    editFormOverlay.style.display = editFormOverlay.style.display === 'none' ? 'block' : 'none';
  }

  function changeStatusCom(deliveryId) {
    var deliveryIdVariable = deliveryId;
    const formContainer = document.querySelector('.update-change-form-container');
    const form = formContainer.querySelector('form');

    const editFormOverlay = document.getElementById('changeformContainerCom');
    editFormOverlay.style.display = editFormOverlay.style.display === 'block' ? 'none' : 'block';

    document.getElementById('com_delivery_id').value = deliveryIdVariable;

    // Toggle the form container's display style
    formContainer.classList.toggle('active');
    // Optionally, you can focus on the first input field for better user experience
    const firstInput = form.querySelector('input');
    if (firstInput) {
      firstInput.focus(); 
    }
  }
  function toggleChangeEditFormOverlayCom() {
    const editFormOverlay = document.getElementById('changeformContainerCom');
    editFormOverlay.style.display = editFormOverlay.style.display === 'none' ? 'block' : 'none';
  }


  function uploadFile(file) {
    const formData = new FormData();
    formData.append('c_receive_proof', file);

    return fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text());
}

function updateDeliveryStatus(c_delivery_id, c_receive_by, c_receive_date, c_status_id, c_receive_proof) {
    const url = `/update-status-delivery/${c_delivery_id}?c_receive_by=${encodeURIComponent(c_receive_by)}&c_receive_date=${encodeURIComponent(c_receive_date)}&c_status_id=${encodeURIComponent(c_status_id)}&c_receive_proof=${encodeURIComponent(c_receive_proof)}`;

    return fetch(url, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to update data. Status: ${response.status}`);
        }
        
        console.log('Data updated successfully');
        alert('Delivery edited successfully');
        toggleChangeEditFormOverlay();
        toggleDeliveries();
    })
    .catch(error => {
        console.error('Error updating Delivery data:', error);
        alert('Error updating Delivery data. Please try again.');
    });
}

function changeStatusDelivery() {
    const c_delivery_id = document.getElementById('c_delivery_id').value;
    const c_receive_by = document.getElementById('c_receive_by').value;
    const c_receive_date = document.getElementById('c_receive_date').value;
    const c_receive_proof_input = document.getElementById('c_receive_proof');
    const c_status_id = 1;

    const c_receive_proof_file = c_receive_proof_input.files[0];

    uploadFile(c_receive_proof_file)
        .then(filePath => updateDeliveryStatus(c_delivery_id, c_receive_by, c_receive_date, c_status_id, filePath))
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Please try again.');
        });

    return false; // Prevent the form from submitting in the traditional way
}

  function compareStatusIdAndNamesDeliveryCom() {
    // Get trucking IDs from the table
    var tableTruckingIds = getAllStatusIdDeliveryCom();
  
    // Get trucking names from the API
    getStatusNames()
      .then(apiTruckingNames => {
        var truckingIdMapping = {};
        // Get only the trucking_ids from the API response as numbers
        apiTruckingNames.forEach(apiData => {
          truckingIdMapping[apiData.status_id] = apiData.status_name;
        });
  
        // Display trucking_names in the HTML table body
        var tableBody = document.getElementById('ComDeliveriesTableBody');
        if (tableBody) {
          tableTruckingIds.forEach(truckingId => {
            // Update the specific <td> with the trucking name for the corresponding trucking_id
            var truckingNameCells = document.querySelectorAll(`[id^="statusName_${truckingId}"]`);
            // Get the common source type name from the mapping
            var commonTruckingName = truckingIdMapping[truckingId];
  
            truckingNameCells.forEach(truckingNameCell => {
              if (truckingNameCell && commonTruckingName) {
                truckingNameCell.innerHTML = commonTruckingName;
              }
            });
          });
        } else {
          console.error('HTML table body not found');
        }
        
  
        return tableTruckingIds;
      })
      .catch(error => {
        console.error('Error fetching or comparing data:', error);
      });
  }
  
  function getAllStatusIdDeliveryCom() {
    var table = document.querySelector('#completedDeliveriesTable');
    var rows = table.getElementsByTagName('tr');
    var statusIds = [];
  
    // Iterate over the rows (starting from index 1 to skip the header row)
    for (var i = 1; i < rows.length; i++) {
      var currentStatusId = getStatusIdFromRowDeliveryCom(rows[i]);
      statusIds.push(currentStatusId);
    }
    console.log(statusIds);
    return statusIds;
  }
  function getStatusIdFromRowDeliveryCom(row) {
  
    var statusIdCell = row.cells[15]; // Adjust the index if needed
    var statusId = statusIdCell.textContent || statusIdCell.innerText;
    return statusId.trim(); // Trim any leading or trailing spaces
  }
  function compareTruckingIdsAndNamesDeliveryCom() {
    // Get trucking IDs from the table
    var tableTruckingIds = getAllTruckingIdsDeliveryCom();
  
    // Get trucking names from the API
    getTruckingNames()
      .then(apiTruckingNames => {
        var truckingIdMapping = {};
        // Get only the trucking_ids from the API response as numbers
        apiTruckingNames.forEach(apiData => {
          truckingIdMapping[apiData.trucking_id] = apiData.trucking_name;
        });
  
        // Display trucking_names in the HTML table body
        var tableBody = document.getElementById('deliveriesTableBody');
        if (tableBody) {
          tableTruckingIds.forEach(truckingId => {
            // Update the specific <td> with the trucking name for the corresponding trucking_id
            var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
            // Get the common source type name from the mapping
            var commonTruckingName = truckingIdMapping[truckingId];
  
            truckingNameCells.forEach(truckingNameCell => {
              if (truckingNameCell && commonTruckingName) {
                truckingNameCell.innerHTML = commonTruckingName;
              }
            });
          });
        } else {
          console.error('HTML table body not found');
        }
  
        return tableTruckingIds;
      })
      .catch(error => {
        console.error('Error fetching or comparing data:', error);
      });
  }
  
  function getAllTruckingIdsDeliveryCom() {
    var table = document.querySelector('#completedDeliveriesTable');
    var rows = table.getElementsByTagName('tr');
    var truckingIds = [];
  
    // Iterate over the rows (starting from index 1 to skip the header row)
    for (var i = 1; i < rows.length; i++) {
      var currentTruckingId = getTruckingIdFromRowDeliveryCom(rows[i]);
      truckingIds.push(currentTruckingId);
    }
    console.log(truckingIds);
    return truckingIds;
  }
  function getTruckingIdFromRowDeliveryCom(row) {
    // Assuming that the trucking ID is in the first column (index 0) of the row
    var truckingIdCell = row.cells[2]; // Adjust the index if needed
    var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
    return truckingId.trim(); // Trim any leading or trailing spaces
  }

  function compareDriverIdsAndNamesDeliveryCom() {
    // Get trucking IDs from the table
    var tableTruckingIds = getAllDriverIdsDeliveryCom();
  
    // Get trucking names from the API
    getDriverNames()
      .then(apiTruckingNames => {
        var truckingIdMapping = {};
        // Get only the trucking_ids from the API response as numbers
        apiTruckingNames.forEach(apiData => {
          truckingIdMapping[apiData.driver_id] = apiData.driver_name;
        });
  
        // Display trucking_names in the HTML table body
        var tableBody = document.getElementById('ComDeliveriesTableBody');
        if (tableBody) {
          tableTruckingIds.forEach(truckingId => {
            // Update the specific <td> with the trucking name for the corresponding trucking_id
            var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
            // Get the common source type name from the mapping
            var commonTruckingName = truckingIdMapping[truckingId];
  
            truckingNameCells.forEach(truckingNameCell => {
              if (truckingNameCell && commonTruckingName) {
                truckingNameCell.innerHTML = commonTruckingName;
              }
            });
          });
        } else {
          console.error('HTML table body not found');
        }
  
        return tableTruckingIds;
      })
      .catch(error => {
        console.error('Error fetching or comparing data:', error);
      });
  }
  
  function getAllDriverIdsDeliveryCom() {
    var table = document.querySelector('#completedDeliveriesTable');
    var rows = table.getElementsByTagName('tr');
    var truckingIds = [];
  
    // Iterate over the rows (starting from index 1 to skip the header row)
    for (var i = 1; i < rows.length; i++) {
      var currentTruckingId = getDriverIdFromRowDeliveryCom(rows[i]);
      truckingIds.push(currentTruckingId);
    }
    console.log(truckingIds);
    return truckingIds;
  }
  function getDriverIdFromRowDeliveryCom(row) {
    // Assuming that the trucking ID is in the first column (index 0) of the row
    var truckingIdCell = row.cells[4]; // Adjust the index if needed
    var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
    return truckingId.trim(); // Trim any leading or trailing spaces
  }

  function compareTruckUnitIdsAndNamesDeliveryCom() {
    // Get trucking IDs from the table
    var tableTruckingIds = getAllTruckUnitsDeliveryCom();
  
    // Get trucking names from the API
    getTruckUnitNames()
      .then(apiTruckingNames => {
        var truckingIdMapping = {};
        // Get only the trucking_ids from the API response as numbers
        apiTruckingNames.forEach(apiData => {
          truckingIdMapping[apiData.truck_id] = apiData.truck_name;
        });
  
        // Display trucking_names in the HTML table body
        var tableBody = document.getElementById('ComDeliveriesTableBody');
        if (tableBody) {
          tableTruckingIds.forEach(truckingId => {
            // Update the specific <td> with the trucking name for the corresponding trucking_id
            var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
            // Get the common source type name from the mapping
            var commonTruckingName = truckingIdMapping[truckingId];
  
            truckingNameCells.forEach(truckingNameCell => {
              if (truckingNameCell && commonTruckingName) {
                truckingNameCell.innerHTML = commonTruckingName;
              }
            });
          });
        } else {
          console.error('HTML table body not found');
        }
  
        return tableTruckingIds;
      })
      .catch(error => {
        console.error('Error fetching or comparing data:', error);
      });
  }
  
  function getAllTruckUnitsDeliveryCom() {
    var table = document.querySelector('#completedDeliveriesTable');
    var rows = table.getElementsByTagName('tr');
    var truckingIds = [];
  
    // Iterate over the rows (starting from index 1 to skip the header row)
    for (var i = 1; i < rows.length; i++) {
      var currentTruckingId = getTruckUnitIdFromRowDeliveryCom(rows[i]);
      truckingIds.push(currentTruckingId);
    }
    console.log(truckingIds);
    return truckingIds;
  }
  function getTruckUnitIdFromRowDeliveryCom(row) {
    // Assuming that the trucking ID is in the first column (index 0) of the row
    var truckingIdCell = row.cells[5]; // Adjust the index if needed
    var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
    return truckingId.trim(); // Trim any leading or trailing spaces
  }

  function compareTruckUnitIdsAndPlateNoDeliveryCom() {
    // Get trucking IDs from the table
    var tableTruckingIds = getAllTruckUnitsPlateNoDeliveryCom();
  
    // Get trucking names from the API
    getTruckUnitPlateNo()
      .then(apiTruckingNames => {
        var truckingIdMapping = {};
        // Get only the trucking_ids from the API response as numbers
        apiTruckingNames.forEach(apiData => {
          truckingIdMapping[apiData.truck_id] = apiData.truck_plateno;
        });
  
        // Display trucking_names in the HTML table body
        var tableBody = document.getElementById('ComDeliveriesTableBody');
        if (tableBody) {
          tableTruckingIds.forEach(truckingId => {
            // Update the specific <td> with the trucking name for the corresponding trucking_id
            var truckingNameCells = document.querySelectorAll(`[id^="truckPlateNo_${truckingId}"]`);
            // Get the common source type name from the mapping
            var commonTruckingName = truckingIdMapping[truckingId];
  
            truckingNameCells.forEach(truckingNameCell => {
              if (truckingNameCell && commonTruckingName) {
                truckingNameCell.innerHTML = commonTruckingName;
              }
            });
          });
        } else {
          console.error('HTML table body not found');
        }
  
        return tableTruckingIds;
      })
      .catch(error => {
        console.error('Error fetching or comparing data:', error);
      });
  }
  
  function getAllTruckUnitsPlateNoDeliveryCom() {
    var table = document.querySelector('#completedDeliveriesTable');
    var rows = table.getElementsByTagName('tr');
    var truckingIds = [];
  
    // Iterate over the rows (starting from index 1 to skip the header row)
    for (var i = 1; i < rows.length; i++) {
      var currentTruckingId = getTruckUnitIdPlateNoFromRowDeliveryCom(rows[i]);
      truckingIds.push(currentTruckingId);
    }
    console.log(truckingIds);
    return truckingIds;
  }
  function getTruckUnitIdPlateNoFromRowDeliveryCom(row) {
    // Assuming that the trucking ID is in the first column (index 0) of the row
    var truckingIdCell = row.cells[6]; // Adjust the index if needed
    var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
    return truckingId.trim(); // Trim any leading or trailing spaces
  }

  function collectDataCom(deliveryId) {
    // Log the collected data for testing
    console.log('Collected data for delivery_id:', deliveryId);

    // Get all rows in the table
    const rows = document.querySelectorAll('tbody tr');
    console.log(rows);

    // Initialize text content for the file
    let fileContent = 'HAULING ASSIGNMENT SLIP' + '\n\n';

    if(rows.length > 1){
      const secondRow = rows[1];
      // Check if the row contains the specified delivery_id
      const rowDeliveryId = secondRow.querySelector('td:nth-child(1)').textContent; // Assuming delivery_id is in the first column
      console.log(rowDeliveryId);
      if (rowDeliveryId === deliveryId) {
          // Retrieve data from the matching row
          const hasNo = secondRow.querySelector('td:nth-child(2)').textContent;
          const truckingId = secondRow.querySelector('td:nth-child(3)').textContent;
          const truckingCompany = secondRow.querySelector('td:nth-child(4)').textContent;
          const driverName = secondRow.querySelector('td:nth-child(5)').textContent;
          const truckUnitPlateNo = secondRow.querySelector('td:nth-child(7)').textContent;
          const helper = secondRow.querySelector('td:nth-child(8)').textContent;
          const bussinessName = secondRow.querySelector('td:nth-child(9)').textContent;
          const deliveryAddress = secondRow.querySelector('td:nth-child(10)').textContent;
          const contactPerson = secondRow.querySelector('td:nth-child(11)').textContent;
          const contactNo = secondRow.querySelector('td:nth-child(12)').textContent;
          const deliveryDate = secondRow.querySelector('td:nth-child(13)').textContent;
          const dispatchBy = secondRow.querySelector('td:nth-child(14)').textContent;
          const dispatchDate = secondRow.querySelector('td:nth-child(15)').textContent;
          const receiveBy = secondRow.querySelector('td:nth-child(17)').textContent;
          const receiveDate = secondRow.querySelector('td:nth-child(18)').textContent;
          console.log(hasNo);
          console.log(truckingId);

          // Append data to the text content
          fileContent += 'Has No: ' + hasNo + '\n\n';
          fileContent += 'TRUCKER INFORMATION\n';
          fileContent += 'Trucker Name: ' + truckingCompany + '\n';
          fileContent += 'Trucker ID: ' + truckingId + '\n';
          fileContent += 'Driver: ' + driverName + '\n';
          fileContent += 'Plate No: ' + truckUnitPlateNo + '\n';
          fileContent += 'Helper: ' + helper + '\n\n';

          fileContent += 'DELIVERY TO\n';
          fileContent += 'Business Name: ' + bussinessName + '\n';
          fileContent += 'Delivery Address: ' + deliveryAddress + '\n';
          fileContent += 'Contact Person: ' + contactPerson + '\n';
          fileContent += 'Contact No: ' + contactNo + '\n';
          fileContent += 'Delivery Date and Time: ' + deliveryDate + '\n\n';

          fileContent += 'DISPATCH INFORMATION\n';
          fileContent += 'Dispatched By: ' + dispatchBy + '\n';
          fileContent += 'Dispatched Date and Time: ' + dispatchDate + '\n\n';

          fileContent += 'DELIVERY ACKNOWLEDGEMENT\n';
          fileContent += 'Received By:' + receiveBy + '\n';
          fileContent += 'Received Date and Time:' + receiveDate + '\n';

           // Create a Blob with the file content
          const blob = new Blob([fileContent], { type: 'docx' });
      
          // Create an anchor element and set the download attribute
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'delivery_data.docx';
      
          // Append the anchor to the body and simulate a click to trigger the download
          document.body.appendChild(a);
          a.click();
      
          // Remove the anchor from the body
          document.body.removeChild(a);
      }
    }
  }

  function editDeliveryCom(deliveryId) {
    const isConfirmed = confirm('Are you sure you want to edit this driver?');
  
    if (isConfirmed) {
      fetch(`/getInfo-delivery/${deliveryId}`, {
        method: 'GET',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
  
        return response.json(); // Convert the response to JSON
      })
      .then(data => {
        console.log('Fetched data:', data);
  
        // Show the form overlay
        changeStatusCom();
        // Populate the form with fetched data after a short delay to ensure the form is displayed
        setTimeout(() => {
          document.getElementById('com_delivery_id').value = data.delivery_id;
          document.getElementById('com_receive_by').value = data.receive_by;
          document.getElementById('com_receive_date').value = data.receive_date;
  
        }, 100);
      })
      .catch(error => {
        console.error('Error fetching driver data:', error);
        alert('Error fetching driver data. Please try again.');
      });
    }
  }
  
  function changeStatusDeliveryCom() {
    // Get values from form fields
    const c_delivery_id = document.getElementById('com_delivery_id').value;
    const c_receive_by = document.getElementById('com_receive_by').value;
    const c_receive_date = document.getElementById('com_receive_date').value;
    const c_receive_proof_input = document.getElementById('com_receive_proof');
    const c_status_id = 1;
  
    const c_receive_proof_file = c_receive_proof_input.files[0];

    uploadFile(c_receive_proof_file)
        .then(filePath => updateDeliveryStatus(c_delivery_id, c_receive_by, c_receive_date, c_status_id, filePath))
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Please try again.');
        });

    return false; // Prevent the form from submitting in the traditional way
}

  function deleteDeliveryCom(delivery_id) {
    // Assuming you have a confirmation from the user
    const isConfirmed = confirm('Are you sure you want to delete this delivery?');
  
    if (isConfirmed) {
        fetch(`/delete-delivery/${delivery_id}`, {
            method: 'POST',
        })
        .then(() => {
            // Display a success message
            alert('delivery deleted successfully');
            // Redirect to the trucking.ejs page after deletion
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting delivery. Please try again.');
        });
    }
  }

  // JavaScript function to display proof overlay
  function displayProof(imageSrc) {
    console.log(imageSrc);
    const proofImage = document.getElementById('proofImage');
    proofImage.src = imageSrc;


    const overlay = document.getElementById('proofOverlay');
    overlay.style.display = 'block';
  }

  function closeProofOverlay() {
    const overlay = document.getElementById('proofOverlay');
    overlay.style.display = 'none';
  }
  
  function toggleMaintenance() {
    window.location.href = '/maintenance';
    Maintenance();
  }

  function Maintenance() {
    // Select the content container
    const contentContainer = document.querySelector('.content');
  
    // Clear the existing content
    contentContainer.innerHTML = '';
  
    // Fetch and load the new content
    fetch('/get-maintenance')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        document.querySelector('.content').innerHTML = html;
      })
      .catch(error => {
        console.error('Error navigating to maintenance:', error);
      });
  }

  function updateDeliveryStatusMaintenance(trucking_id, truck_id, driver_id, receipt_proof) {
    
    const apiEndpoint = `/add-maintenance?trucking_id=${encodeURIComponent(trucking_id)}&truck_id=${encodeURIComponent(truck_id)}&driver_id=${encodeURIComponent(driver_id)}&receipt_proof=${encodeURIComponent(receipt_proof)}`;

    try {
      // Perform the POST request to add the trucking company
      const response = fetch(apiEndpoint, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert('Maintenance added successfully');
      toggleMaintenance();
    } catch (error) {
      console.error('Error adding Maintenance:', error);
      alert('Maintenance added successfully');
      toggleMaintenance();
    }
  } 

  // If the user clicks "Cancel" in the confirmation dialog, do nothing


  function addMaintenance() {
    const trucking_id = document.getElementById('trucking_id').value;
    const truck_id = document.getElementById('truck_id').value;
    const driver_id = document.getElementById('driver_id').value;
    const receipt_proof = document.getElementById('com_receive_proof');

      // Check if a file is selected
      if (!receipt_proof.files || receipt_proof.files.length === 0) {
        console.error('No file selected.');
        return Promise.reject(new Error('No file selected.'));
    }
    const c_receive_proof_file = receipt_proof.files[0];
    console.log(c_receive_proof_file)
  
    const isConfirmed = confirm('Are you sure you want to add this trucking company?');
  
    // Explicitly check the user's choice
    if (isConfirmed) {
      // Assuming you have a predefined API endpoint for adding trucking companies
      uploadFileMaintenanceData(c_receive_proof_file)
        .then(filePath => updateDeliveryStatusMaintenance(trucking_id, truck_id, driver_id, filePath))
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Maintenance added successfully');
        });
    } else{
      toggleMaintenance();
    }
    // If the user clicks "Cancel" in the confirmation dialog, do nothing
  }

  function toggleFormContainerMaintenance() {
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    populateTruckingDropdownMaintenance();
    populateDriversDropdownMaintenance();
    populateTruckUnitsDropdownMaintenance();
  } 

  function uploadFileMaintenance(file) {
    const formData = new FormData();
    formData.append('receipt_proof', file);

    return fetch('/receipt', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text());
}

function populateTruckingDropdownMaintenance() {
  const dropdown = document.getElementById('trucking_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/get-truckings')
    .then(response => response.json())
    .then(truckings => {
      // Populate the dropdown with trucking names and corresponding IDs
      truckings.forEach(trucking => {
        const option = document.createElement('option');
        option.value = trucking.trucking_id;
        option.textContent = trucking.trucking_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
    });
}

function populateDriversDropdownMaintenance() {
  const dropdown = document.getElementById('driver_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/fetch-drivers')
    .then(response => response.json())
    .then(drivers => {
      // Populate the dropdown with trucking names and corresponding IDs
      drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.driver_id;
        option.textContent = driver.driver_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching drivers data:', error);
    });
}

function populateTruckUnitsDropdownMaintenance() {
  const dropdown = document.getElementById('truck_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/fetch-truck-units')
    .then(response => response.json())
    .then(truckUnits => {
      // Populate the dropdown with trucking names and corresponding IDs
      truckUnits.forEach(truckUnit => {
        const option = document.createElement('option');
        option.value = truckUnit.truck_id
        option.textContent = truckUnit.truck_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching drivers data:', error);
    });
}

function deleteMaintenance(maintenanceId) {
  // Assuming you have a confirmation from the user
  const isConfirmed = confirm('Are you sure you want to delete this maintenance record?');

  if (isConfirmed) {
    fetch(`/delete-maintenance/${maintenanceId}`, {
      method: 'DELETE', // Change method to DELETE
    })
      .then(response => {
        if (response.ok) {
          // Display a success message
          alert('Maintenance record deleted successfully');
          // Redirect to the trucking.ejs page after deletion
        } else {
          // Handle non-successful responses
          alert('Error deleting maintenance record. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error deleting maintenance record. Please try again.');
      });
  }
}

function displayProofMaintenance(imageSrc) {
  console.log(imageSrc);
  const proofImage = document.getElementById('proofImage');
  proofImage.src = imageSrc;


  const overlay = document.getElementById('proofOverlay');
  overlay.style.display = 'block';
}

function closeProofOverlayMaintenance() {
  const overlay = document.getElementById('proofOverlay');
  overlay.style.display = 'none';
}

function toggleMaintenance() {
  window.location.href = '/maintenance';
  Maintenance();
}

function compareTruckingIdsAndNamesDeliveryMain() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllTruckingIdsDeliveryMain();

  // Get trucking names from the API
  getTruckingNames()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.trucking_id] = apiData.trucking_name;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('maintenanceTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllTruckingIdsDeliveryMain() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var truckingIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentTruckingId = getTruckingIdFromRowDeliveryMain(rows[i]);
    truckingIds.push(currentTruckingId);
  }
  console.log(truckingIds);
  return truckingIds;
}
function getTruckingIdFromRowDeliveryMain(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var truckingIdCell = row.cells[1]; // Adjust the index if needed
  var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
  return truckingId.trim(); // Trim any leading or trailing spaces
}

function compareTruckUnitIdsAndNamesDeliveryMain() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllTruckUnitsDeliveryMain();

  // Get trucking names from the API
  getTruckUnitNames()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.truck_id] = apiData.truck_name;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('maintenanceTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllTruckUnitsDeliveryMain() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var truckingIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentTruckingId = getTruckUnitIdFromRowDeliveryMain(rows[i]);
    truckingIds.push(currentTruckingId);
  }
  console.log(truckingIds);
  return truckingIds;
}
function getTruckUnitIdFromRowDeliveryMain(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var truckingIdCell = row.cells[2]; // Adjust the index if needed
  var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
  return truckingId.trim(); // Trim any leading or trailing spaces
}

function compareTruckUnitIdsAndPlateNoDeliveryMain() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllTruckUnitsPlateNoDeliveryMain();

  // Get trucking names from the API
  getTruckUnitPlateNo()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.truck_id] = apiData.truck_plateno;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('maintenanceTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="truckPlateNo_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllTruckUnitsPlateNoDeliveryMain() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var truckingIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentTruckingId = getTruckUnitIdPlateNoFromRowDeliveryMain(rows[i]);
    truckingIds.push(currentTruckingId);
  }
  console.log(truckingIds);
  return truckingIds;
}
function getTruckUnitIdPlateNoFromRowDeliveryMain(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var truckingIdCell = row.cells[3]; // Adjust the index if needed
  var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
  return truckingId.trim(); // Trim any leading or trailing spaces
}

function compareDriverIdsAndNamesDeliveryMain() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllDriverIdsDeliveryMain();

  // Get trucking names from the API
  getDriverNames()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.driver_id] = apiData.driver_name;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('maintenanceTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="truckingName_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllDriverIdsDeliveryMain() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var truckingIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentTruckingId = getDriverIdFromRowDeliveryMain(rows[i]);
    truckingIds.push(currentTruckingId);
  }
  console.log(truckingIds);
  return truckingIds;
}
function getDriverIdFromRowDeliveryMain(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var truckingIdCell = row.cells[4]; // Adjust the index if needed
  var truckingId = truckingIdCell.  textContent || truckingIdCell.innerText;
  return truckingId.trim(); // Trim any leading or trailing spaces
}

function editMaintenance(maintenanceId) {
  fetch(`/getInfo-maintenance/${maintenanceId}`, {
    method: 'GET',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return response.json(); // Convert the response to JSON
  })
  .then(data => {
    console.log('Fetched data:', data);

    // Show the form overlay
    toggleChangeEditFormOverlayMain();
    populateEditTruckingDropdownDeliveryMain();
    populateEditDriverDropdownDeliveryMain();
    populateEditTruckUnitDropdownDeliveryMain();

    setTimeout(() => {
      populateEditTruckingDropdownDeliveryMain();
      populateEditDriverDropdownDeliveryMain();
      populateEditTruckUnitDropdownDeliveryMain();
      }, 100);
    // Populate the form with fetched data after a short delay to ensure the form is displayed
    setTimeout(() => {
      document.getElementById('maintenance_id').value = data.maintenance_id;
      document.getElementById('edit_trucking_id').value = data.trucking_id;
      document.getElementById('edit_driver_id').value = data.driver_id;
      document.getElementById('edit_truck_id').value = data.truck_id;
    }, 100);
  })
  .catch(error => {
    console.error('Error fetching maintenance data:', error);
    alert('Error fetching maintenance data. Please try again.');
  });
}

function toggleChangeEditFormOverlayMain() {
  const editFormOverlay = document.getElementById('editFormOverlay');
  editFormOverlay.style.display = editFormOverlay.style.display === 'none' ? 'block' : 'none';
}

function toggleTruckingNameDeliveryMain() {
  const truckingNameLabel = document.getElementById('truckingIdLabel');
  const editTruckingNameInput = document.getElementById('edit_trucking_id');
  const dropdownTruckingName = document.getElementById('drop_down_edit_trucking_id');
  const dropdownTruckingNameLabel = document.getElementById('drop_down_edit_trucking_id_label');

  if (editTruckingNameInput.style.left === '-9999px') {
    // If input is off-screen, make it visible
    editTruckingNameInput.style.position = 'unset';
    editTruckingNameInput.style.left = '';
    truckingNameLabel.style.display = 'block';

    // Hide dropdown
    dropdownTruckingName.style.position = 'absolute';
    dropdownTruckingName.style.left = '-9999px';
    dropdownTruckingNameLabel.style.display = 'none';
  } else {
    // If input is visible, make it off-screen
    editTruckingNameInput.style.position = 'absolute';
    editTruckingNameInput.style.left = '-9999px';
    truckingNameLabel.style.display = 'none';

    // Show dropdown
    dropdownTruckingName.style.position = 'unset';
    dropdownTruckingName.style.left = '';
    dropdownTruckingNameLabel.style.display = 'block';
  }
}

function populateEditTruckingDropdownDeliveryMain() {
  toggleTruckingNameDeliveryMain();
  const dropdown = document.getElementById('drop_down_edit_trucking_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/get-truckings')
    .then(response => response.json())
    .then(truckings => {
      // Populate the dropdown with trucking names and corresponding IDs
      truckings.forEach(trucking => {
        const option = document.createElement('option');
        option.value = trucking.trucking_id;
        option.textContent = trucking.trucking_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
    });
}

function toggleDriverNameDeliveryMain() {
  const truckingNameLabel = document.getElementById('driverIdLabel');
  const editTruckingNameInput = document.getElementById('edit_driver_id');
  const dropdownTruckingName = document.getElementById('drop_down_edit_driver_id');
  const dropdownTruckingNameLabel = document.getElementById('drop_down_edit_driver_id_label');

  if (editTruckingNameInput.style.left === '-9999px') {
    // If input is off-screen, make it visible
    editTruckingNameInput.style.position = 'unset';
    editTruckingNameInput.style.left = '';
    truckingNameLabel.style.display = 'block';

    // Hide dropdown
    dropdownTruckingName.style.position = 'absolute';
    dropdownTruckingName.style.left = '-9999px';
    dropdownTruckingNameLabel.style.display = 'none';
  } else {
    // If input is visible, make it off-screen
    editTruckingNameInput.style.position = 'absolute';
    editTruckingNameInput.style.left = '-9999px';
    truckingNameLabel.style.display = 'none';

    // Show dropdown
    dropdownTruckingName.style.position = 'unset';
    dropdownTruckingName.style.left = '';
    dropdownTruckingNameLabel.style.display = 'block';
  }
}

function populateEditDriverDropdownDeliveryMain() {
  toggleDriverNameDeliveryMain();
  const dropdown = document.getElementById('drop_down_edit_driver_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/fetch-drivers')
    .then(response => response.json())
    .then(drivers => {
      // Populate the dropdown with trucking names and corresponding IDs
      drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.driver_id;
        option.textContent = driver.driver_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
    });
}

function toggleTruckUnitNameDeliveryMain() {
  const truckingNameLabel = document.getElementById('truckUnitIdLabel');
  const editTruckingNameInput = document.getElementById('edit_truck_id');
  const dropdownTruckingName = document.getElementById('drop_down_edit_truck_id');
  const dropdownTruckingNameLabel = document.getElementById('drop_down_edit_truck_id_label');

  if (editTruckingNameInput.style.left === '-9999px') {
    // If input is off-screen, make it visible
    editTruckingNameInput.style.position = 'unset';
    editTruckingNameInput.style.left = '';
    truckingNameLabel.style.display = 'block';

    // Hide dropdown
    dropdownTruckingName.style.position = 'absolute';
    dropdownTruckingName.style.left = '-9999px';
    dropdownTruckingNameLabel.style.display = 'none';
  } else {
    // If input is visible, make it off-screen
    editTruckingNameInput.style.position = 'absolute';
    editTruckingNameInput.style.left = '-9999px';
    truckingNameLabel.style.display = 'none';

    // Show dropdown
    dropdownTruckingName.style.position = 'unset';
    dropdownTruckingName.style.left = '';
    dropdownTruckingNameLabel.style.display = 'block';
  }
}

function populateEditTruckUnitDropdownDeliveryMain() {
  toggleTruckUnitNameDeliveryMain();
  const dropdown = document.getElementById('drop_down_edit_truck_id');
  dropdown.innerHTML = ''; // Clear existing options

  // Fetch trucking data from the server
  fetch('/fetch-truck-units')
    .then(response => response.json())
    .then(truck_units => {
      // Populate the dropdown with trucking names and corresponding IDs
      truck_units.forEach(truck_unit => {
        const option = document.createElement('option');
        option.value = truck_unit.truck_id;
        option.textContent = truck_unit.truck_name;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
    });
}

function editTruckingSubmitMaintenance() {
  // Get values from form fields
  const isConfirmed = confirm('Are you sure you want to edit this maintenance record?');
  const maintenanceId = document.getElementById('maintenance_id').value;

  let truckingId;
  if (document.getElementById('edit_trucking_id').style.left === '-9999px') {
    // If source type input is hidden, use dropdown value
    truckingId = document.getElementById('drop_down_edit_trucking_id').value;
  } else {
    // If dropdown is hidden, use input value
    truckingId = document.getElementById('edit_trucking_id').value;
  }

  let driver_id;
    if (document.getElementById('edit_driver_id').style.left === '-9999px') {
      // If source type input is hidden, use dropdown value
      driver_id = document.getElementById('drop_down_edit_driver_id').value;
    } else {
      // If dropdown is hidden, use input value
      driver_id = document.getElementById('edit_driver_id').value;
    }

    let truck_id;
    if (document.getElementById('edit_truck_id').style.left === '-9999px') {
      // If source type input is hidden, use dropdown value
      truck_id = document.getElementById('drop_down_edit_truck_id').value;
    } else {
      // If dropdown is hidden, use input value
      truck_id = document.getElementById('edit_truck_id').value;
    }
    console.log(maintenanceId);
    console.log(truckingId);
    console.log(driver_id);
    console.log(truck_id);

    const receipt_proof = document.getElementById('receipt_proof');
    
    // Check if a file is selected
    if (!receipt_proof.files || receipt_proof.files.length === 0) {
        console.error('No file selected.');
        return Promise.reject(new Error('No file selected.'));
    }

    const c_receive_proof_file = receipt_proof.files[0];
    if(isConfirmed){
      uploadFileMaintenanceData(c_receive_proof_file)
        .then(filePath => updateMaintenanceData(maintenanceId, truckingId, driver_id, truck_id, filePath))
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Please try again.');
        });

    }
    return false; // Prevent the form from submitting in the traditional way
}

function updateMaintenanceData(maintenance_id, trucking_id, driver_id, truck_id, receipt_proof) {
  const url = `/update-maintenance/${maintenance_id}?trucking_id=${encodeURIComponent(trucking_id)}&driver_id=${encodeURIComponent(driver_id)}&truck_id=${encodeURIComponent(truck_id)}&receipt_proof=${encodeURIComponent(receipt_proof)}`;

  return fetch(url, {
      method: 'PUT',
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Failed to update data. Status: ${response.status}`);
      }
      
      console.log('Data updated successfully');
      alert('Maintenance edited successfully');
      toggleChangeEditFormOverlayMain();
      toggleMaintenance();
  })
  .catch(error => {
      console.error('Error updating Maintenance data:', error);
      alert('Error updating Maintenance data. Please try again.');
  });
}

function uploadFileMaintenanceData(file) {
    const formData = new FormData();
    formData.append('receipt_proof', file);

    return fetch('/receipt', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text());
  }

  function toggleBilling() {
    window.location.href = '/billing';
    Billing();
  }
  function Billing() {
    // Select the content container
    const contentContainer = document.querySelector('.content');
  
    // Clear the existing content
    contentContainer.innerHTML = '';
  
    // Fetch and load the new content
    fetch('/get-billing')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        document.querySelector('.content').innerHTML = html;
      })
      .catch(error => {
        console.error('Error navigating to billing:', error);
      });
  }

  function toggleFormContainerBilling() {
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
  } 

  function addBilling() {
    // Fetch all delivery IDs
    fetch('/get-delivery-ids', {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch delivery IDs. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(deliveryIdsFromGetDeliveryIds => {
      console.log(deliveryIdsFromGetDeliveryIds);
      // Fetch deliveries with origin
      fetch('/getDeliveriesWithOrigin')
        .then(response => response.json())
        .then(deliveriesWithOrigin => {
          console.log('Deliveries with non-empty origin:', deliveriesWithOrigin);
  
          // Extract delivery_id values from both arrays
          const allDeliveryIds = deliveryIdsFromGetDeliveryIds;
          const deliveriesWithOriginIds = deliveriesWithOrigin.map(item => item.delivery_id);
  
          console.log(allDeliveryIds);
  
          // Filter unique delivery IDs not present in deliveriesWithOrigin
          const uniqueDeliveryIds = allDeliveryIds.filter(id => !deliveriesWithOriginIds.includes(id));
          console.log(uniqueDeliveryIds);
  
          // Populate the dropdown with unique delivery IDs
          toggleFormContainerBilling();
          const deliveryDropdown = document.getElementById('delivery_id');
          deliveryDropdown.innerHTML = ''; // Clear existing options
  
          uniqueDeliveryIds.forEach(deliveryId => {
            const option = document.createElement('option');
            option.value = deliveryId;
            option.textContent = deliveryId;
            deliveryDropdown.appendChild(option);
          });
        })
        .catch(error => {
          console.error('Error fetching deliveries with origin:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching delivery IDs:', error);
      alert('Error fetching delivery IDs. Please try again.');
    });
  }

  // Function to handle dropdown selection
function onDeliveryIdChange() {
  const selectedDeliveryId = document.getElementById('delivery_id').value;

  // Fetch data associated with the selected delivery ID
  fetch(`/get-delivery/${selectedDeliveryId}`, {
    method: 'GET',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch delivery data. Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Populate form fields with the fetched data
    document.getElementById('delivery_date').value = data.delivery_date;
    document.getElementById('delivery_address').value = data.delivery_address;
    document.getElementById('hasno').value = data.hasno;
    document.getElementById('truck_id').value = data.truck_id;
  })
  .catch(error => {
    console.error('Error fetching delivery data:', error);
    alert('Error fetching delivery data. Please try again.');
  });
}

async function submitBilling() {
  const isConfirmed = confirm('Are you sure you want to add this driver?');

  const delivery_id = document.getElementById('delivery_id').value;
  const delivery_date = document.getElementById('delivery_date').value;
  const delivery_address = document.getElementById('delivery_address').value;
  const hasno = document.getElementById('hasno').value;
  const truck_id = document.getElementById('truck_id').value;
  const origin = document.getElementById('origin').value;
  const consignee = document.getElementById('consignee').value;
  const items = document.getElementById('items').value;
  const qty = document.getElementById('qty').value;

  if (isConfirmed) {
    try {
      const apiEndpoint = `/add-billing?delivery_id=${encodeURIComponent(delivery_id)}&delivery_date=${encodeURIComponent(delivery_date)}&delivery_address=${encodeURIComponent(delivery_address)}&hasno=${encodeURIComponent(hasno)}&truck_id=${encodeURIComponent(truck_id)}&origin=${encodeURIComponent(origin)}&consignee=${encodeURIComponent(consignee)}&items=${encodeURIComponent(items)}&qty=${encodeURIComponent(qty)}`;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(`Server error: ${result.error}`);
      }
      alert('Billing added successfully');
      toggleBilling();
    } catch (error) {
      console.error('Error adding a billing:', error.message);
      toggleBilling();
    }
  }
}

function compareTruckUnitIdsAndPlateNoDeliveryBill() {
  // Get trucking IDs from the table
  var tableTruckingIds = getAllTruckUnitsPlateNoDeliveryBill();

  // Get trucking names from the API
  getTruckUnitPlateNo()
    .then(apiTruckingNames => {
      var truckingIdMapping = {};
      // Get only the trucking_ids from the API response as numbers
      apiTruckingNames.forEach(apiData => {
        truckingIdMapping[apiData.truck_id] = apiData.truck_plateno;
      });

      // Display trucking_names in the HTML table body
      var tableBody = document.getElementById('billingTableBody');
      if (tableBody) {
        tableTruckingIds.forEach(truckingId => {
          // Update the specific <td> with the trucking name for the corresponding trucking_id
          var truckingNameCells = document.querySelectorAll(`[id^="truckPlateNo_${truckingId}"]`);
          // Get the common source type name from the mapping
          var commonTruckingName = truckingIdMapping[truckingId];

          truckingNameCells.forEach(truckingNameCell => {
            if (truckingNameCell && commonTruckingName) {
              truckingNameCell.innerHTML = commonTruckingName;
            }
          });
        });
      } else {
        console.error('HTML table body not found');
      }

      return tableTruckingIds;
    })
    .catch(error => {
      console.error('Error fetching or comparing data:', error);
    });
}

function getAllTruckUnitsPlateNoDeliveryBill() {
  var table = document.querySelector('table');
  var rows = table.getElementsByTagName('tr');
  var truckingIds = [];

  // Iterate over the rows (starting from index 1 to skip the header row)
  for (var i = 1; i < rows.length; i++) {
    var currentTruckingId = getTruckUnitIdPlateNoFromRowDeliveryBIll(rows[i]);
    truckingIds.push(currentTruckingId);
  }
  console.log(truckingIds);
  return truckingIds;
}
function getTruckUnitIdPlateNoFromRowDeliveryBIll(row) {
  // Assuming that the trucking ID is in the first column (index 0) of the row
  var truckingIdCell = row.cells[6]; // Adjust the index if needed
  var truckingId = truckingIdCell.textContent || truckingIdCell.innerText;
  return truckingId.trim(); // Trim any leading or trailing spaces
}

function deleteBilling(billingId) {
  // Assuming you have a confirmation from the user
  const isConfirmed = confirm('Are you sure you want to delete this billing record?');

  if (isConfirmed) {
    fetch(`/delete-billing/${billingId}`, {
      method: 'DELETE', // Change method to DELETE
    })
      .then(response => {
        if (response.ok) {
          // Display a success message
          alert('Billing record deleted successfully');
          // Redirect to the trucking.ejs page after deletion
        } else {
          // Handle non-successful responses
          alert('Error deleting billing record. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error deleting billing record. Please try again.');
      });
  }
}

function editBilling(billingId) {
  // Fetch data for the specific truckingId
  const isConfirmed = confirm('Are you sure you want to edit this billing record?');

  if (isConfirmed) {
    fetch(`/getInfo-billing/${billingId}`, {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      return response.json(); // Convert the response to JSON
    })
    .then(data => {
      console.log('Fetched data:', data);

      // Show the form overlay
      toggleEditFormOverlayBilling();

      // Populate the form with fetched data after a short delay to ensure the form is displayed
      setTimeout(() => {
        document.getElementById('edit_billing_id').value = data.billing_id;
        document.getElementById('edit_origin').value = data.origin;
        document.getElementById('edit_consignee').value = data.consignee;
        document.getElementById('edit_items').value = data.items;
        document.getElementById('edit_qty').value = data.qty;
      }, 100);
    })
    .catch(error => {
      console.error('Error fetching trucking data:', error);
      alert('Error fetching trucking data. Please try again.');
    });
  }
}

function toggleEditFormOverlayBilling() {
  const editFormOverlay = document.getElementById('editFormOverlay');
  editFormOverlay.style.display = editFormOverlay.style.display === 'none' ? 'block' : 'none';
}

function editBillingSubmit() {
  const edit_billing_id = document.getElementById('edit_billing_id').value;
  const edit_origin = document.getElementById('edit_origin').value;
  const edit_consignee = document.getElementById('edit_consignee').value;
  const edit_items = document.getElementById('edit_items').value;
  const edit_qty = document.getElementById('edit_qty').value;

  // Construct the URL with query parameters
  const url = `/updateInfo-billing/${edit_billing_id}?edit_origin=${encodeURIComponent(edit_origin)}&edit_consignee=${encodeURIComponent(edit_consignee)}&edit_items=${encodeURIComponent(edit_items)}&edit_qty=${encodeURIComponent(edit_qty)}`;

  // Perform a PUT request to update the data
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to update data. Status: ${response.status}`);
    }

    // Optionally, you can handle the success case here
    console.log('Data updated successfully');
    alert('Successfully updating billing data.');
    toggleBilling();
  })
  .catch(error => {
    console.error('Error updating trucking data:', error);
    alert('Error updating billing data. Please try again.');
  });

  // Prevent the form from submitting in the traditional way
  return false;
}

function exportTableToExcel(){
  let data = document.getElementById('exportTable');
  var fp=XLSX.utils.table_to_book(data ,{sheet:'sheet1'})
  XLSX.write(fp,{
    bookType:'xlsx',
    type:'base64'
  });
  XLSX.writeFile(fp, 'billing.xlsx');
}

function editUser() {
  const user_id = 1;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  // Construct the URL with query parameters
  const url = `/updateInfo-user/${user_id}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  // Perform a PUT request to update the data
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to update data. Status: ${response.status}`);
    }

    // Optionally, you can handle the success case here
    console.log('Data updated successfully');
    toggleLogout();
  })
  .catch(error => {
    console.error('Error updating data:', error);
    alert('Error updating data. Please try again.');
  });

  // Prevent the form from submitting in the traditional way
  return false;
}
function getDeliveriesWithOrigin() {
  fetch('/getDeliveriesWithOrigin')
    .then(response => response.json())
    .then(deliveriesData => {
      console.log('Deliveries with non-empty origin:', deliveriesData);
      // Process the data as needed
    })
    .catch(error => {
      console.error('Error fetching deliveries with origin:', error);
    });
}

