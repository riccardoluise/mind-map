// src/services/dataLoader.js
function loadData(callback) {
    d3.json("src/data/mindMapData.json")
        .then(data => callback(data))
        .catch(error => {
            console.error("Error loading the JSON file:", error);
        });
}
