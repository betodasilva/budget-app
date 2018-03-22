

// BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.totals[type] = sum;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function() {
            // calculate total income and expenses;
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget: income - expenses;
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(( data.totals.exp / data.totals.inc ) * 100);
            } else {
                data.percentage = -1;
            }
            
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };

    

})();

// UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        expensesContainer: '.expenses__list',
        incomesContainer: '.income__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
    };

    return {
        //public methods
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
            
        },

        addListItem: function(obj, type){
            var html, newHTML, element;
            // create html string
            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = document.querySelector(DOMstrings.incomesContainer);
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                element = document.querySelector(DOMstrings.expensesContainer);
            }
            
            // replace the placeholder text with real data
            newHTML = html.replace("%id%", obj.id);
            newHTML = newHTML.replace("%description%", obj.description);
            newHTML = newHTML.replace("%value%", obj.value);

            // insert the html into the DOM

            element.insertAdjacentHTML('beforeend', newHTML);
        },

        clearFields: function(){
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(ele, index, arr){
                ele.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            

            if(obj.percentage > 0 ) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();

// APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            } 
        });
    };

    var updateBudget = function(){
        // 1. calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        var budget = budgetCtrl.getBudget();
        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;
        // 1. get field input data
        input = UIController.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. add item to budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);
            // 3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            // 4. clear fields
            UICtrl.clearFields();
            // 5. Calculate and update budget
            updateBudget();
        }
        
        
    };

    return {
        init: function(){
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
            console.log('app initialized');
        }
    };

    

    


})(budgetController, UIController);

controller.init();