"use strict";
document.addEventListener("DOMContentLoaded", start);

function start() {
  let students = [];

  let allStudents = [];

  let currentStudents;

  let house;

  let sort;

  let expellStudent = [];

  let gryffindor;
  let hufflepuff;
  let slytherin;
  let ravenclaw;

  const Student = {
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    house: "",
    imagelink: "",
    id: ""
  };

  //Sort-by dropdown
  document.querySelectorAll("#sort-by").forEach(option => {
    option.addEventListener("change", sortBy);
  });

  //Filter-by dropdown
  document.querySelectorAll("#filter-by").forEach(option => {
    option.addEventListener("change", setFilter);
  });

  async function getJson() {
    // Fetch JSON-data
    let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/students.json");

    // Convert to JSON file
    students = await jsonData.json();

    //Show student list
    cleanArray(students);
  }
  // Call function to fetch JSON-data
  getJson();
  //Clean array - make objects and split up data to show
  function cleanArray(students) {
    students.forEach(jsonObject => {
      const student = Object.create(Student);
      jsonObject.fullname = jsonObject.fullname.trim();
      jsonObject.house = jsonObject.house.trim();
      jsonObject.fullname = jsonObject.fullname.split(" ");
      student.house = jsonObject.house.charAt(0).toUpperCase() + jsonObject.house.slice(1).toLowerCase();
      if (jsonObject.fullname.length == 3) {
        student.firstname = jsonObject.fullname[0];
        student.firstname = student.firstname.charAt(0).toUpperCase() + student.firstname.slice(1).toLowerCase();
        student.middlename = jsonObject.fullname[1];
        student.middlename = student.middlename.charAt(0).toUpperCase() + student.middlename.slice(1).toLowerCase();
        student.lastname = jsonObject.fullname[2];
        student.lastname = student.lastname.charAt(0).toUpperCase() + student.lastname.slice(1).toLowerCase();
        student.gender = jsonObject.gender.charAt(0).toUpperCase() + jsonObject.gender.slice(1).toLowerCase();
        student.imagelink = `${student.lastname.toLowerCase()}_${student.firstname.substring(0, 1).toLowerCase()}.png`;
        student.id = create_UUID();
      } else if (jsonObject.fullname.length == 2) {
        student.firstname = jsonObject.fullname[0];
        student.firstname = student.firstname.charAt(0).toUpperCase() + student.firstname.slice(1).toLowerCase();
        student.lastname = jsonObject.fullname[1];
        student.lastname = student.lastname.charAt(0).toUpperCase() + student.lastname.slice(1).toLowerCase();
        student.gender = jsonObject.gender.charAt(0).toUpperCase() + jsonObject.gender.slice(1).toLowerCase();
        student.imagelink = `${student.lastname.toLowerCase()}_${student.firstname.substring(0, 1).toLowerCase()}.png`;
        student.id = create_UUID();
      } else if (jsonObject.fullname.length == 1) {
        student.firstname = jsonObject.fullname[0];
        student.firstname = student.firstname.charAt(0).toUpperCase() + student.firstname.slice(1).toLowerCase();
        student.lastname = "Unknown";
        student.lastname = student.lastname.charAt(0).toUpperCase() + student.lastname.slice(1).toLowerCase();
        student.gender = jsonObject.gender.charAt(0).toUpperCase() + jsonObject.gender.slice(1).toLowerCase();
        student.imagelink = `${student.lastname.toLowerCase()}_${student.firstname.substring(0, 1).toLowerCase()}.png`;
        student.id = create_UUID();
      }
      allStudents.push(student);
    });

    // let houseGryffindor = allStudents.house;
    // console.log(houseGryffindor);

    document.querySelector(".count-stud").innerHTML = `Current students: ${allStudents.length}`;
    document.querySelector(".count-exp").innerHTML = `Expelled students: ${expellStudent.length}`;

    //Call filtering-function
    currentStudents = filtering("All");
    showStudents();
  }

  function create_UUID() {
    //Taken from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php

    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  console.log(create_UUID());

  function showStudents() {
    console.log(currentStudents);
    // Empty .studentlist
    document.querySelector(".studentlist").innerHTML = "";
    // Destination variable
    let dest = document.querySelector(".studentlist");
    // Template variable
    let temp = document.querySelector("template");

    // Create forEach function for each student
    currentStudents.forEach(student => {
      let klon = temp.cloneNode(!0).content;

      if (student[5] == "lastname") {
        if (sort == "Lastname") {
          klon.querySelector(".student h2").innerHTML = student.lastname + " " + student.firstname;
        } else {
          //Fill HTML-class with data
          klon.querySelector(".student h2").innerHTML = student.firstname + " " + student.lastname;
        }
      } else {
        if (sort == "Lastname") {
          klon.querySelector(".student h2").innerHTML = student.lastname + " " + student.firstname + student.middlename;
        } else {
          klon.querySelector(".student h2").innerHTML = student.firstname + " " + student.middlename + " " + student.lastname;
        }
      }
      //Fill house with data
      klon.querySelector(".student h3").innerHTML = student.house;
      klon.querySelector(".student img").src = `img/${student.imagelink}`;

      klon.querySelector(".student").setAttribute("house", student.house.toLowerCase());

      klon.querySelector(".expell").dataset.id = student.id;
      klon.querySelector(".info").dataset.info = student.id;

      dest.appendChild(klon);
    });
    // Click to expell student
    document.querySelectorAll(".expell").forEach(expell => {
      expell.addEventListener("click", expelStudents);
    });
    //Click to show modal
    document.querySelectorAll(".info").forEach(info => {
      info.addEventListener("click", showModal);
    });

    showHouseNumbers();
  }

  function showModal(student) {
    console.log("Show modal");

    let houses = event.target.dataset.house;
    let id = event.target.dataset.info;
    console.log(id);

    currentStudents.forEach(student => {
      if (student.id == id) {
        document.querySelector("#popup").classList.remove("hide");
        document.querySelector("#popup").classList.add(houses);
        document.querySelector("#popup h1").innerHTML = student.firstname + " " + student.middlename + " " + student.lastname;
        document.querySelector("#popup h3").innerHTML = student.gender;
        document.querySelector("#popup h2").innerHTML = student.house;
        document.querySelector("#popup img").src = `img/${student.imagelink}`;

        // if (student == expelledStudent) {
        //   document.querySelector("#popup").textContent = "The student is expelled";
        // }

        document.querySelector("#popup").addEventListener("click", hideModal);

        function hideModal() {
          console.log("hide modal");
          document.querySelector("#popup").classList.add("hide");
        }
      }
    });
  }

  function sortBy() {
    console.log("Sort json");
    // Change filter
    sort = this.value;
    console.log(sort);
    // If statement to sort by choice
    if (sort == "Firstname") {
      console.log(sort);
      // Function to sort by firstname
      currentStudents.sort(function(a, b) {
        return a.firstname.localeCompare(b.firstname);
      });
    } else if (sort == "Lastname") {
      console.log(sort);
      currentStudents.sort(function(a, b) {
        return a.lastname.localeCompare(b.lastname);
      });
    } else if (sort == "House") {
      console.log(sort);
      currentStudents.sort(function(a, b) {
        return a.house.localeCompare(b.house);
      });
      // Reset sort
    } else if (sort == "none") {
      // Call start function
      start();
    }
    // Call function to show studentlist again
    showStudents();
  }
  function setFilter() {
    house = this.value;
    currentStudents = filtering(house);
    showStudents();
  }

  function filtering(house) {
    console.log(house);
    let list = allStudents.filter(filterHouse);

    function filterHouse(student) {
      if (student.house == house || house == "All") {
        return true;
      } else {
        return false;
      }
    }
    console.log(allStudents);
    return list;
  }

  function expelStudents(event) {
    console.log("Expell clicked");

    const elm = event.target;

    if (elm.dataset.action == "remove") {
      console.log("remove");
      const id = elm.dataset.id;
      const index = currentStudents.findIndex(find);

      function find(student) {
        if (student.id == id) {
          return true;
        } else {
          return false;
        }
      }
      let removed = currentStudents.slice(index, index + 1);
      console.log(removed);
      removed.forEach(listOfExpelled);
      elm.parentElement.remove();
      currentStudents.splice(index, 1);
      allStudents.splice(index, 1);

      document.querySelector(".count-stud").innerHTML = `Current students: ${allStudents.length}`;
      document.querySelector(".count-exp").innerHTML = `Expelled students: ${expellStudent.length}`;

      showHouseNumbers();
    }
    console.table(allStudents);

    function listOfExpelled(student) {
      console.log("list of expelled");
      const finalExpell = {
        firstname: "",
        middlename: "",
        lastname: "",
        gender: "",
        house: "",
        imagelink: "",
        id: ""
      };

      const expelledStudent = Object.create(finalExpell);
      expelledStudent.firstname = student.firstname;
      expelledStudent.middlename = student.middlename;
      expelledStudent.lastname = student.lastname;
      expelledStudent.gender = student.gender;
      expelledStudent.house = student.house;
      expelledStudent.imagelink = student.imagelink;
      expelledStudent.id = student.id;
      expellStudent.push(expelledStudent);

      console.table(expellStudent);
    }

    document.querySelector(".count-exp").addEventListener("click", showListOfExpelled);
  }
  function showListOfExpelled() {
    document.querySelector(".list").innerHTML = `<h1>Expelled students</h1>`;

    expellStudent.forEach(expellStudent => {
      document.querySelector(".list").innerHTML += `<div class="student-expelled"> <img src="img/${expellStudent.imagelink}" alt=""> </div>`;
      document.querySelector(".list").innerHTML += `<div class="student-expelled"> <h1>${expellStudent.firstname + " " + expellStudent.middlename + " " + expellStudent.lastname}</h1> </div>`;
      document.querySelector(".list").innerHTML += `<div class="student-expelled"> <h2>${expellStudent.house}</h2> </div>`;
    });
    document.querySelector(".list").classList.remove("hide");

    document.querySelector(".list").addEventListener("click", hideClass);

    function hideClass() {
      document.querySelector(".list").classList.add("hide");
    }
  }

  function showHouseNumbers(student) {
    gryffindor = allStudents.filter(obj => obj.house.includes("Gryffindor"));
    hufflepuff = allStudents.filter(obj => obj.house.includes("Hufflepuff"));
    slytherin = allStudents.filter(obj => obj.house.includes("Slytherin"));
    ravenclaw = allStudents.filter(obj => obj.house.includes("Ravenclaw"));
    document.querySelector(".count-gryffindor").innerHTML = `Students in Gryffindor: ${gryffindor.length}`;
    document.querySelector(".count-hufflepuff").innerHTML = `Students in Hufflepuff: ${hufflepuff.length}`;
    document.querySelector(".count-slytherin").innerHTML = `Students in Slytherin: ${slytherin.length}`;
    document.querySelector(".count-ravenclaw").innerHTML = `Students in Ravenclaw: ${ravenclaw.length}`;
  }
}
