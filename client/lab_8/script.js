/* eslint-disable max-len */

/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/*
  ## Utility Functions
    Under this comment place any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str
  })
}
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}
function cutRestaurantList(list) {
  console.log("fired cut list")
  const range = [...Array(15).keys()];
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length -1);
    return list[index]
  })
}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const filterButton = document.querySelector('#filter');
  const loadDataButton = document.querySelector('#data_load');
  const generateListButton = document.querySelector('#generate');
  const textfield = document.querySelector('#resto')

  const loadAnimation = document.querySelector('#data_load_animation')
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");
 
  let storedlist = [];
  let currentList = [];

  loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
    console.log('Loading data'); // this is substituting for a "breakpoint"
    loadAnimation.style.display = "inline-block"
      
   
      
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    storedlist = await results.json();
    if (storedlist.length > 0) {
      generateListButton.classList.remove("hidden");
  }
    loadAnimation.style.display = "none";
    console.table(storedlist); 
  });

  filterButton.addEventListener('click', (event) => {
    console.log('clicked FilterButton');

    const formData = new FormData(mainForm); 
    const formProps = Object.fromEntries(formData);

    console.log(formProps);
    const newList = filterList(currentList, formProps.resto);
    injectHTML(newList)
    console.log(newList);
  })

  generateListButton.addEventListener("click", (event) => {
      console.log('generate new list');
      currentList = cutRestaurantList(storedlist);
      console.log(currentList);
      injectHTML(currentList);
  })

  textfield.addEventListener('input', (event) => {
      console.log('input', event.target.value);
      const newList = filterList(currentList, event.target.value);
      console.log(newList);
      injectHTML(newList);
  })
}

/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
