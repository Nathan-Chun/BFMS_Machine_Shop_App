// This file contains the JavaScript code that implements the functionality of the BFMS Machine Shop website.

document.addEventListener("DOMContentLoaded", function() {
    const materialRadios = document.querySelectorAll('input[name="material"]');
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    const speedDisplay = document.getElementById("speed");
    const feedDisplay = document.getElementById("feed");
    const feedRateDisplay = document.getElementById("feed rate");
    const SFMDisplay = document.getElementById("SFM");

    let selectedMaterial = "Non-alloy steel";
    let selectedSize = "1";
    let rowIndex = 1; // Default index for Aluminum size 1
    let parsedData = null;

    // Load CSV data
    fetch('data/Center_Drill_Speeds_and_Feeds.csv')
        .then(response => response.text())
        .then(data => {
            parsedData = parseCSV(data);
            populateMaterialButtons(parsedData);
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
        const materialRowMap = {
            "Non-alloy steel": 0,
            "Low alloy steel": 4,
            "Stainless steel": 5,
            "Grey cast iron": 6,
            "Nodular cast iron": 8,
            "Malleable cast iron": 9,
            "Aluminum": 10,
        };

        rowIndex = materialRowMap[selectedMaterial] ?? 10;
    }

    function updateResults(data) {
        // console.log(rowIndex);
        // console.log(selectedMaterial);
        const speedColumnName = selectedSize + " Speed";
        // console.log(speedColumnName);
        const feedColumnName = selectedSize + " Feed";

        // String to float
        floatSpeed = parseFloat(data[rowIndex][speedColumnName]);
        
        floatFeed = parseFloat(data[rowIndex][feedColumnName]);
        // console.log(floatSpeed);

        //Feed Rate Calc
        feedRate = floatFeed*floatSpeed;

        // SFM Calc
        let sizeDict = {
            1: 0.046875,
            2: 0.0625,
            3: 0.09375,
            4: 0.125,
            5: 0.1875,
            6: 0.21875,
        };
        size = sizeDict[parseFloat(selectedSize)];
        // console.log(size);
        SFM = floatSpeed * size * 0.262;
        console.log("SFM:", SFM);
        console.log("Feed rate:", feedRate);
        console.log("FPT:", floatFeed);
        console.log("Spindle Speed: ", floatSpeed);

// value="0.046875" checked> #1 (3/64") </label><br>
//                 <label><input type="radio" name="size" value="0.0625"> #2 (1/16") </label><br>
//                 <label><input type="radio" name="size" value="0.09375"> #3 (3/32") </label><br>
//                 <label><input type="radio" name="size" value="0.0625"> #4 (1/8") </label><br>
//                 <label><input type="radio" name="size" value="0.1875"> #5 (3/16") </label><br>
//                 <label><input type="radio" name="size" value="0.21875"
        if (!data[rowIndex]) {
            console.error(`Row at index ${rowIndex} does not exist.`);
            return;
        }
        speedDisplay.textContent = "Spindle speed: "+ data[rowIndex][speedColumnName]  + " (RPM)";
        feedDisplay.textContent = "FPT: "+ data[rowIndex][feedColumnName];
        feedRateDisplay.textContent = "Feed rate: " +feedRate;
        SFMDisplay.textContent = "SFM: " + Math.round(SFM);
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

        // Create calculator button options
    function populateMaterialButtons(data) {
        const materialForm = document.getElementById("materialForm");
        materialForm.innerHTML = ""; // Clear any existing buttons

        const uniqueMaterials = [...new Set(data.map(row => row["Material"]?.trim()).filter(Boolean))];
        // console.log(uniqueMaterials);
        uniqueMaterials.forEach((material, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");

            input.type = "radio";
            input.name = "material";
            input.value = material;
            if (index === 0) {
                input.checked = true;
                selectedMaterial = material;
                setMaterialRow();
            }

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${material}`));
            materialForm.appendChild(label);
            materialForm.appendChild(document.createElement("br"));
        });

        // Add listeners after elements are added
        const materialRadios = document.querySelectorAll('input[name="material"]');
        materialRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                selectedMaterial = this.value;
                setMaterialRow();
                if (parsedData) {
                    updateResults(parsedData);
                    // console.log("CSV loaded. Example row:", parsedData[0]);
                    // console.log("Unique materials:", uniqueMaterials);
                }
            });
        });
    }
});