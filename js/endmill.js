//Material, diameter

document.addEventListener("DOMContentLoaded", function() {
    const materialRadios = document.querySelectorAll('input[name="material"]');
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    const speedDisplay = document.getElementById("speed");
    const feedDisplay = document.getElementById("feed");

    let selectedMaterial = "Non-alloy steel";
    let selectedSize = "≤0.3125";
    let rowIndex = 0; // Default index for Aluminum size 1
    let parsedData = null;

    // Load CSV data
    fetch('data/Endmill_Speeds_and_Feeds.csv')
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
            console.log(selectedSize);
            if (parsedData) {
                updateResults(parsedData);
            }
        });
    });

    function setMaterialRow() {
        switch (selectedMaterial) {
            case "Non-alloy steel":
                rowIndex = 0;
                break;
            case "Stainless steel":
                rowIndex = 11;
                break;
            case "Malleable cast iron":
                rowIndex = 14;
                break;
            case "Grey cast iron":
                rowIndex = 15;
                break;
            case "Nodular cast iron":
                rowIndex = 19;
                break;
            case "Aluminum-wrought alloy": //Fix bug
                rowIndex = 20;
                break;
            case "Copper and Copper Alloys (Bronze / Brass)":
                rowIndex = 22;
                break;
            case "Non Metallic Materials":
                rowIndex = 30;
                break;
            case "Heat Resistant Super Alloys":
                rowIndex = 35;
                break;
            case "Titanium Alloys": //Fix bug
                rowIndex = 36;
                break;
            default:
                rowIndex = 0;
        }
    }

    function updateResults(data) {
        const sizeColumnMap = {
            "≤0.3125": "≤0.3125 (in/tooth)",
            ">0.3125": ">0.3125 (in/tooth)"
        };
        const speedColumnName = "Cutting Speed (SFM)";
        console.log(speedColumnName);
        const feedColumnName = sizeColumnMap[selectedSize];
        if (!data[rowIndex]) {
            console.error(`Row at index ${rowIndex} does not exist.`);
            return;
        }
        speedDisplay.textContent = "Speed: " + data[rowIndex][speedColumnName] + "  RPM";
        feedDisplay.textContent = "Feed: " + data[rowIndex][feedColumnName] + " IPT (Inches/Tooth)";
    }

    function parseCSV(data) {
        const rows = data.split('\n').map(row => row.split(','));
        const headers = rows[0].map(h => h.trim());
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
                    console.log("CSV loaded. Example row:", parsedData[0]);
                    console.log("Unique materials:", uniqueMaterials);
                }
            });
        });
    }
});