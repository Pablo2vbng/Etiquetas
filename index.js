// Actualizar año copyright
document.getElementById('year').textContent = new Date().getFullYear();

let labels = [];

function addLabels() {
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;
    const ean = document.getElementById('prodEan').value;
    const size = document.getElementById('labelSize').value;
    const qty = parseInt(document.getElementById('prodQty').value);

    if (!name || !price) {
        alert("Introduce al menos el nombre y el precio.");
        return;
    }

    // Añadir tantas veces como indique la cantidad
    for (let i = 0; i < qty; i++) {
        labels.push({
            id: Date.now() + Math.random(),
            name,
            price,
            ean: ean.trim(),
            size
        });
    }

    renderLabels();

    // Limpiar formulario
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
    if (confirm("¿Seguro que quieres borrar todas las etiquetas?")) {
        labels = [];
        renderLabels();
    }
}

function renderLabels() {
    const container = document.getElementById('printArea');
    container.innerHTML = "";

    labels.forEach(item => {
        const [w, h] = item.size.split('x');
        const hasEan = item.ean !== "";
        
        const labelDiv = document.createElement('div');
        labelDiv.className = `label-item ${hasEan ? '' : 'no-ean'}`;
        labelDiv.style.width = w + "mm";
        labelDiv.style.height = h + "mm";
        labelDiv.onclick = () => removeLabel(item.id);

        labelDiv.innerHTML = `
            <div class="label-header">
                <img src="alisan.jpeg" class="label-logo" onerror="this.style.display='none'">
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