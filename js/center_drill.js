// This file contains the JavaScript code that implements the functionality of the BFMS Machine Shop website.

document.addEventListener("DOMContentLoaded", function() {
    const materialRadios = document.querySelectorAll('input[name="material"]');
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    const speedDisplay = document.getElementById("speed");
    const feedDisplay = document.getElementById("feed");

    let selectedMaterial = "Aluminum";
    let selectedSize = "1";
    let rowIndex = 10; // Default index for Aluminum size 1
    let parsedData = null;

    // Load CSV data
    fetch('data/Center_Drill_Speeds_and_Feeds.csv')
        .then(response => response.text())
        .then(data => {
            parsedData = parseCSV(data);
            console.log(parsedData);
            updateResults(parsedData);
        });

    // Event listeners for material selection
    materialRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectedMaterial = this.value;
            console.log(parsedData);
            setMaterialRow();
            if (parsedData){
                updateResults(parsedData);
            }
        });
    });

    // Event listeners for size selection
    sizeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectedSize = this.value;
            if (parsedData) {
                updateResults(parsedData);
            }
        });
    });

    function setMaterialRow() {
        switch (selectedMaterial) {
            case "Aluminum":
                rowIndex = 10;
                break;
            case "Low alloy steel":
                rowIndex = 4;
                break;
            case "Stainless steel":
                rowIndex = 5;
                break;
            default:
                rowIndex = 10;
        }
    }

    function updateResults(data) {
        const speedColumnName = selectedSize + " Speed";
        const feedColumnName = selectedSize + " Feed";
        if (!data[rowIndex]) {
            console.error(`Row at index ${rowIndex} does not exist.`);
            return;
        }
        speedDisplay.textContent = "Speed: "+ data[rowIndex][speedColumnName]  + "  RPM";
        feedDisplay.textContent = "Speed: "+ data[rowIndex][feedColumnName] + "  IPT (Inches/Tooth)";
    }

    function parseCSV(data) {
        const rows = data.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const result = rows.slice(1).map(row => {
            return row.reduce((acc, value, index) => {
                acc[headers[index]] = value;
                return acc;
            }, {});
        });
        return result;
    }
});