// Function to fetch and display CSV file content
function displayCSV() {
  fetch("./Datasets/healthStatus.csv")
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
      document.getElementById("csv-content").innerHTML = html;
    });
}

// Call the function to display CSV content
displayCSV();
