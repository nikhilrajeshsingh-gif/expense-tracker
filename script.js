// LOGIN CHECK
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


/* =========================
   ADD / UPDATE TRANSACTION
========================= */

function addTransaction(event) {

    if (event) {
        event.preventDefault();
    }

    let type =
        document.getElementById("type").value;

    let amount =
        Number(
            document.getElementById("amount").value
        );

    let category =
        document.getElementById("category").value;

    let note =
        document.getElementById("note").value.trim();


    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }


    if (!category) {
        alert("Please select a category.");
        return;
    }


    /* EDIT MODE */

    let editingId =
        localStorage.getItem("editingTransactionId");


    if (editingId) {

        let transaction =
            transactions.find(function(item) {

                return item.id === Number(editingId);

            });


        if (transaction) {

            transaction.type = type;

            transaction.amount = amount;

            transaction.category = category;

            transaction.note =
                note || category;


            saveData();


            localStorage.removeItem(
                "editingTransactionId"
            );


            clearTransactionForm();

            updateDashboard();


            alert(
                "Transaction updated successfully!"
            );


            return;
        }
    }


    /* NEW TRANSACTION */

    let transaction = {

        id: Date.now(),

        type: type,

        amount: amount,

        category: category,

        note: note || category,

        date: new Date().toISOString()

    };


    transactions.push(transaction);

    saveData();

    updateDashboard();

    clearTransactionForm();


    alert(
        "Transaction saved successfully!"
    );
}


/* =========================
   CLEAR FORM
========================= */

function clearTransactionForm() {

    let form =
        document.getElementById(
            "transactionForm"
        );


    if (form) {
        form.reset();
    }


    document.getElementById(
        "type"
    ).value = "income";


    localStorage.removeItem(
        "editingTransactionId"
    );


    let saveButton =
        document.querySelector(
            ".save-transaction-btn"
        );


    if (saveButton) {

        saveButton.innerText =
            "Save Transaction";

    }
}


/* =========================
   QUICK ACTIONS
========================= */

function selectIncome() {

    document.getElementById(
        "type"
    ).value = "income";


    document.getElementById(
        "amount"
    ).focus();
}


function selectExpense() {

    document.getElementById(
        "type"
    ).value = "expense";


    document.getElementById(
        "amount"
    ).focus();
}


/* =========================
   SAVE DATA
========================= */

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


/* =========================
   UPDATE DASHBOARD
========================= */

function updateDashboard() {

    let income = 0;

    let expense = 0;


    transactions.forEach(function(item) {

        if (item.type === "income") {

            income += item.amount;

        } else {

            expense += item.amount;

        }

    });


    let balance =
        income - expense;


    document.getElementById(
        "income"
    ).innerText =
        "₹" +
        income.toLocaleString("en-IN");


    document.getElementById(
        "expense"
    ).innerText =
        "₹" +
        expense.toLocaleString("en-IN");


    document.getElementById(
        "balance"
    ).innerText =
        "₹" +
        balance.toLocaleString("en-IN");


    displayTransactions();

    updateChart();

    updateBudget();
}


/* =========================
   FORMAT DATE
========================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Date not available";
    }


    let date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return "Date not available";
    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =========================
   DISPLAY TRANSACTIONS
========================= */

function displayTransactions(
    list = transactions
) {

    let container =
        document.getElementById(
            "transactionList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (list.length === 0) {

        container.innerHTML =
            '<p class="empty">No transactions found</p>';

        return;
    }


    let recent =
        list.slice(-5).reverse();


    recent.forEach(function(item) {

        let icon = "💸";


        if (item.type === "income") {

            icon = "💰";

        }
        else if (item.category === "Food") {

            icon = "🍔";

        }
        else if (item.category === "Travel") {

            icon = "🚌";

        }
        else if (item.category === "Shopping") {

            icon = "🛍️";

        }
        else if (item.category === "Education") {

            icon = "📚";

        }
        else if (item.category === "Health") {

            icon = "💊";

        }
        else if (item.category === "Bills") {

            icon = "💡";

        }
        else if (item.category === "Salary") {

            icon = "💰";

        }
        else if (item.category === "Other") {

            icon = "📌";

        }


        let sign =
            item.type === "income"
                ? "+"
                : "-";


        let colorClass =
            item.type === "income"
                ? "income-text"
                : "expense-text";


        let div =
            document.createElement("div");


        div.className =
            "transaction-item";


        div.innerHTML = `

            <div class="transaction-info">

                <div class="transaction-icon">
                    ${icon}
                </div>

                <div>

                    <h4>
                        ${item.category}
                    </h4>

                    <p>
                        ${item.note}
                    </p>

                    <p>
                        📅 ${formatDate(item.date)}
                    </p>

                </div>

            </div>


            <div>

                <span class="${colorClass}">
                    ${sign}
                    ₹${item.amount.toLocaleString("en-IN")}
                </span>


                <button
                    class="edit-btn"
                    onclick="editTransaction(${item.id})"
                    title="Edit Transaction"
                >
                    ✏️
                </button>


                <button
                    onclick="deleteTransaction(${item.id})"
                    style="
                        border:none;
                        background:none;
                        cursor:pointer;
                        margin-left:6px;
                        font-size:16px;
                    "
                    title="Delete Transaction"
                >
                    🗑️
                </button>

            </div>

        `;


        container.appendChild(div);

    });
}


/* =========================
   EDIT TRANSACTION
========================= */

function editTransaction(id) {

    let transaction =
        transactions.find(function(item) {

            return item.id === id;

        });


    if (!transaction) {

        alert(
            "Transaction not found."
        );

        return;
    }


    document.getElementById(
        "type"
    ).value =
        transaction.type;


    document.getElementById(
        "amount"
    ).value =
        transaction.amount;


    document.getElementById(
        "category"
    ).value =
        transaction.category;


    document.getElementById(
        "note"
    ).value =
        transaction.note;


    localStorage.setItem(
        "editingTransactionId",
        id
    );


    let saveButton =
        document.querySelector(
            ".save-transaction-btn"
        );


    if (saveButton) {

        saveButton.innerText =
            "Update Transaction";

    }


    document.querySelector(
        ".add-transaction"
    ).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    setTimeout(function() {

        document.getElementById(
            "amount"
        ).focus();

    }, 500);
}


/* =========================
   SEARCH + FILTER
========================= */

function filterTransactions() {

    let searchInput =
        document.getElementById(
            "searchTransaction"
        );


    let filterSelect =
        document.getElementById(
            "filterType"
        );


    if (!searchInput || !filterSelect) {
        return;
    }


    let search =
        searchInput.value
            .toLowerCase()
            .trim();


    let filter =
        filterSelect.value;


    let filtered =
        transactions.filter(function(item) {

            let category =
                String(
                    item.category || ""
                ).toLowerCase();


            let note =
                String(
                    item.note || ""
                ).toLowerCase();


            let matchesSearch =
                category.includes(search) ||
                note.includes(search);


            let matchesType =
                filter === "all" ||
                item.type === filter;


            return (
                matchesSearch &&
                matchesType
            );

        });


    displayTransactions(filtered);
}


/* =========================
   CUSTOM DELETE MODAL
========================= */

function deleteTransaction(id) {

    localStorage.setItem(
        "deleteTransactionId",
        id
    );


    let modal =
        document.getElementById(
            "deleteModal"
        );


    if (modal) {

        modal.style.display = "flex";

    }
}


/* =========================
   CLOSE DELETE MODAL
========================= */

function closeDeleteModal() {

    let modal =
        document.getElementById(
            "deleteModal"
        );


    if (modal) {

        modal.style.display = "none";

    }


    localStorage.removeItem(
        "deleteTransactionId"
    );
}


/* =========================
   CONFIRM DELETE
========================= */

function confirmDelete() {

    let id =
        Number(
            localStorage.getItem(
                "deleteTransactionId"
            )
        );


    if (!id) {

        closeDeleteModal();

        return;
    }


    transactions =
        transactions.filter(
            function(item) {

                return item.id !== id;

            }
        );


    saveData();


    localStorage.removeItem(
        "deleteTransactionId"
    );


    closeDeleteModal();


    updateDashboard();


    filterTransactions();
}


/* =========================
   SHOW ALL TRANSACTIONS
========================= */

function showAll() {

    if (transactions.length === 0) {

        alert(
            "No transactions available."
        );

        return;
    }


    let message =
        "ALL TRANSACTIONS\n\n";


    transactions
        .slice()
        .reverse()
        .forEach(function(item, index) {

            let sign =
                item.type === "income"
                    ? "+"
                    : "-";


            message +=
                (index + 1) +
                ". " +
                item.category +
                " " +
                sign +
                " ₹" +
                item.amount.toLocaleString(
                    "en-IN"
                ) +
                "\n";


            message +=
                "Note: " +
                item.note +
                "\n";


            message +=
                "Date: " +
                formatDate(item.date) +
                "\n\n";

        });


    alert(message);
}


/* =========================
   BUDGET
========================= */

function showBudget() {

    let budget =
        prompt(
            "Enter your monthly budget:"
        );


    if (
        budget &&
        Number(budget) > 0
    ) {

        localStorage.setItem(
            "budget",
            budget
        );


        updateBudget();


        alert(
            "Budget set to ₹" +
            Number(budget)
                .toLocaleString("en-IN")
        );

    } else {

        alert(
            "Please enter a valid budget."
        );

    }
}


/* =========================
   UPDATE BUDGET
========================= */

function updateBudget() {

    let budget =
        Number(
            localStorage.getItem(
                "budget"
            )
        ) || 0;


    let spent = 0;


    transactions.forEach(function(item) {

        if (item.type === "expense") {

            spent += item.amount;

        }

    });


    let remaining =
        budget - spent;


    document.getElementById(
        "budgetAmount"
    ).innerText =
        "₹" +
        budget.toLocaleString("en-IN");


    document.getElementById(
        "spentAmount"
    ).innerText =
        "₹" +
        spent.toLocaleString("en-IN");


    document.getElementById(
        "remainingAmount"
    ).innerText =
        "₹" +
        remaining.toLocaleString("en-IN");


    let percentage = 0;


    if (budget > 0) {

        percentage =
            (spent / budget) * 100;

    }


    if (percentage > 100) {

        percentage = 100;

    }


    document.getElementById(
        "budgetProgress"
    ).style.width =
        percentage + "%";
}


/* =========================
   EXPENSE CHART
========================= */

function updateChart() {

    let canvas =
        document.getElementById(
            "expenseChart"
        );


    if (!canvas) {
        return;
    }


    canvas.width = 400;

    canvas.height = 320;


    let ctx =
        canvas.getContext("2d");


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    let categories = {};


    transactions.forEach(function(item) {

        if (item.type === "expense") {

            if (
                !categories[item.category]
            ) {

                categories[item.category] = 0;

            }


            categories[item.category] +=
                item.amount;

        }

    });


    let labels =
        Object.keys(categories);


    let values =
        Object.values(categories);


    if (values.length === 0) {

        ctx.font =
            "16px Arial";

        ctx.fillStyle =
            "#888";

        ctx.textAlign =
            "center";


        ctx.fillText(
            "No expense data yet",
            200,
            160
        );


        ctx.textAlign =
            "left";


        return;
    }


    let total =
        values.reduce(
            function(sum, value) {

                return sum + value;

            },
            0
        );


    let centerX = 200;

    let centerY = 135;

    let radius = 85;

    let startAngle = 0;


    let chartColors = [
        "#5B5CE2",
        "#20A464",
        "#E04B4B",
        "#F5A623",
        "#8E44AD",
        "#3498DB"
    ];


    values.forEach(
        function(value, index) {

            let sliceAngle =
                (value / total) *
                2 *
                Math.PI;


            ctx.beginPath();


            ctx.moveTo(
                centerX,
                centerY
            );


            ctx.arc(
                centerX,
                centerY,
                radius,
                startAngle,
                startAngle +
                sliceAngle
            );


            ctx.closePath();


            ctx.fillStyle =
                chartColors[
                    index %
                    chartColors.length
                ];


            ctx.fill();


            ctx.strokeStyle =
                "#ffffff";


            ctx.lineWidth = 2;


            ctx.stroke();


            startAngle +=
                sliceAngle;

        }
    );


    ctx.fillStyle =
        "#252B48";


    ctx.font =
        "bold 17px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "Expense Distribution",
        centerX,
        25
    );


    ctx.textAlign =
        "left";


    let y = 255;


    labels.forEach(
        function(label, index) {

            ctx.fillStyle =
                chartColors[
                    index %
                    chartColors.length
                ];


            ctx.fillRect(
                30,
                y - 12,
                12,
                12
            );


            ctx.fillStyle =
                "#555";


            ctx.font =
                "14px Arial";


            ctx.fillText(
                label +
                " : ₹" +
                values[index]
                    .toLocaleString(
                        "en-IN"
                    ),
                50,
                y
            );


            y += 22;

        }
    );
}


/* =========================
   LOGOUT
========================= */

function logoutUser() {

    localStorage.removeItem(
        "loggedIn"
    );


    window.location.href =
        "login.html";
}


/* =========================
   START APP
========================= */

updateDashboard();
