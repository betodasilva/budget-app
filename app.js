

// BUDGET CONTROLLER
var budgetController = (function(){


})();

// UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        //public methods
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
            
        },
        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();

// APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function() {
        // 1. get field input data
        var input = UIController.getInput();
        console.log(input);
        // 2. add item to budget controller
        // 3. add the item to the UI
        // 4. calculate the budget
        // 5. display the budget on the UI
        console.log('add item');
    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(e){
        if (e.keyCode === 13 || e.which === 13) {
            ctrlAddItem();
        }
    });

    


})(budgetController, UIController);