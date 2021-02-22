$.post({ url: '/api/credits',
    success(data) {
        data = JSON.parse(JSON.stringify(data.data));
        document.getElementById('credits[0]').innerText = data[0];
        document.getElementById('credits[1]').innerText = data[1];
        document.getElementById('credits[1.1]').innerText = data[1];
        document.getElementById('credits[2]').innerText = data[2];
    },
    error() {
        window.location.reload();
    }
})