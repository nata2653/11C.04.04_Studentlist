"use strict";
document.addEventListener("DOMContentLoaded", start);

function start() {
  let students = [];

  let allStudents = [];

  let currentStudents;

  let house;

  let sort;

  let expellStudent = [];

  let familyBlood = [];

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
    id: "",
    expelled: "",
    bloodStatus: "",
    prefect: "",
    InqSquad: ""
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

  //Get families array and fetch it
  async function getJsonBlood() {
    // Fetch JSON-data for bloodtypes
    let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/families.json");

    // Convert to JSON file
    familyBlood = await jsonData.json();

    const halfBlood = familyBlood.half;
    const pureBlood = familyBlood.pure;

    //Find half- and pureblood
    getHalfBlood(halfBlood);
    getPureBlood(pureBlood);
  }
  getJsonBlood();

  //Clean array - make objects and split up data to show
  function cleanArray(students) {
    newStudentHacked();
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
      if (student.lastname == "Finch-fletchley") {
        console.log("Finch-fletchley");
        student.lastname = student.lastname.split("-");
        student.lastname = `${student.lastname[0].charAt(0).toUpperCase() + student.lastname[0].slice(1).toLowerCase()}-${student.lastname[1].charAt(0).toUpperCase() +
          student.lastname[1].slice(1).toLowerCase()}`;
      }

      if (student.bloodStatus == "") {
        student.bloodStatus = "Muggle born";
      }
      student.InqSquad = false;
      student.prefect = "";

      allStudents.push(student);
    });

    document.querySelector(".count-stud").innerHTML = `Current students: ${allStudents.length}`;
    document.querySelector(".count-exp").innerHTML = `Expelled students: ${expellStudent.length}`;

    //Call filtering-function
    currentStudents = filtering("All");
    showHouseNumbers();
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
    // console.log(currentStudents);
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
        document.querySelector("#popup img").src = `img/${student.imagelink}`;
        document.querySelector("#popup h1").innerHTML = student.firstname + " " + student.middlename + " " + student.lastname;
        document.querySelector("#popup h2").innerHTML = student.house;
        document.querySelector("#popup p").innerHTML = `Gender: ${student.gender}`;
        document.querySelector("#popup .blood").innerHTML = `Blood-type: ${student.bloodStatus}`;
        document.querySelector(".squad").addEventListener("click", inquisitorial);
        document.querySelector(".squad").dataset.id = student.id;
        document.querySelector(".prefect").dataset.id = student.id;

        if (student.prefect === "prefect") {
          document.querySelector(".prefect").addEventListener("click", studentsPrefect);
        } else {
          document.querySelector(".prefect").addEventListener("click", studentsPrefect);
          document.querySelector(".prefect").textContent = "Make student prefect";
        }

        if (student.house === "Gryffindor") {
          document.querySelector("#popup").className = "gryffindor";
          document.querySelector("#popup .crest img").src = "img/gryffindorcrest.png";
          prefectGryffindor(student);
        } else if (student.house === "Hufflepuff") {
          document.querySelector("#popup").className = "hufflepuff";
          document.querySelector("#popup .crest img").src = "img/hufflepuffcrest.png";
          prefectHufflepuff(student);
        } else if (student.house === "Slytherin") {
          document.querySelector("#popup").className = "slytherin";
          document.querySelector("#popup .crest img").src = "img/slytherincrest.png";
          prefectSlytherin(student);
        } else {
          document.querySelector("#popup").className = "ravenclaw";
          document.querySelector("#popup .crest img").src = "img/ravenclawcrest.png";
          prefectRavenclaw(student);
        }

        document.querySelector("#close-popup").addEventListener("click", hideModal);

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
    }
    // Call function to show studentlist again
    showStudents();
  }
  //Function to make filter
  function setFilter() {
    house = this.value;
    currentStudents = filtering(house);
    showStudents();
  }
  //Make the filter happen (boolean and return)
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

  //Function to expell student
  function expelStudents(event) {
    console.log("Expell clicked");

    // const elm = event.target;
    let elm = event.target;
    let id;
    let index;
    let index2;

    if (elm.dataset.action == "remove") {
      console.log("remove");
      id = elm.dataset.id;
      index = currentStudents.findIndex(find);
      index2 = allStudents.findIndex(find);

      function find(student) {
        if (student.id == id) {
          return true;
        } else {
          return false;
        }
      }
    }

    let removed = currentStudents.slice(index, index + 1);
    console.log(removed);
    removed.forEach(listOfExpelled);
    elm.parentElement.classList.add("remove");
    currentStudents.splice(index, 1);
    allStudents.splice(index2, 1);

    document.querySelector(".count-stud").innerHTML = `Current students: ${allStudents.length}`;
    document.querySelector(".count-exp").innerHTML = `Expelled students: ${expellStudent.length}`;

    elm.parentElement.addEventListener("transitionend", function() {
      this.remove();
    });

    showHouseNumbers();
  }

  console.table(allStudents);
  //Show the expelled students in a list
  function listOfExpelled(student) {
    console.log("list of expelled");

    //Object with students data
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
    // document.querySelector(".student").className = "fade-out";

    expellStudent.push(expelledStudent);

    // console.table(expellStudent);
  }

  document.querySelector(".count-exp").addEventListener("click", showListOfExpelled);
  document.querySelector(".counter button").classList.add("green");

  //Function to show list of expelled
  function showListOfExpelled() {
    document.querySelector(".list").innerHTML = `<h1>Expelled students</h1><div class="close-list">x</div> <br>`;

    expellStudent.forEach(expellStudent => {
      document.querySelector(".list").innerHTML += `<div class="student-expelled"> <img src="img/${expellStudent.imagelink}" alt=""> 
      <div class="text"><h1>${expellStudent.firstname + " " + expellStudent.middlename + " " + expellStudent.lastname}</h1><h2>${expellStudent.house}</h2> <p>The student is expelled</p></div></div>`;
    });

    document.querySelector(".list").classList.remove("hide");

    document.querySelector(".close-list").addEventListener("click", hideClass);

    function hideClass() {
      document.querySelector(".list").classList.add("hide");
    }
  }
  //Make function to show numbers of students in house
  function showHouseNumbers() {
    console.log("test");

    //Use 'includes' to find specific house
    gryffindor = allStudents.filter(obj => obj.house.includes("Gryffindor"));
    hufflepuff = allStudents.filter(obj => obj.house.includes("Hufflepuff"));
    slytherin = allStudents.filter(obj => obj.house.includes("Slytherin"));
    ravenclaw = allStudents.filter(obj => obj.house.includes("Ravenclaw"));
    document.querySelector(".count-gryffindor").innerHTML = `Students in Gryffindor: ${gryffindor.length}`;
    document.querySelector(".count-hufflepuff").innerHTML = `Students in Hufflepuff: ${hufflepuff.length}`;
    document.querySelector(".count-slytherin").innerHTML = `Students in Slytherin: ${slytherin.length}`;
    document.querySelector(".count-ravenclaw").innerHTML = `Students in Ravenclaw: ${ravenclaw.length}`;

    console.log(hufflepuff);
  }

  //Make function to halfblood
  function getHalfBlood(halfBlood) {
    let half;

    halfBlood.forEach(student => {
      half = student;
      // console.log(half);

      allStudents.forEach(student => {
        if (student.lastname == half) {
          // console.log("The student is halfblood");
          student.bloodStatus = "Halfblood";
        }
      });
    });
  }

  function getPureBlood(pureBlood) {
    let pure;

    pureBlood.forEach(student => {
      pure = student;
      console.log(pure);

      allStudents.forEach(student => {
        if (student.lastname == pure) {
          console.log("The student is pureblood");
          student.bloodStatus = "Pureblood";
        }
      });
    });
    hackedBloodStatus();
  }
  // Make inquisitorial squad function
  function inquisitorial() {
    console.log("inquisitorial squad clicked");

    const id = this.dataset.id;
    console.log(id);

    //Make forEach and if-statement
    allStudents.forEach(student => {
      if (student.bloodStatus === "Pureblood" || student.house === "Slytherin") {
        if (student.id == id && student.InqSquad == false) {
          student.InqSquad = true;
          document.querySelector(".squad").textContent = "Remove from squad";
          setTimeout(function() {
            removeFromSquad(id);
          }, 1000);
        } else if (student.id == id && student.InqSquad == true) {
          student.InqSquad = false;
          document.querySelector(".squad").textContent = "Add to squad";
        }
      }
      console.log(student.InqSquad);
    });
  }
  // Make remove from squad function
  function removeFromSquad(id) {
    console.log("Remove from squad clicked");
    //Remove from squad with if-statement
    allStudents.forEach(student => {
      if (student.id == id && student.InqSquad == true) {
        student.InqSquad = false;
        document.querySelector(".squad").textContent = "Add to squad";
      }
    });
  }

  //Make hacked blood status function
  function hackedBloodStatus() {
    console.log("Hacked Bloodstatus start");

    //Make forEach and if-statement to change bloodstatus on students
    allStudents.forEach(student => {
      if (student.bloodStatus === "Halfblood" || student.bloodStatus === "Muggle born") {
        student.bloodStatus = "Pureblood";
      } else {
        const arrayBlood = ["Pureblood", "Halfblood", "Muggle born"];
        const bloodStatus = arrayBlood[Math.floor(Math.random() * arrayBlood.length)];
        student.bloodStatus = bloodStatus;
      }
    });
  }

  function newStudentHacked() {
    const student = Object.create(Student);

    student.firstname = "Natalie";
    student.lastname = "Sirich";
    student.gender = "Girl";
    student.id = create_UUID();
    student.imagelink = "anonymous.png";

    allStudents.push(student);
  }

  function studentsPrefect() {
    console.log("Prefect clicked");
    console.log(allStudents);
    const id = this.dataset.id;

    allStudents.forEach(student => {
      if (student.id === id && student.prefect === "") {
        student.prefect = "prefect";
        document.querySelector(".prefect").textContent = "Remove student from prefect";
      } else if (student.id === id && student.prefect === "prefect") {
        student.prefect = "";
        document.querySelector(".prefect").textContent = "Make student prefect";
      }
    });
  }

  function prefectGryffindor(student) {
    const prefect = gryffindor.filter(obj => obj.prefect.includes("prefect"));
    console.log(prefect.length === 2);
    if (student.prefect === "" && prefect.length === 2) {
      document.querySelector(".prefect").removeEventListener("click", studentsPrefect);
      document.querySelector(".prefect").textContent = "Too many prefects from this house";
      document.querySelector(".prefect").className = "not-allowed";
    }
  }
  function prefectHufflepuff(student) {
    const prefect = hufflepuff.filter(obj => obj.prefect.includes("prefect"));
    console.log(prefect.length === 2);
    if (student.prefect === "" && prefect.length === 2) {
      document.querySelector(".prefect").removeEventListener("click", studentsPrefect);
      document.querySelector(".prefect").textContent = "Too many prefects from this house";
      document.querySelector(".prefect").className = "not-allowed";
    }
  }
  function prefectSlytherin(student) {
    const prefect = slytherin.filter(obj => obj.prefect.includes("prefect"));
    console.log(prefect.length === 2);
    if (student.prefect === "" && prefect.length === 2) {
      document.querySelector(".prefect").removeEventListener("click", studentsPrefect);
      document.querySelector(".prefect").textContent = "Too many prefects from this house";
      document.querySelector(".prefect").className = "not-allowed";
    }
  }
  function prefectRavenclaw(student) {
    const prefect = ravenclaw.filter(obj => obj.prefect.includes("prefect"));
    console.log(prefect.length === 2);
    if (student.prefect === "" && prefect.length === 2) {
      document.querySelector(".prefect").removeEventListener("click", studentsPrefect);
      document.querySelector(".prefect").textContent = "Too many prefects from this house";
      document.querySelector(".prefect").className = "not-allowed";
    }
  }
}
