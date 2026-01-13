document.getElementById('year').textContent = new Date().getFullYear();

let labels = [];

// Función para cuando el usuario elige un tamaño del menú desplegable
function updateFromPresets() {
    const preset = document.getElementById('labelSize').value;
    if (preset !== "custom") {
        const [w, h] = preset.split('x');
        document.getElementById('customWidth').value = w;
        document.getElementById('customHeight').value = h;
    }
}

function addLabels() {
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;
    const ean = document.getElementById('prodEan').value;
    
    // Obtenemos las medidas directamente de los cuadros de texto
    const width = document.getElementById('customWidth').value;
    const height = document.getElementById('customHeight').value;
    
    const qty = parseInt(document.getElementById('prodQty').value);

    if (!name || !price || !width || !height) {
        alert("Por favor, rellena Nombre, Precio y las Medidas.");
        return;
    }

    for (let i = 0; i < qty; i++) {
        labels.push({
            id: Date.now() + Math.random(),
            name,
            price,
            ean: ean.trim(),
            width: width,
            height: height
        });
    }

    renderLabels();

    // Limpiar campos básicos
    document.getElementById('prodName').value = "";
    document.getElementById('prodPrice').value = "";
    document.getElementById('prodEan').value = "";
    document.getElementById('prodQty').value = "1";
}

function removeLabel(id) {
    labels = labels.filter(l => l.id !== id);
    renderLabels();
}

function clearSheet() {
    if (confirm("¿Seguro que quieres borrar todas las etiquetas de la hoja?")) {
        labels = [];
        renderLabels();
    }
}

function renderLabels() {
    const container = document.getElementById('printArea');
    container.innerHTML = "";

    labels.forEach(item => {
        const hasEan = item.ean !== "";
        
        const labelDiv = document.createElement('div');
        labelDiv.className = `label-item ${hasEan ? '' : 'no-ean'}`;
        
        // Aplicamos la medida personalizada que guardamos
        labelDiv.style.width = item.width + "mm";
        labelDiv.style.height = item.height + "mm";
        labelDiv.onclick = () => removeLabel(item.id);

        labelDiv.innerHTML = `
            <div class="label-header">
                <img src="alisan.jpg" class="label-logo" onerror="this.style.display='none'">
                <p class="label-price">${parseFloat(item.price).toFixed(2)}€</p>
            </div>
            <div class="label-name">${item.name}</div>
            ${hasEan ? `<div class="barcode-container"><svg id="ean-${Math.floor(item.id * 1000)}"></svg></div>` : ''}
        `;

        container.appendChild(labelDiv);

        if (hasEan) {
            try {
                JsBarcode(`#ean-${Math.floor(item.id * 1000)}`, item.ean, {
                    format: "EAN13",
                    width: 1.2,
                    height: 35,
                    displayValue: true,
                    fontSize: 12,
                    margin: 0
                });
            } catch (e) {
                console.error("Código EAN no válido");
            }
        }
    });
}