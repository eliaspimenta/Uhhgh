// Elementos da interface
const cameraBtn = document.getElementById('cameraBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const cameraContainer = document.getElementById('cameraContainer');
const camera = document.getElementById('camera');
const closeCamera = document.getElementById('closeCamera');
const captureBtn = document.getElementById('captureBtn');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const resultContainer = document.getElementById('resultContainer');
const analysisResult = document.getElementById('analysisResult');
const priceChartCtx = document.getElementById('priceChart').getContext('2d');

// Variáveis de estado
let currentStream = null;
let priceChart = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    setupEventListeners();
});

function setupEventListeners() {
    cameraBtn.addEventListener('click', startCamera);
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleImageUpload);
    closeCamera.addEventListener('click', stopCamera);
    captureBtn.addEventListener('click', captureImage);
}

async function startCamera() {
    try {
        cameraContainer.style.display = 'flex';
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });
        camera.srcObject = stream;
        currentStream = stream;
    } catch (err) {
        alert('Não foi possível acessar a câmera: ' + err.message);
    }
}

function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    cameraContainer.style.display = 'none';
}

function captureImage() {
    const canvas = document.createElement('canvas');
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
    
    previewImage.src = canvas.toDataURL('image/jpeg');
    previewContainer.style.display = 'block';
    
    stopCamera();
    analyzeImage(previewImage.src);
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        previewImage.src = event.target.result;
        previewContainer.style.display = 'block';
        analyzeImage(event.target.result);
    };
    reader.readAsDataURL(file);
}

function initializeChart() {
    priceChart = new Chart(priceChartCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => `Dia ${i+1}`),
            datasets: [{
                label: 'Preço',
                data: Array.from({length: 30}, () => 100 + Math.random() * 50),
                borderColor: '#00e676',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

async function analyzeImage(imageData) {
    showLoading();
    
    // Simular processamento (1-2 segundos)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Verificar se a imagem contém um gráfico
    const isChart = await detectChart(imageData);
    
    if (!isChart) {
        showRejection();
        return;
    }
    
    // Se for um gráfico, mostrar análise
    showAnalysis();
    updateChart();
}

async function detectChart(imageData) {
    // Em produção, substituir por chamada a um modelo de IA
    // Aqui simulamos com algumas verificações básicas
    
    const img = new Image();
    img.src = imageData;
    
    await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
    });
    
    // Fatores que aumentam a probabilidade de ser um gráfico:
    // 1. Proporção da imagem (gráficos são geralmente largos)
    const isWide = img.width > img.height * 1.5;
    
    // 2. Presença de elementos gráficos (simulado)
    const hasGraphElements = Math.random() > 0.3;
    
    // 3. Cores típicas de gráficos (simulado)
    const hasChartColors = Math.random() > 0.4;
    
    return isWide && (hasGraphElements || hasChartColors);
}

function showLoading() {
    resultContainer.style.display = 'block';
    analysisResult.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span class="loading"></span>
            <span>Analisando imagem...</span>
        </div>
    `;
}

function showRejection() {
    analysisResult.innerHTML = `
        <div class="rejection" style="padding: 15px; border-radius: 8px;">
            <h3 style="color: #ff4b4b; margin-bottom: 10px;">❌ Gráfico não identificado</h3>
            <p style="margin-bottom: 8px;">Não foi possível identificar um gráfico financeiro na imagem.</p>
            <p>Por favor, envie uma imagem contendo:</p>
            <ul style="margin-top: 8px; padding-left: 20px;">
                <li>Gráfico de candles, barras ou linhas</li>
                <li>Eixos com valores financeiros</li>
                <li>Área principal do gráfico visível</li>
            </ul>
        </div>
    `;
}

function showAnalysis() {
    const isUp = Math.random() > 0.5;
    const confidence = Math.floor(70 + Math.random() * 30);
    
    analysisResult.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: ${isUp ? '#00e676' : '#ff4b4b'}; margin-bottom: 10px;">
                ${isUp ? '📈 Tendência de Alta' : '📉 Tendência de Baixa'}
            </h3>
            <div style="background: #333; height: 6px; border-radius: 3px; margin: 10px 0;">
                <div style="background: ${isUp ? '#00e676' : '#ff4b4b'}; height: 100%; width: ${confidence}%; border-radius: 3px;"></div>
            </div>
            <p>Confiança: ${confidence}%</p>
        </div>
        <div style="margin-bottom: 15px;">
            <h4 style="margin-bottom: 5px;">📊 Padrões Identificados:</h4>
            <p>${getRandomPatterns(isUp)}</p>
        </div>
        <div style="margin-bottom: 15px;">
            <h4 style="margin-bottom: 5px;">📈 Indicadores Técnicos:</h4>
            <p>${getRandomIndicators(isUp)}</p>
        </div>
        <div>
            <h4 style="margin-bottom: 5px;">💡 Recomendação:</h4>
            <p style="color: ${isUp ? '#00e676' : '#ff4b4b'}; font-weight: 500;">
                ${getRecommendation(isUp, confidence)}
            </p>
        </div>
    `;
}

function updateChart() {
    const isUp = Math.random() > 0.5;
    const currentData = priceChart.data.datasets[0].data;
    const lastValue = currentData[currentData.length - 1];
    
    // Adicionar previsão
    priceChart.data.labels = [...priceChart.data.labels, 'D+1', 'D+2', 'D+3'];
    priceChart.data.datasets[0].data = [
        ...currentData,
        lastValue * (isUp ? 1.02 : 0.98),
        lastValue * (isUp ? 1.04 : 0.96),
        lastValue * (isUp ? 1.06 : 0.94)
    ];
    
    priceChart.update();
}

function getRandomPatterns(isUp) {
    const upPatterns = [
        "Fundos ascendentes",
        "Rompeu resistência",
        "Média móvel de 50 > 200",
        "Padrão de triângulo ascendente"
    ];
    
    const downPatterns = [
        "Topos descendentes",
        "Rompeu suporte",
        "Média móvel de 50 < 200",
        "Padrão de triângulo descendente"
    ];
    
    const patterns = isUp ? upPatterns : downPatterns;
    return patterns.slice(0, 2).join(", ") + ", " + patterns[Math.floor(Math.random() * patterns.length)];
}

function getRandomIndicators(isUp) {
    return `RSI: ${isUp ? (50 + Math.floor(Math.random() * 20)) : (30 + Math.floor(Math.random() * 20))} | ` +
           `MACD: ${isUp ? 'Positivo' : 'Negativo'} | ` +
           `Volume: ${isUp ? 'Acima da média' : 'Abaixo da média'}`;
}

function getRecommendation(isUp, confidence) {
    if (confidence > 80) {
        return isUp 
            ? "FORTE SINAL DE COMPRA (Alocação 70-80%)" 
            : "FORTE SINAL DE VENDA (Reduza posição)";
    } else if (confidence > 60) {
        return isUp
            ? "Sinal de compra moderado (Alocação 40-50%)"
            ? "Sinal de venda moderado (Proteja ganhos)";
    } else {
        return isUp
            ? "Leve tendência de alta (Aguardar confirmação)"
            : "Leve tendência de baixa (Manter cautela)";
    }
}