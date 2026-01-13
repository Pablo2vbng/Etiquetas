document.getElementById('year').textContent = new Date().getFullYear();

let labelsData = [];

// Actualiza los cuadros de texto cuando eliges una medida estándar
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
    const price = document.getElementById('prodPrice').value;
    const ean = document.getElementById('prodEan').value.trim();
    const qty = parseInt(document.getElementById('prodQty').value);
    const w = document.getElementById('customWidth').value;
    const h = document.getElementById('customHeight').value;

    if (!name || !price || !w || !h) {
        alert("Por favor rellena Nombre, Precio y Medidas.");
        return;
    }

    // Crear las etiquetas según la cantidad
    for (let i = 0; i < qty; i++) {
        labelsData.push({
            id: Date.now() + Math.random(),
            name: name,
            price: price,
            ean: ean,
            width: w,
            height: h
        });
    }

    renderSheet();
    
    // Limpiar campos para el siguiente producto
    document.getElementById('prodName').value = "";
    document.getElementById('prodPrice').value = "";
    document.getElementById('prodEan').value = "";
    document.getElementById('prodQty').value = "1";
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
        labelDiv.className = `label-item ${hasEan ? '' : 'no-ean'}`;
        
        // Aplicamos medidas
        labelDiv.style.width = item.width + "mm";
        labelDiv.style.height = item.height + "mm";
        labelDiv.onclick = () => removeLabel(item.id);

        labelDiv.innerHTML = `
            <div class="label-header">
                <img src="alisan.jpeg" class="label-logo-img" onerror="this.style.display='none'">
                <p class="label-price">${parseFloat(item.price).toFixed(2)}€</p>
            </div>
            <div class="label-name">${item.name}</div>
            ${hasEan ? `<div class="barcode-box"><svg id="barcode-${Math.floor(item.id * 1000)}"></svg></div>` : ''}
        `;

        container.appendChild(labelDiv);

        if (hasEan) {
            try {
                JsBarcode(`#barcode-${Math.floor(item.id * 1000)}`, item.ean, {
                    format: "EAN13",
                    width: 1.2,
                    height: 30,
                    fontSize: 12,
                    margin: 0,
                    displayValue: true
                });
            } catch (e) {
                console.log("EAN no válido");
            }
        }
    });
}