// Калькулятор углеродного следа
document.querySelector('.calculate-btn')?.addEventListener('click', function() {
    const transport = parseFloat(document.getElementById('transport').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const waste = parseFloat(document.getElementById('waste').value) || 0;
    const diet = document.getElementById('diet').value;
    
    // Простой расчет (примерные коэффициенты)
    let co2 = 0;
    co2 += transport * 365 * 0.2; // кг CO2 за год от транспорта
    co2 += electricity * 12 * 0.5; // кг CO2 за год от электричества
    co2 += waste * 52 * 0.3; // кг CO2 за год от отходов
    
    // Коэффициент питания
    const dietFactors = {
        'meat': 1.5,
        'mixed': 1.0,
        'vegetarian': 0.7,
        'vegan': 0.5
    };
    co2 *= dietFactors[diet];
    
    // Расчет деревьев и км
    const trees = Math.ceil(co2 / 20); // 1 дерево поглощает ~20 кг CO2 в год
    const km = Math.ceil(co2 / 0.2); // ~0.2 кг CO2 на км
    
    // Показываем результат
    document.querySelector('.result-placeholder').style.display = 'none';
    document.querySelector('.result-content').style.display = 'block';
    document.querySelector('.co2-value').textContent = Math.round(co2);
    document.querySelector('.trees-value').textContent = trees;
    document.querySelector('.km-value').textContent = km;
});

// Табы биоразнообразия
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Убираем активный класс со всех кнопок и контента
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Добавляем активный класс
        this.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Квиз (базовая логика)
let currentQuestion = 0;
let score = 0;

const questions = [
    {
        question: "Какой заповедник Беларуси является самым старым?",
        options: ["Беловежская пуща", "Березинский заповедник", "Припятский национальный парк", "Нарочанский национальный парк"],
        correct: 1
    }
];

document.querySelectorAll('.quiz-option').forEach((option, index) => {
    option.addEventListener('click', function() {
        // Простая проверка ответа
        if (index === questions[currentQuestion].correct) {
            this.classList.add('correct');
            score++;
        } else {
            this.classList.add('incorrect');
        }
        
        // Отключаем все кнопки после ответа
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
        
        // Переход к следующему вопросу через 1.5 секунды
        setTimeout(() => {
            alert('Это демо-версия квиза. В полной версии будет больше вопросов!');
        }, 1500);
    });
});

console.log('Страница "Экология" загружена');
