console.log("start app.js")

const API_USERS = "http://localhost:8080/api/users/";
const API_AUTHENTICATED_USER = "http://localhost:8080/api/users/authenticated";
const API_ROLES = "http://localhost:8080/api/roles/";

// function for DEFINITION AUTH USER and loading index page
window.onload = async function () {
    const authUser = await getAuthenticatedUser();
    let roleSetAuthUser = authUser.roleSet;
    if (roleSetAuthUser.length === 1 && roleSetAuthUser[0].authority === "ROLE_USER") {
        await getUserById(authUser.id);
    } else {
        await getAllUsers();
    }
    await getAllRoles();
}

// function and SET INTERVAL for auto updating information about ALL USERS
setInterval(refreshAllUsersContent, 1000)

async function refreshAllUsersContent() {
    const allUsersHeader = document.getElementById("nav-home-tab");
    const editUserModal = document.querySelector(".edit-user-modal");
    const deleteUserModal = document.querySelector(".delete-user-modal");
    if (allUsersHeader.classList.contains("active")
        && !editUserModal.classList.contains("modal-show")
        && !deleteUserModal.classList.contains("modal-show")) {
        await getAllUsers();
    }
}

// Fetching function
//------------------
// FETCH function for GETTING authenticated user
async function getAuthenticatedUser() {
    try {
        const response = await fetch(API_AUTHENTICATED_USER, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        const respData = await response.json();
        showUserRoles(respData);
        return respData;
    } catch (error) {
        console.log(error);
    }
}

// FETCH function for GETTING all users
async function getAllUsers() {
    try {
        const response = await fetch(API_USERS, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        const respData = await response.json();
        showAllUsers(respData);
        showAllRoles(respData);
    } catch (error) {
        console.log(error);
    }
}

// FETCH function for GETTING user by ID
async function getUserById(id) {
    try {
        const response = await fetch(API_USERS + id, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        const respData = await response.json();
        showUserById(respData);
    } catch (error) {
        console.log(error);
    }
}

// FETCH function for DELETE user by ID
async function deleteUserById(id) {
    try {
        const response = await fetch(API_USERS + id, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        });
        const respData = await response.json();
    } catch (error) {
        console.log(error);
    }
}

// FETCH function for GETTING all roles in application
async function getAllRoles() {
    try {
        const response = await fetch(API_ROLES, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        const respData = await response.json();
        showAllRoles(respData);
    } catch (error) {
        console.log(error);
    }
}
// SHOWING function
//-----------------
// function for SHOWING ROLE OF USER on left sidebar (links)
function showUserRoles(data) {
    const rolesEl = document.querySelector(".sidebar-with-roles");
    const roleSetSize = data.roleSet.size;
    data.roleSet.forEach(role => {
        const roleEl = document.createElement("div");
        const pEl = document.createElement("p");
        const aEl = document.createElement("a");
        if (role.authority === "ROLE_ADMIN") {
            roleEl.classList.add("div-sidebar-item-admin", "sidebar-active");
        } else {
            roleEl.classList.add("div-sidebar-item-user");
        }
        if (roleSetSize === 1 && role.authority === "ROLE_USER") {
            roleEl.classList.add("sidebar-active");
        }
        roleEl.classList.add("p-0");
        pEl.classList.add("mb-0");
        aEl.classList.add("nav-link", role.authority.replaceAll("ROLE_", "").toLowerCase() + "-page");
        aEl.innerHTML = `${role.authority.replaceAll("ROLE_", "")}`;
        aEl.setAttribute("aria-current", "page");
        aEl.setAttribute("href", "#");
        pEl.appendChild(aEl);
        roleEl.appendChild(pEl);
        rolesEl.appendChild(roleEl);
    });
    const userLink = document.querySelector(".user-page");
    const adminLink = document.querySelector(".admin-page");
    const divSidebarAdmin = document.querySelector(".div-sidebar-item-admin");
    const divSidebarUser = document.querySelector(".div-sidebar-item-user");
    if (userLink && !adminLink) {
        divSidebarUser.classList.add("sidebar-active");
    } else if (userLink) {
        userLink.addEventListener("click", () => {
            if (divSidebarAdmin) {
                divSidebarUser.classList.add("sidebar-active");
                divSidebarAdmin.classList.remove("sidebar-active");
            }
            return getUserById(data.id)});
    }
    if (adminLink) {
        adminLink.addEventListener("click", () => {
            location.reload();
            if (divSidebarUser) {
                divSidebarUser.classList.remove("sidebar-active");
            }
            divSidebarAdmin.classList.add("sidebar-active");
            return getAllUsers()});
    }
}

// function for SHOWING page with 'ALL USERS' and 'CREATE NEW USER'
function showAllUsers(data) {
    const content = document.querySelector(".admin-panel");
    content.innerHTML = "";
    content.innerHTML = `
        <h2 class="ps-3 admin-panel-h2">Admin Panel</h2>
                <nav class="ps-3">
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">User table</button>
                        <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">New User</button>
                    </div>
                </nav>
                <div class="tab-content ps-3" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                        <h4 class="mb-0 ms-0 pb-3 pt-3 ps-3 border">All users</h4>
                        <div class="p-4 left-bar">
                            <table class="table table-striped users-table border-top">
                                <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">Age</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Roles</th>
                                    <th scope="col">Edit</th>
                                    <th scope="col">Delete</th>
                                </tr>
                                </thead>
                                <tbody class="all-users-table">
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- Tab Create New User-->
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                        <h4 class="mb-0 ms-0 pb-3 pt-3 ps-3 border">Add new user</h4>
                        <div class="p-4 left-bar">
                            <form id="create-user-form">
                                <div class="row mb-3 justify-content-center" >
                                    <div class="col-3 pt-3 justify-content-center align-items-center">
                                        <div class="text-center pt-3">Firstname</div>
                                        <input type="text" class="form-control" id="firstName" name="firstName" placeholder="Enter firstname"/>
                                        <div class="text-center pt-3">Lastname</div>
                                        <input type="text" class="form-control" id="lastName" name="lastName" placeholder="Enter lastname"/>
                                        <div class="text-center pt-3">Age</div>
                                        <input type="number" class="form-control" id="age" name="age" placeholder="Enter age"/>
                                        <div class="text-center pt-3">Email</div>
                                        <input type="email" class="form-control" id="username" name="username" placeholder="Enter your email" />
                                        <div class="text-center pt-3">Password</div>
                                        <input type="password" class="form-control" id="password" name="password" placeholder="Enter password"/>
                                        <div class="text-center pt-3">Role</div>
                                        <select class="w-100 all-roles-select" size="2" name="authoritiesIds" multiple>

                                        </select>
                                        <div class="justify-content-center d-grid gap-2 col-6 mx-auto pt-3">
                                            <button type="submit" class="btn btn-primary create-button">Add new user</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>`;
    const usersEl = document.querySelector(".all-users-table");
    usersEl.innerHTML = "";
    data.forEach(user => {
        const userEl = document.createElement("tr");
        const editBtn = document.createElement("td");
        const deleteBtn = document.createElement("td");
        userEl.innerHTML = `
             <td><p>${user.id}</p> </td>
             <td><p>${user.firstName}</p> </td>
             <td><p>${user.lastName}</p> </td>
             <td><p>${user.age}</p> </td>
             <td><p>${user.username}</p> </td>
             <td>
                ${user.roleSet.sort((a, b) => a.id - b.id).map(function (role) {
                    let roleModel = role.authority.replaceAll("ROLE_", "");
                    return `<span> ${roleModel}</span>` 
                })}
             </td>
        `;
        editBtn.innerHTML = `
            <button type="button" class="btn btn-primary edit-button" >
            Edit
            </button>
        `;
        deleteBtn.innerHTML = `
            <button type="button" class="btn btn-primary delete-button">
            Delete
            </button>`;
        editBtn.addEventListener("click", () => openEditModal(user.id));
        deleteBtn.addEventListener("click", () => openDeleteModal(user.id))
        userEl.append(editBtn);
        userEl.append(deleteBtn);
        usersEl.appendChild(userEl);

        const newUserHeader = document.getElementById("nav-profile-tab");
        newUserHeader.addEventListener("click", getAllRoles)
    });

    const createUserForm = document.getElementById("create-user-form");
    createUserForm.addEventListener("submit", handleCreateUserFormSubmit)

    // INNER functions for create new user
    async function handleCreateUserFormSubmit(event) {
        event.preventDefault();
        const data = serializeForm(createUserForm);
        const response = await createUserSendData(data);
    }

    function serializeForm(formNode) {
        let objectResponse = {};
        const { elements } = formNode;
        let arrayRoles = [];
        let selectElement;
        Array.from(elements).filter((item) => !!item.name)
            .map((element) => {
                if (element.type === 'select-multiple') {
                    selectElement = element;
                } else {
                    objectResponse[element.name] = element.value;
                }
            })
        let options = selectElement && selectElement.options;
        let opt;
        for (let i = 0; i < options.length; i++) {
            opt = options[i];
            if (opt.selected) {
                arrayRoles.push(opt.value)
            }
        }
        objectResponse.authoritiesIds = arrayRoles;
        return objectResponse;
    }

    async function createUserSendData(data) {
        try {
            await fetch(API_USERS, {
                method: 'POST',
                headers:
                    {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                body: JSON.stringify(data)
            })
        } catch (error) {
            console.log(error);
        }
        location.replace("http://localhost:8080/admin/")
    }
}

// function for showing ALL ROLES in application
function showAllRoles(data) {
    const allRolesSelect = document.querySelector(".all-roles-select");
    allRolesSelect.innerHTML = "";
    data.forEach(role => {
        const option = document.createElement("option");
        option.setAttribute("value", role.id);
        option.innerHTML = `${role.authority.replaceAll("ROLE_", "")}`;
        allRolesSelect.appendChild(option);
    })
}

// function for showing USER BY ID
function showUserById(data) {
    const content = document.querySelector(".admin-panel");
    content.innerHTML = "";
    content.innerHTML = `
        <h2 class="ps-3 user-panel-h2">User Information page</h2>
                <div class="ps-3">
                    <h4>About user</h4>
                </div>
                <div class="ps-3">
                    <table class="table table-striped users-table">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Age</th>
                            <th scope="col">Email</th>
                            <th scope="col">Roles</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><p>${data.id}</p> </td>
                            <td><p>${data.firstName}</p> </td>
                            <td><p>${data.lastName}</p> </td>
                            <td><p>${data.age}</p> </td>
                            <td><p>${data.username}</p> </td>
                            <td>
                                ${data.roleSet.map(function (role) {
                                    let roleModel = role.authority.replaceAll("ROLE_", "");
                                    return `<span> ${roleModel}</span>`
                                })}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>`;
}

// MODAL Windows Functions
// -----------------------
const modalEditEl = document.querySelector(".edit-user-modal");
const modalDeleteEl = document.querySelector(".delete-user-modal");

// function for showing modal window and handle information for UPDATING user by ID
async function openEditModal(id) {
    const resp = await fetch(API_USERS + id, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    const respData = await resp.json();
    const respRoles = await fetch(API_ROLES, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    const respRolesData = await respRoles.json();
    modalEditEl.classList.add("modal-show");
    const mainDivEdit = document.querySelector(".edit-user-modal");
    mainDivEdit.setAttribute("id", "editModal" + id);
    modalEditEl.innerHTML = `
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editModalLabel">Edit user</h5>
                <button type="button" class="btn-close edit-modal-button-close-header"  aria-label="Close"></button>
            </div>
            <form id="update-user-form">
            <div class="modal-body">
                    <div class="row mb-3 justify-content-center">
                        <div class="col-6 pt-3 justify-content-center align-items-center">
                            <div class="pt-3 text-center">ID</div>
                            <input type="number" class="form-control" id="idEditModal" name="id"  value="${respData.id}" disabled/>
                            <div class="pt-3 text-center">Firstname</div>
                            <input type="text" class="form-control" id="firstNameEditModal" name="firstName" placeholder="${respData.firstName}" value="${respData.firstName}" />
                            <div class="pt-3 text-center">Lastname</div>
                            <input type="text" class="form-control" id="lastNameEditModal" name="lastName" placeholder="${respData.lastName}" value="${respData.lastName}" />
                            <div class="pt-3 text-center">Age</div>
                            <input type="number" class="form-control" id="ageEditModal" name="age" placeholder="${respData.age}" value="${respData.age}"/>
                            <div class="pt-3 text-center">Email</div>
                            <input type="email" class="form-control" id="usernameEditModal" name="username" placeholder="Enter email" value="${respData.username}"/>
                            <div class="pt-3 text-center">Password</div>
                            <input type="password" class="form-control" id="passwordEditModal" name="password" placeholder="Enter password"/>
                            <div class="pt-3 text-center">Role</div>
                            <select class="w-100" size="2" name="authoritiesIds" multiple>
                                    ${respRolesData.map(function (role) {
                                        let roleModel = role.authority.replaceAll("ROLE_", "");
                                        return `<option value="${role.id}"> ${roleModel}</option>`
                                    })}
                            </select>
                        </div>
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary edit-modal-button-close-footer" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary edit-button-submin">Edit</button>
            </div>
            </form>
        </div>
    </div>`;
    const btnCloseHeaderEditModal = document.querySelector(".edit-modal-button-close-header");
    const btnCloseFooterEditModal = document.querySelector(".edit-modal-button-close-footer");
    btnCloseHeaderEditModal.addEventListener("click", () => {
        closeEditModal();
    });
    btnCloseFooterEditModal.addEventListener("click", () => {
        closeEditModal();
    });
    const updateUserForm = document.getElementById("update-user-form");
    updateUserForm.addEventListener("submit", handleUpdateUserFormSubmit);

    // INNER function for handle UPDATING user
    async function handleUpdateUserFormSubmit(event) {
        event.preventDefault();
        const data = serializeForm(updateUserForm);
        const response = await updateUserSendData(data);
    }

    function serializeForm(formNode) {
        let objectResponse = {};
        const { elements } = formNode;
        let arrayRoles = [];
        let selectElement;
        Array.from(elements).filter((item) => !!item.name)
            .map((element) => {
                if (element.type === 'select-multiple') {
                    selectElement = element;
                } else {
                    objectResponse[element.name] = element.value;
                }
            })
        let options = selectElement && selectElement.options;
        let opt;
        for (let i = 0; i < options.length; i++) {
            opt = options[i];
            if (opt.selected) {
                arrayRoles.push(opt.value)
            }
        }
        objectResponse.authoritiesIds = arrayRoles;
        return objectResponse;
    }

    async function updateUserSendData(data) {
        try {
            await fetch(API_USERS, {
                method: 'PUT',
                headers:
                    {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                body: JSON.stringify(data)
            })
            closeEditModal();
        } catch (error) {
            console.log(error);
        }
    }
}

// function for showing modal window and handle information for DELETE user by ID
async function openDeleteModal(id) {
    const resp = await fetch(API_USERS + id, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    const respData = await resp.json();
    modalDeleteEl.classList.add("modal-show");
    const mainDivDelete = document.querySelector(".delete-user-modal");
    mainDivDelete.setAttribute("id", "deleteModal" + id);
    modalDeleteEl.innerHTML = `
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Delete user</h5>
                <button type="button" class="btn-close delete-modal-button-close-header"  aria-label="Close"></button>
            </div>
            <form >
            <div class="modal-body">
                    <div class="row mb-3 justify-content-center">
                        <div class="col-6 pt-3 justify-content-center align-items-center">
                            <div class="pt-3 text-center">ID</div>
                            <input type="number" class="form-control" id="idEditModal" name="id"  value="${respData.id}" disabled/>
                            <div class="pt-3 text-center">Firstname</div>
                            <input type="text" class="form-control" id="firstNameEditModal" name="firstName" placeholder="${respData.firstName}" value="${respData.firstName}" disabled/>
                            <div class="pt-3 text-center">Lastname</div>
                            <input type="text" class="form-control" id="lastNameEditModal" name="lastName" placeholder="${respData.lastName}" value="${respData.lastName}" disabled/>
                            <div class="pt-3 text-center">Age</div>
                            <input type="number" class="form-control" id="ageEditModal" name="age" placeholder="${respData.age}" value="${respData.age}" disabled/>
                            <div class="pt-3 text-center">Email</div>
                            <input type="email" class="form-control" id="usernameEditModal" name="username" placeholder="Enter email" value="${respData.username}" disabled/>
                            <div class="pt-3 text-center">Role</div>
                            <select class="w-100" size="2" name="authoritiesIds" id="rolesUserEditModal" multiple disabled> 
                                    ${respData.roleSet.map(function (role) {
                                        let roleModel = role.authority.replaceAll("ROLE_", "");
                                        return `<option value="${role.id}"> ${roleModel}</option>`
                                        })}
                            </select>
                        </div>
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary delete-modal-button-close-footer" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary delete-button-submit">Delete</button>
            </div>
            </form>
        </div>
    </div>`;
    const btnSubmitDelete = document.querySelector(".delete-button-submit")
    btnSubmitDelete.addEventListener("click", () => deleteUserById(id))
    const btnCloseHeaderDeleteModal = document.querySelector(".delete-modal-button-close-header");
    const btnCloseFooterDeleteModal = document.querySelector(".delete-modal-button-close-footer");
    btnCloseHeaderDeleteModal.addEventListener("click", () => closeDeleteModal());
    btnCloseFooterDeleteModal.addEventListener("click", () => closeDeleteModal());
}

// CLOSE EDIT MODAL
function closeEditModal() {
    modalEditEl.classList.remove("modal-show");
}

// CLOSE DELETE MODAL
function closeDeleteModal() {
    modalDeleteEl.classList.remove("modal-show");
}




