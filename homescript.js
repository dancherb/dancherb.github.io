var projectsOpen = false;
projectsText.style.fontSize = "0px" //keep 'projects' title invisible and tiny initially
projectsText.style.opacity = 0;

function openProjects() {
  if (projectsOpen === false) {
    // projectsContain.style.position = "relative"
    projectsText.style.fontSize = "35px"
    projectsText.style.opacity = 1
    projectsText.style.transition = "all 0.3s ease";
    // and then after a delay, open the projects
    setTimeout(openList, 300)

    function openList() {
      project1.className = "projectO"
      project2.className = "projectO"
      project3.className = "projectO"
      project4.className = "projectO"
      project5.className = "projectO"
    }
    container.style.paddingTop = "0px"
    //
    toggleIcon()
    projectsOpen = true
  } else {
    projectsText.style.fontSize = "0px"
    projectsText.style.opacity = 0
    projectsText.style.transition = "all 0.3s ease 0.3s";
    //
    project1.className = "projectC"
    project2.className = "projectC"
    project3.className = "projectC"
    project4.className = "projectC"
    project5.className = "projectC"
    //
    container.style.paddingTop = "100px"
    //
    setTimeout(toggleIcon, 650)
    projectsOpen = false
  }
  container.style.transition = "all 0.8s ease";
}

function toggleIcon() {
  projectsIcon.classList.toggle("fa-envelope-open-o");
  projectsIcon.classList.toggle("fa-envelope-o");
}

// check if projects should start open (e.g. if coming straight back from flash page)
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}
var id = getUrlVars()["id"];
if (id == 2) {
  openProjects()
}