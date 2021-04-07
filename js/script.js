"use strict";
// Selectors
const form = document.querySelector("form");

const inputPizzaName = document.getElementById("pizza-name");
const errorPizzaName = document.getElementById("error-name");

const inputPizzaPrice = document.getElementById("pizza-price");
const errorPizzaPrice = document.getElementById("error-price");

const inputPizzaHeat = document.getElementById("pizza-heat");
const errorPizzaHeat = document.getElementById("error-heat");

const inputPizzaTopping = document.getElementById("pizza-topping");
const errorPizzaTopping = document.getElementById("error-topping");

const addPizzaTopping = document.getElementById("add-topping");
const toppingsContainer = document.querySelector(".toppings-container");

const selectPizzaImage = document.getElementById("pizza-images");
//
const pizzaListContainer = document.getElementById("pizza-list");

const sortPizza = document.getElementById("sort-pizza");

let toppingList = [];
let pizzaList = [];
let sortedPizzaLIst = [];

// generate pizza list
const generatePizzaList = () => {
  if (sessionStorage.getItem("pizza-list")) {
    pizzaListContainer.innerHTML = "";
    const data = JSON.parse(sessionStorage.getItem("pizza-list"));
    pizzaList = data;

    if (sortedPizzaLIst.length === 0) {
      sortedPizzaLIst = data;
      sortedPizzaLIst.sort((a, b) =>
        a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
      );
    }

    sortedPizzaLIst.map((pizza) => {
      console.log(pizza);
      // create pizza card div
      const pizzaCard = document.createElement("div");
      pizzaCard.classList.add("pizza-card");
      // create pizza name header
      const h3 = document.createElement("h3");
      h3.classList.add("pizza-name");
      h3.innerText = pizza.name;
      // create pizza price span
      const priceSpan = document.createElement("span");
      priceSpan.classList.add("pizza-price");
      priceSpan.innerText = "€ " + pizza.price;
      // create pizza toppings span
      const toppingSpan = document.createElement("span");
      toppingSpan.classList.add("pizza-toppings");
      toppingSpan.innerText = pizza.toppings.join(", ");
      // create pizza image
      const pizzaImage = document.createElement("img");
      pizzaImage.src = "assets/img/" + pizza.photo + ".jpg";
      pizzaImage.alt = pizza.name;
      // create pizza delete button
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete pizza";
      // delete button event listener
      deleteButton.addEventListener("click", () => {
        pizzaList = pizzaList.filter((item) => item.name !== pizza.name);
        sortedPizzaLIst = [];
        sessionStorage.setItem("pizza-list", JSON.stringify(pizzaList));
        generatePizzaList();
      });
      // create heat icons
      const pizzaHeatBlock = document.createElement("div");
      pizzaHeatBlock.classList.add("heat-block");
      for (let i = 0; i < pizza.heat; i++) {
        const chiliIcon = document.createElement("img");
        chiliIcon.src = "assets/icons/chili.svg";
        chiliIcon.alt = "chili icon";
        pizzaHeatBlock.append(chiliIcon);
      }
      pizzaCard.append(
        h3,
        pizzaImage,
        priceSpan,
        pizzaHeatBlock,
        toppingSpan,
        deleteButton
      );
      pizzaListContainer.append(pizzaCard);
    });
  }
};

// Events

// Pizza form submit event
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.submitter.value === "submit") {
    if (validatePizzaForm()) {
      const newPizza = {
        name: inputPizzaName.value,
        price: Number(inputPizzaPrice.value).toFixed(2),
        heat: Number(inputPizzaHeat.value),
        toppings: toppingList,
        photo: selectPizzaImage.value,
      };
      emptyValues();
      pizzaList.push(newPizza);
      sessionStorage.setItem("pizza-list", JSON.stringify(pizzaList));
      pizzaListContainer.innerHTML = "";
      generatePizzaList();
    }
  }
});

// Add pizza topping event
addPizzaTopping.addEventListener("click", () => {
  if (validatePizzaTopping(inputPizzaTopping.value)) {
    toppingList.push(inputPizzaTopping.value);
    createToppings(toppingList);
    inputPizzaTopping.value = "";
  }
});

// pizza sort event
sortPizza.addEventListener("change", (event) => {
  if (event.target.value === "name") {
    sortedPizzaLIst.sort((a, b) =>
      a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
    );
  }
  if (event.target.value === "price") {
    sortedPizzaLIst.sort((a, b) =>
      Number(a.price) > Number(b.price) ? 1 : -1
    );
  }
  if (event.target.value === "heat") {
    sortedPizzaLIst.sort((a, b) => (Number(a.heat) > Number(b.heat) ? 1 : -1));
  }
  generatePizzaList();
});

// form validator

/**
 *  validates pizza form
 *
 * @returns {boolean}
 */
const validatePizzaForm = () => {
  let formValidation = true;
  if (!validateName(inputPizzaName.value)) formValidation = false;
  if (!validatePrice(inputPizzaPrice.value)) formValidation = false;
  if (!validateHeat(inputPizzaHeat.value)) formValidation = false;
  if (!validatePizzaTopingList(toppingList)) formValidation = false;
  return formValidation;
};

/**
 *  empty form input values
 */
const emptyValues = () => {
  inputPizzaName.value = "";
  inputPizzaPrice.value = "";
  inputPizzaHeat.value = "";
  selectPizzaImage.value = "none";
  toppingList = [];
  toppingsContainer.innerHTML = "";
};

// input validators

/**
 * Validate Pizza name input value
 *
 * @param {String} value
 * @returns
 */
const validateName = (value) => {
  if (!inputRequired(value)) {
    errorPizzaName.innerText = "Please enter pizza name";
    return false;
  }
  if (!inputMaxLength(value, 30)) {
    errorPizzaName.innerText = "Your pizza name is too long";
    return false;
  }
  if (!validateUniqueName(value)) {
    errorPizzaName.innerText = "This pizza with this name already exist";
    return false;
  }

  errorPizzaName.innerText = "";
  return true;
};

/**
 * Validate price input value
 *
 * @param {Number} value
 * @returns
 */
const validatePrice = (value) => {
  if (!inputRequired(value)) {
    errorPizzaPrice.innerText = "Please enter pizza price";
    return false;
  }
  if (!Number(value)) {
    errorPizzaPrice.innerText = "Please enter numbers";
    return false;
  }
  if (!numberPositive(value)) {
    errorPizzaPrice.innerText = "Price must be positive";
    return false;
  }
  errorPizzaPrice.innerText = "";
  return true;
};

/**
 * validate heat input value
 *
 * @param {Number} value
 * @returns
 */
const validateHeat = (value) => {
  if (inputRequired(value)) {
    if (Number.isInteger(Number(value))) {
      if (!validateRange(Number(value), 1, 3)) {
        errorPizzaHeat.innerText = "Heat value must be 1, 2 or 3";
        return false;
      }
      errorPizzaHeat.innerText = "";
      return true;
    } else {
      errorPizzaHeat.innerText = "Heat value must be Integer";
      return false;
    }
  }
  errorPizzaHeat.innerText = "";
  return true;
};

/**
 * validate input value range
 *
 * @param {Number} value
 * @param {Number} from
 * @param {Number} to
 * @returns {boolean}
 */
const validateRange = (value, from, to) => {
  if (value >= from && value <= to) {
    return true;
  }
  return false;
};

/**
 * is at least 2 topping in array
 *
 * @param {array} value
 * @returns {boolean}
 */
const validatePizzaTopingList = (value) => {
  if (!minLength(value, 2)) {
    errorPizzaTopping.innerText = "Must be at least 2 toppings";
    return false;
  }
  errorPizzaTopping.innerText = "";
  return true;
};

/**
 * is topping name filled
 *
 * @param {string} value
 * @returns {boolean}
 */
const validatePizzaTopping = (value) => {
  if (!inputRequired(value)) {
    errorPizzaTopping.innerText = "Please enter pizza topping name";
    return false;
  }
  errorPizzaTopping.innerText = "";
  return true;
};

/**
 * is pizza name is unique
 *
 * @param {string} value
 * @returns {boolean}
 */
const validateUniqueName = (value) => {
  let validate = true;
  pizzaList.map((pizza) => {
    if (pizza.name.toUpperCase() === value.toUpperCase()) {
      validate = false;
    }
  });
  return validate;
};

/**
 *  is input filled
 *
 * @param {string, number} value
 * @returns {boolean}
 */
const inputRequired = (value) => {
  if (value.length > 0) return true;
  return false;
};

/**
 * is inputs shorter then maxLength
 *
 * @param {string} value
 * @param {number} maxLength
 * @returns {boolean}
 */
const inputMaxLength = (value, maxLength) => {
  if (value.length >= maxLength) return false;
  return true;
};

/**
 * is input or array longer then minLength
 *
 * @param {array,string} value
 * @param {number} minLength
 * @returns {boolean}
 */
const minLength = (value, minLength) => {
  if (value.length >= minLength) return true;
  return false;
};

/**
 * is number positive
 *
 * @param {number} number
 * @returns {boolean}
 */
const numberPositive = (number) => {
  if (number >= 0) return true;
  return false;
};

/**
 * Create pizza topping dom element with "click" event listener
 * for topping deletion.
 *
 * @param {array} array
 * @returns {array}
 */
const createToppings = (array) => {
  const div = document.createElement("div");
  div.classList.add("topping");
  const span = document.createElement("span");
  const img = document.createElement("img");
  img.classList.add("delete-button");
  img.src = "../assets/icons/close.svg";

  // delete button event
  img.addEventListener("click", () => {
    toppingList = toppingList.filter((item) => item !== span.innerText);
    toppingsContainer.removeChild(div);
    return toppingList;
  });

  array.map((value) => {
    span.innerText = value;
    div.append(span, img);
    toppingsContainer.append(div);
  });
};

generatePizzaList();
