
// Hasn't been tailored yet

//Required Info:
// - material, tool diameter

document.addEventListener("DOMContentLoaded", function() {
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    const speedDisplay = document.getElementById("speed");
    const feedDisplay = document.getElementById("feed");

    let selectedMaterial = "Low-Carbon Steels, Long Chipping";
    let selectedSize = "0.473-0.531";
    let rowIndex = 10; // Default index for Aluminum size 1
    let parsedData = null;

    // Load CSV data
    fetch('data/drill_speeds_and_feeds_full.csv')
        .then(response => response.text())
        .then(data => {
            parsedData = parseCSV(data);
            populateMaterialButtons(parsedData); // adds dynamic buttons
            setMaterialRow();
            console.log(parsedData);
            updateResults(parsedData);
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
        const materialToRowIndex = {};

        // Build the lookup dynamically from parsedData
        if (parsedData) {
            parsedData.forEach((row, index) => {
                const materialName = row["Material"]?.trim();
                if (materialName && !(materialName in materialToRowIndex)) {
                    materialToRowIndex[materialName] = index;
                }
            });

            rowIndex = materialToRowIndex[selectedMaterial] ?? -1;
        } else {
            rowIndex = -1;
        }
    }

    function updateResults(data) {
        const speedColumnName = "Cutting Speed - Starting";
        const feedColumnName = "FPR " + selectedSize;
        if (!data[rowIndex]) {
            speedDisplay.textContent = "Speed: N/A";
            feedDisplay.textContent = "Feed: N/A";
            console.error(`Row at index ${rowIndex} does not exist.`);
            return;
        }
        speedDisplay.textContent = "Speed: "+ data[rowIndex][speedColumnName]  + "  RPM";
        feedDisplay.textContent = "Feed: "+ data[rowIndex][feedColumnName] + "  IPT (Inches/Tooth)";
    }

    function parseCSV(data) {
        return Papa.parse(data, {
            header: true,
            skipEmptyLines: true
        }).data;
        // const rows = data.split('\n').map(row => row.split(','));
        // const headers = rows[0];
        // const result = rows.slice(1).map(row => {
        //     return row.reduce((acc, value, index) => {
        //         acc[headers[index]] = value;
        //         return acc;
        //     }, {});
        // });
        // return result;
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

    // function generateSwitchFromCSV(csvData, columnName) {
    //     const uniqueValues = [...new Set(parsedData.map(row => row[columnName]))];

    //     let switchCode = `function set${columnName.replace(/\s/g, '')}Row(selectedValue) {\n`;
    //     switchCode += "    switch (selectedValue) {\n";

    //     uniqueValues.farEach((value, index) => {
    //         switchCode += `        case "${value}":\n`;
    //         switchCode += `            rowIndex = ${index};\n`;
    //         switchCode += `            break;\n`;
    //     });
    //     switchCode += "        default:\n";
    //     switchCode += "            rowIndex = -1;\n";
    //     switchCode += "    }\n";
    //     switchCode += "}\n";

    //     return switchCode;
    // }
});