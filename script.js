"use strict";
document.addEventListener("DOMContentLoaded", start);

function start() {
  let students = [];

  let allStudents = [];

  let house;

  let currentStudents;

  let sort;

  const Student = {
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    house: "",
    imagelink: ""
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
    let jsonData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json"
    );

    // Convert to JSON file
    students = await jsonData.json();

    //Show student list
    newArray(students);
  }
  // Call function to fetch JSON-data
  getJson();
  //Fix array - make objects and split up data to show
  function newArray(students) {
    students.forEach(jsonObject => {
      const student = Object.create(Student);
      jsonObject.fullname = jsonObject.fullname.trim();
      jsonObject.house = jsonObject.house.trim();
      jsonObject.fullname = jsonObject.fullname.split(" ");
      student.house =
        jsonObject.house.charAt(0).toUpperCase() +
        jsonObject.house.slice(1).toLowerCase();
      if (jsonObject.fullname.length == 3) {
        student.firstname = jsonObject.fullname[0];
        student.firstname =
          student.firstname.charAt(0).toUpperCase() +
          student.firstname.slice(1).toLowerCase();
        student.middlename = jsonObject.fullname[1];
        student.middlename =
          student.middlename.charAt(0).toUpperCase() +
          student.middlename.slice(1).toLowerCase();
        student.lastname = jsonObject.fullname[2];
        student.lastname =
          student.lastname.charAt(0).toUpperCase() +
          student.lastname.slice(1).toLowerCase();
        student.gender =
          jsonObject.gender.charAt(0).toUpperCase() +
          jsonObject.gender.slice(1).toLowerCase();
        student.imagelink = `${student.lastname.toLowerCase()}_${student.firstname
          .substring(0, 1)
          .toLowerCase()}.png`;
      } else if (jsonObject.fullname.length == 2) {
        student.firstname = jsonObject.fullname[0];
        student.firstname =
          student.firstname.charAt(0).toUpperCase() +
          student.firstname.slice(1).toLowerCase();
        student.lastname = jsonObject.fullname[1];
        student.lastname =
          student.lastname.charAt(0).toUpperCase() +
          student.lastname.slice(1).toLowerCase();
        student.gender =
          jsonObject.gender.charAt(0).toUpperCase() +
          jsonObject.gender.slice(1).toLowerCase();
        student.imagelink = `${student.lastname.toLowerCase()}_${student.firstname
          .substring(0, 1)
          .toLowerCase()}.png`;
      } else if (jsonObject.fullname.length == 1) {
        student.firstname = jsonObject.fullname[0];
        student.firstname =
          student.firstname.charAt(0).toUpperCase() +
          student.firstname.slice(1).toLowerCase();
        student.lastname = "-Unknown-";
        student.lastname =
          student.lastname.charAt(0).toUpperCase() +
          student.lastname.slice(1).toLowerCase();
        student.gender =
          jsonObject.gender.charAt(0).toUpperCase() +
          jsonObject.gender.slice(1).toLowerCase();
        student.imagelink = `${student.lastname.toLowerCase()}_${student.firstname
          .substring(0, 1)
          .toLowerCase()}.png`;
      }
      allStudents.push(student);
    });

    //Call filtering-function
    currentStudents = filtering("All");
    showStudents();
  }

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
          klon.querySelector(".student h2").innerHTML =
            student.lastname + " " + student.firstname;
        } else {
          //Fill HTML-class with data
          klon.querySelector(".student h2").innerHTML =
            student.firstname + " " + student.lastname;
        }
      } else {
        if (sort == "Lastname") {
          klon.querySelector(".student h2").innerHTML =
            student.lastname + " " + student.firstname + student.middlename;
        } else {
          klon.querySelector(".student h2").innerHTML =
            student.firstname +
            " " +
            student.middlename +
            " " +
            student.lastname;
        }
      }
      //Fill house with data
      klon.querySelector(".student h3").innerHTML = student.house;

      klon
        .querySelector(".student")
        .setAttribute("house", student.house.toLowerCase());

      dest.appendChild(klon);
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
}
