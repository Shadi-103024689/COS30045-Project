var social = "socialCSV";
var socialPath = "./Datasets/rawSocial.csv";
var health = "healthCSV";
var healthPath = "./Datasets/healthStatus.csv";
// Function to fetch and display CSV file content
function displayCSV(path, containerName) {
  fetch(`${path}`)
    .then((response) => response.text())
    .then((csv) => {
      const rows = csv.split("\n");
      let html = "<table>";
      rows.forEach((row) => {
        html += "<tr>";
        const columns = row.split(",");
        columns.forEach((column) => {
          html += `<td>${column}</td>`;
        });
        html += "</tr>";
      });
      html += "</table>";
      document.getElementById(`${containerName}`).innerHTML = html;
    });
}

// Call the function to display CSV content
displayCSV(healthPath, health);
displayCSV(socialPath, social);
