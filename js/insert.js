window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("entry-datetime-input").value = toLocalISOString(new Date());
    loadDropdownData();
})

function toLocalISOString(date) {
    const localDate = new Date(date - date.getTimezoneOffset() * 60000); //offset in milliseconds. Credit https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset

    // Optionally remove second/millisecond if needed
    localDate.setSeconds(null);
    localDate.setMilliseconds(null);
    return localDate.toISOString().slice(0, -1);
}

function loadDropdownData() {
    const packagingUrl = "./data/packaging-units.json";
    const categoryUrl = "./data/product-category.json";

    // Fetch both JSONs
    Promise.all([fetch(packagingUrl), fetch(categoryUrl)])
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(([packagingData, categoryData]) => {
            renderDropdown(packagingData.PackagingUnits, "packaging-unit");
            renderDropdown(categoryData.ProductCategories, "product-category");
        })
        .catch(err => console.error("Error fetching JSON files:", err));
}

// Function to render a dropdown with optgroups
    function renderDropdown(data, selectId) {
        const select = document.getElementById(selectId);
        select.innerHTML = ""; // Clear existing
        
        data.forEach(group => {
            const optgroup = document.createElement("optgroup");
            if (group.category != undefined) {
                optgroup.label = group.category;
            }
            
            group.options.forEach(option => {
                const opt = document.createElement("option");
                opt.value = option;
                opt.textContent = option;
                optgroup.appendChild(opt);
            });

            select.appendChild(optgroup);
        });

        let customInput = document.getElementById(selectId + "-custom-input");

        select.addEventListener("change", () => {
            if (select.value !== "Others") {
                customInput.className = "d-none";
                customInput.value = "";
                
            } else {
                customInput.className = "d-inline form-control mb-3";
                customInput.focus();
            }
        })
    }