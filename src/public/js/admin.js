const navbarSection = document.querySelector('#navbarSection');
fetch('/templates/Navbar.handlebars')
    .then(res => res.text())
    .then(template => {
        const NavbarTemplate = Handlebars.compile(template);
        const role = JSON.parse(localStorage.getItem('currentUser')).payload.role
        const IsAdmin = {
            admin: false
        }
        if (role === 'admin') {
            IsAdmin.admin = true;
        }
        const html = NavbarTemplate(IsAdmin);
        navbarSection.innerHTML = html;
    })
