function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

window.login = async (login, password) => {
    const res = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        body: JSON.stringify({login, password}),
        headers:{
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    if(res.status == 200 || res.status == 201){
        const token = await res.json();
        document.cookie = `token=${token}`
        window.location.href = '/'
    }
}

window.postLegend = async (legend) => {
    const token = getCookie('token');
    const res = await fetch('http://localhost:3000/legends', {
        method: 'POST',
        body: JSON.stringify(legend),
        headers:{
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": token
        }
    })
    return res.status == 201;
}

window.getLegends = async () => {
    const res = await fetch('http://localhost:3000/legends', {
        method: 'GET'
    });
    if(res.status == 200){
        const legends = await res.json();
        return legends;
    }
    else{
        return [];
    }
}

window.getMyLegends = async () => {
    const token = getCookie('token');
    const res = await fetch('http://localhost:3000/legends/mylegends', {
        method: 'Get',
        headers: {
            "Authorization": token
        }
    });
    if(res.status == 200){
        const legends = await res.json();
        return legends;
    }
    else{
        return [];
    }
}

window.updateLegend = async (legend, id) => {
    const token = getCookie('token');
    const res = await fetch('http://localhost:3000/legends/' + id, {
        method: 'PUT',
        body: JSON.stringify(legend),
        headers:{
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": token
        }
    })
    return res.status == 200;
}

window.deleteLegend = async (id) => {
    const token = getCookie('token');
    const res = await fetch('http://localhost:3000/legends/' + id, {
        method: 'DELETE',
        headers:{
            "Authorization": token
        }
    })
    return res.status == 200;
}

window.checkAuth = async () => {
    const token = getCookie('token');
    const res = await fetch('http://localhost:3000/auth', {
        method: 'GET',
        headers:{
            "Authorization": token
        }
    })
    return res.status == 200;
}