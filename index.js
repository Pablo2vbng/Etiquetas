document.getElementById('year').textContent = new Date().getFullYear();

let labelsData = [];

function updateInputs() {
    const preset = document.getElementById('labelPreset').value;
    if (preset !== "custom") {
        const [w, h] = preset.split('x');
        document.getElementById('customWidth').value = w;
        document.getElementById('customHeight').value = h;
    }
}

function addLabels() {
    const name = document.getElementById('prodName').value;
    const priceInput = document.getElementById('prodPrice').value;
    const ean = document.getElementById('prodEan').value.trim();
    const qty = parseInt(document.getElementById('prodQty').value);
    const w = document.getElementById('customWidth').value;
    const h = document.getElementById('customHeight').value;

    if (!name || !priceInput) {
        alert("Introduce Nombre y Precio.");
        return;
    }

    const priceFormatted = parseFloat(priceInput).toFixed(2);

    for (let i = 0; i < qty; i++) {
        labelsData.push({
            id: Date.now() + Math.random(),
            name: name,
            price: priceFormatted,
            ean: ean,
            width: w,
            height: h
        });
    }

    renderSheet();
    
    // Resetear
    document.getElementById('prodName').value = "";
    document.getElementById('prodPrice').value = "";
    document.getElementById('prodEan').value = "";
    document.getElementById('prodQty').value = "1";
    document.getElementById('prodName').focus();
}

function removeLabel(id) {
    labelsData = labelsData.filter(item => item.id !== id);
    renderSheet();
}

function clearSheet() {
    if (confirm("¿Vaciar toda la hoja?")) {
        labelsData = [];
        renderSheet();
    }
}

function renderSheet() {
    const container = document.getElementById('printArea');
    container.innerHTML = "";

    labelsData.forEach(item => {
        const hasEan = item.ean !== "";
        const labelDiv = document.createElement('div');
        labelDiv.className = `label-item`;
        
        // Aplicamos las medidas exactas
        labelDiv.style.width = item.width + "mm";
        labelDiv.style.height = item.height + "mm";
        labelDiv.onclick = () => removeLabel(item.id);

        const [entero, decimal] = item.price.split('.');

        labelDiv.innerHTML = `
            <div class="section-name">
                <img src="alisan.jpeg" class="logo-label" onerror="this.style.display='none'">
                <div class="name-label">${item.name}</div>
            </div>
            <div class="section-price">
                <div class="price-text">${entero},${decimal}<span>€</span></div>
                ${hasEan ? `<div class="ean-label"><svg id="barcode-${Math.floor(item.id * 1000)}"></svg></div>` : ''}
            </div>
        `;

        container.appendChild(labelDiv);

        if (hasEan) {
            try {
                JsBarcode(`#barcode-${Math.floor(item.id * 1000)}`, item.ean, {
                    format: "EAN13",
                    width: 1.2,
                    height: 20,
                    fontSize: 10,
                    margin: 0,
                    displayValue: true
                });
            } catch (e) {
                console.log("EAN inválido");
            }
        }
    });
}