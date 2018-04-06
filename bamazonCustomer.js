var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bamazon_schema'
});

//Uses the connection variable above to connect to the mysql database. 
connection.connect();

//Starts a query on the bamazon databse. 
connection.query('SELECT * from PRODUCTS', function (err, res) {
    //For loop that goes through the res and logs out the name, id and price of each item. 
    for (var i = 0; i < res.length; i++) {
        console.log("Name: " + res[i].product_name + ", ID: " + res[i].item_id + "Price: $" + res[i].price + "stock_quantity: " +res[i].stock_quantity);
    };

    //Inquirer stuff based on the IDs provided by the foor loop above. 
    var questions = [{
            type: "input",
            name: "whatBuy",
            message: "What would you like to buy? (Please use ID Number)"
        },
        {
            type: "input",
            name: "howMuch",
            message: "How many would you like to buy?"
        }
    ];

    inquirer.prompt(questions).then(function (answers) {
        connection.query('SELECT * from PRODUCTS where item_id =' + answers.whatBuy, function (err, resp) {
            if (resp[0].stock_quantity >= answers.howMuch) {
                var remainQuant = resp[0].stock_quantity - answers.howMuch;
                var totalCost = resp[0].price * answers.howMuch;
                var department = resp[0].department_name;

                connection.query("update products set stock_quantity =" + remainQuant + " where item_id =" + answers.whatBuy + ";", function (err, resp) {
                    if (!err) {
                        console.log("Update successful. Total cost is : $" + totalCost);

                        connection.query("select * from products where department_name ='" + department + "';", function (err, resp) {
                            var totalSales = (resp[0].totalSales + totalCost);
                            connection.query("update products set totalSales =" + totalSales + " where department_name='" + department + "';", function (err, resp) {
                                if (!err) {
                                    console.log("Successfully updated the total sales for " + department + " at $" + totalSales);
                                } else {
                                    console.log(err);
                                }
                            })
                        })
                    } else {
                        console.log("Update unsuccessful. There was an issue with the syntax.");
                    }

                });
            } else {
                console.log("Sorry, not enough product in stock. We only have " + resp[0].stockQuantity + " available!");
            }
        })
    });
});