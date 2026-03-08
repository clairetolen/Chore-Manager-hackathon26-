    document.addEventListener('DOMContentLoaded', () => {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) {
        window.location.href = "index.html";
        return;
      }
      const currentUser = JSON.parse(currentUserStr);
      document.getElementById('username').textContent = currentUser.name;

      // Elements
      const navbarChoreForm = document.getElementById('navbarChoreForm');
      const navbarChoreInput = document.getElementById('navbarChoreInput');
      const choreList = document.getElementById('choreList');
      const groupForm = document.getElementById('groupForm');
      const groupInput = document.getElementById('groupInput');

      let groups = JSON.parse(localStorage.getItem('groups')) || [];

      function saveGroups() {
        localStorage.setItem('groups', JSON.stringify(groups));
      }

      function getUserGroup() {
        return groups.find(g => g.members.includes(currentUser.name));
      }

      function renderChores() {
        choreList.innerHTML = '';
        const group = getUserGroup();
        if (!group) {
          const p = document.createElement('p');
          p.textContent = "You are not in a house. Join or create one!";
          choreList.appendChild(p);
          return;
        }

        // House header and leave button
        const headerDiv = document.createElement('div');
        headerDiv.className = "d-flex justify-content-between align-items-center mb-2";

        const groupHeader = document.createElement('h3');
        groupHeader.textContent = `House: ${group.name}`;
        headerDiv.appendChild(groupHeader);

        const leaveBtn = document.createElement('button');
        leaveBtn.textContent = "Leave House";
        leaveBtn.className = "btn leave btn-sm";
        leaveBtn.addEventListener('click', () => {
          group.members = group.members.filter(m => m !== currentUser.name);
          saveGroups();
          renderChores();
        });
        headerDiv.appendChild(leaveBtn);

       choreList.appendChild(headerDiv);

        // Display chores
        group.chores.forEach(chore => {
          const li = document.createElement('li');
          li.className = "list-group-item d-flex justify-content-between align-items-center";

          const span = document.createElement('span');
          span.textContent = `${chore.text} → ${chore.assignedTo}`;
          if (chore.done) span.style.textDecoration = "line-through";
          li.appendChild(span);

          const btnContainer = document.createElement('div');

          const doneBtn = document.createElement('button');
          doneBtn.textContent = "Done";
          doneBtn.className = "btn btn-sm successbtn me-2";
          doneBtn.addEventListener('click', () => {
            chore.done = !chore.done;
            saveGroups();
            renderChores();
          });

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = "Delete";
          deleteBtn.className = "btn btn-sm deletebtn";
          deleteBtn.addEventListener('click', () => {
            group.chores = group.chores.filter(c => c !== chore);
            saveGroups();
            renderChores();
          });

          btnContainer.appendChild(doneBtn);
          btnContainer.appendChild(deleteBtn);
          li.appendChild(btnContainer);

          choreList.appendChild(li);
        });
      }

      // --- Group Form with password ---
      groupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const groupName = groupInput.value.trim();
        if (!groupName) return;

        let existingGroup = groups.find(g => g.name === groupName);
        let password = prompt(existingGroup ? "Enter house password to join:" : "Set a password for your new house:");

        if (!password) {
          alert("Password is required!");
          return;
        }

        if (existingGroup) {
          if (existingGroup.password !== password) {
            alert("Incorrect password!");
            return;
          }
          groups.forEach(g => g.members = g.members.filter(m => m !== currentUser.name));
          existingGroup.members.push(currentUser.name);
          alert(`You have joined house: ${groupName}`);
        } else {
          const newGroup = { name: groupName, password: password, members: [currentUser.name], chores: [] };
          groups.forEach(g => g.members = g.members.filter(m => m !== currentUser.name));
          groups.push(newGroup);
          alert(`House created: ${groupName}`);
        }

        saveGroups();
        groupInput.value = '';
        renderChores();
      });

      // --- Chore Form with assignee selection ---
      navbarChoreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const choreText = navbarChoreInput.value.trim();
        if (!choreText) return;

        const group = getUserGroup();
        if (!group) {
          alert('Join a house first!');
          return;
        }

        // Ask user who to assign the chore to
        let assignee = prompt(`Assign chore to (choose from: ${group.members.join(', ')}):`);
        if (!assignee || !group.members.includes(assignee)) {
          alert("Invalid assignee! Chore not added.");
          return;
        }

        group.chores.push({ text: choreText, assignedTo: assignee, done: false });
        saveGroups();
        navbarChoreInput.value = '';
        renderChores();

        const dropdown = bootstrap.Dropdown.getInstance(document.getElementById('choreDropdown'));
        if (dropdown) dropdown.hide();
      });
      renderChores();
    });