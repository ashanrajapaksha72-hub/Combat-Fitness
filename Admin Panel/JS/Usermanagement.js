document.addEventListener("DOMContentLoaded", function () {

    loadUsers();

    //LOAD ALL USERS
    function loadUsers() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "../PHP/users.php?action=get_all", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);

                if (data.length === 0) {
                    document.getElementById("userTableBody").innerHTML =
                        `<tr><td colspan="7" class="empty-state">No users found.</td></tr>`;
                    return;
                }

                let rows = "";
                data.forEach(function (u) {
                    rows += `
                        <tr>
                            <td class="muted">#${u.id}</td>
                            <td>${u.name || "—"}</td>
                            <td>${u.email}</td>
                            <td>${u.member_id}</td>
                            <td>${u.phone}</td>
                            <td>${u.city || "—"}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn-edit"
                                        onclick="openEditModal(${JSON.stringify(u).replace(/"/g, '&quot;')})">
                                        <i class="fa-solid fa-pen"></i> Edit
                                    </button>
                                    <button class="btn-delete" onclick="deleteUser(${u.id})">
                                        <i class="fa-solid fa-trash"></i> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>`;
                });

                document.getElementById("userTableBody").innerHTML = rows;
            }
        };
        xhr.send();
    }

    //SEARCH FILTER
    document.getElementById("searchInput").addEventListener("input", function () {
        let val = this.value.toLowerCase();
        document.querySelectorAll("#userTableBody tr").forEach(function (row) {
            row.style.display =
                row.textContent.toLowerCase().includes(val) ? "" : "none";
        });
    });

    //OPEN ADD MODAL
    window.openAddModal = function () {
        document.getElementById("modalTitle").textContent = "Add New User";
        document.getElementById("userId").value = "";
        clearForm();
        document.getElementById("modalOverlay").classList.add("open");
    };

    //OPEN EDIT MODAL
    window.openEditModal = function (u) {
        document.getElementById("modalTitle").textContent  = "Edit User";
        document.getElementById("userId").value            = u.id;
        document.getElementById("f_name").value            = u.name         || "";
        document.getElementById("f_email").value           = u.email        || "";
        document.getElementById("f_member_id").value       = u.member_id    || "";
        document.getElementById("f_phone").value           = u.phone        || "";
        document.getElementById("f_password").value        = "";
        document.getElementById("f_emergency").value       = u.emergency    || "";
        document.getElementById("f_address").value         = u.address      || "";
        document.getElementById("f_city").value            = u.city         || "";
        document.getElementById("f_province").value        = u.province     || "";
        document.getElementById("f_postal").value          = u.postal       || "";
        document.getElementById("f_bank").value            = u.bank         || "";
        document.getElementById("f_account_name").value    = u.account_name || "";
        document.getElementById("f_card_number").value     = u.card_number  || "";
        document.getElementById("f_card_type").value       = u.card_type    || "";
        document.getElementById("modalOverlay").classList.add("open");
    };

    //CLOSE MODAL
    window.closeModal = function () {
        document.getElementById("modalOverlay").classList.remove("open");
    };

    //SAVE USER
    window.saveUser = function () {
        let id     = document.getElementById("userId").value;
        let action = id ? "update" : "add";

        let formData = new FormData();
        formData.append("action",       action);
        formData.append("id",           id);
        formData.append("name",         document.getElementById("f_name").value);
        formData.append("email",        document.getElementById("f_email").value);
        formData.append("member_id",    document.getElementById("f_member_id").value);
        formData.append("phone",        document.getElementById("f_phone").value);
        formData.append("password",     document.getElementById("f_password").value);
        formData.append("emergency",    document.getElementById("f_emergency").value);
        formData.append("address",      document.getElementById("f_address").value);
        formData.append("city",         document.getElementById("f_city").value);
        formData.append("province",     document.getElementById("f_province").value);
        formData.append("postal",       document.getElementById("f_postal").value);
        formData.append("bank",         document.getElementById("f_bank").value);
        formData.append("account_name", document.getElementById("f_account_name").value);
        formData.append("card_number",  document.getElementById("f_card_number").value);
        formData.append("card_type",    document.getElementById("f_card_type").value);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../PHP/users.php", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                closeModal();
                let success = xhr.responseText.trim() === "success";
                showMsg(success ? "User saved successfully!" : xhr.responseText, success);
                loadUsers();
            }
        };
        xhr.send(formData);
    };

    //DELETE USER
    window.deleteUser = function (id) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        let formData = new FormData();
        formData.append("action", "delete");
        formData.append("id",     id);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../PHP/users.php", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                let success = xhr.responseText.trim() === "success";
                showMsg(success ? "User deleted successfully!" : xhr.responseText, success);
                loadUsers();
            }
        };
        xhr.send(formData);
    };

    //CLEAR FORM
    function clearForm() {
        ["f_name","f_email","f_member_id","f_phone","f_password",
        "f_emergency","f_address","f_city","f_province","f_postal",
        "f_bank","f_account_name","f_card_number","f_card_type"]
        .forEach(id => document.getElementById(id).value = "");
    }

    //SHOW MESSAGE
    function showMsg(text, success) {
        let msg = document.getElementById("msg");
        msg.textContent = text;
        msg.className   = "msg " + (success ? "success" : "error");
        setTimeout(() => msg.className = "msg", 3000);
    }

});