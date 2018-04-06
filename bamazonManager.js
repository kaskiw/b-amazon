var mysql = require('mysql')
var inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bamazon_schema'
});

// Manager functions choices
inquirer.prompt([
    {
        name: "choice",
        type: "list",
        choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product"],
        message: "What would you like to look up today Manager?"
    }
]).then(function (answer) {
    if (answer.choice === "View Products") {
        console.log("View Products")
        viewProducts();
    } else if (answer.choice === "View Low Inventory") {
        console.log("View Low Inventory")
        lowInventory();
    } else if (answer.choice === "Add to Inventory") {
        console.log("Add to Inventory")
        addInventory();

    } else if (answer.choice === "Add New Product") {
        console.log("Add New Product")
        addProduct();
    }
});

// Add a function to view the current inventory
function viewProducts() {
    connection.connect();
    connection.query("SELECT * FROM products", function (err, rows, fields) {
        if (err) throw err;
        console.log(rows)
    });
    connection.end();
};

// Add function to view low Inventory
function lowInventory() {
    connection.connect();
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, rows, fields) {
        if (err) throw err;
        console.log("Here are your products")
    });
    connection.end();

}

// Add a function that will allow inventory updates
function addInventory() {
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "What item number do you want to change the inventory for?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "What is the new number of items?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(function (answer) {
        for (var i = 0; i < 2; i++) {
            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: answer.stock_quantity
                },
                {
                    item_id: answer.item_id
                }
            ]);
        };
        connection.end();
    });
};

// Add a function that allows a manger to add an entirely new product
function addProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product you want to add?"
        },
        {
            name: "department_name",
            type: "input",
            message: "What department does it belong in?"
        },
        {
            name: "price",
            type: "input",
            message: "How much is it?"
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "What is the initial stock quantity?"
        }
    ]).then(function (answer) {
        connection.query("INSERT products SET ?", [
            {
                product_name: answer.product_name,
                department_name: answer.department_name,
                price: answer.price,
                stock_quantity: answer.stock_quantity
            }
        ]);
        connection.end();

    });
};