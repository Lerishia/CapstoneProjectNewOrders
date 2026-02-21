// Load orders from sessionStorage
let orders = JSON.parse(sessionStorage.getItem("orders")) || [];
let lastOrderNumber = parseInt(sessionStorage.getItem("lastOrderNumber")) || 0;

// DOM Elements
const generateBtn = document.getElementById("generateBtn");
const completeBtn = document.getElementById("completeBtn");
const clearBtn = document.getElementById("clearBtn");
const message = document.getElementById("message");

generateBtn.addEventListener("click", generateOrder);
completeBtn.addEventListener("click", markComplete);
clearBtn.addEventListener("click", clearSession);

// Format ingredient properly
function formatIngredient(input) {
    return input.toLowerCase().trim().replace(/\s+/g, "_");
}

async function generateOrder() {
    let ingredientInput = document.getElementById("ingredient").value;

    if (!ingredientInput) {
        showMessage("Please enter an ingredient.", "red");
        return;
    }

    const formattedIngredient = formatIngredient(ingredientInput);

    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${formattedIngredient}`
        );

        const data = await response.json();

        if (!data.meals) {
            showMessage("No recipes found. Try another ingredient.", "red");
            return;
        }

        const randomMeal =
            data.meals[Math.floor(Math.random() * data.meals.length)];

        lastOrderNumber++;

        const newOrder = {
            orderNumber: lastOrderNumber,
            description: randomMeal.strMeal,
            completed: false
        };

        orders.push(newOrder);

        sessionStorage.setItem("orders", JSON.stringify(orders));
        sessionStorage.setItem("lastOrderNumber", lastOrderNumber);

        showMessage(`Order #${lastOrderNumber} created successfully!`, "green");

        document.getElementById("ingredient").value = "";
        updateUI();

    } catch (error) {
        showMessage("Error fetching recipe.", "red");
    }
}

function markComplete() {
    const number = parseInt(document.getElementById("orderNumber").value);

    if (!number || number <= 0) {
        showMessage("Please enter a valid order number.", "red");
        return;
    }

    const order = orders.find(o => o.orderNumber === number);

    if (!order) {
        showMessage("Order number does not exist.", "red");
        return;
    }

    order.completed = true;

    sessionStorage.setItem("orders", JSON.stringify(orders));

    showMessage(`Order #${number} marked as complete.`, "green");

    document.getElementById("orderNumber").value = "";
    updateUI();
}

function clearSession() {
    sessionStorage.clear();
    orders = [];
    lastOrderNumber = 0;
    updateUI();
    showMessage("Session cleared.", "green");
}

function updateUI() {
    const orderList = document.getElementById("orderList");
    const orderCount = document.getElementById("orderCount");

    orderList.innerHTML = "";

    const incompleteOrders = orders.filter(order => !order.completed);

    orderCount.textContent = incompleteOrders.length;

    incompleteOrders.forEach(order => {
        const li = document.createElement("li");
        li.textContent = `Order #${order.orderNumber}: ${order.description}`;
        orderList.appendChild(li);
    });
}

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

updateUI();
