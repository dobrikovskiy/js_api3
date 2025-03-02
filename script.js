document.addEventListener("DOMContentLoaded", function() {
    const unsplashAccessKey = "VZtVsLg6aFv14TIKzclPIWVGjNydOomdxI7HY9uwKLs"; // API-ключ
    const photoElement = document.getElementById("photo");
    const photographerElement = document.getElementById("photographer");
    const likeBtn = document.getElementById("like-btn");
    const likeCountElement = document.getElementById("like-count");
    const historyList = document.getElementById("history-list");

    let likeCount = 0;
    let currentPhotoId = null;
    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Загрузка случайного изображения
    async function fetchRandomPhoto() {
        try {
            const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${unsplashAccessKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке фото:", error);
        }
    }

    // Отображение фото и информации о фотографе
    async function displayPhoto() {
        const photoData = await fetchRandomPhoto();
        if (photoData) {
            photoElement.src = photoData.urls.regular;
            photographerElement.textContent = `Фотограф: ${photoData.user.name}`;
            currentPhotoId = photoData.id;

            // Проверяем, есть ли лайки для этого фото в локальном хранилище
            likeCount = localStorage.getItem(`likes_${currentPhotoId}`) || 0;
            likeCountElement.textContent = likeCount;

            // Добавляем фото в историю
            addToHistory(photoData);
        }
    }

    // Добавление фото в историю
    function addToHistory(photoData) {
        const isAlreadyInHistory = history.some(item => item.id === photoData.id);
        if (!isAlreadyInHistory) {
            history.push({ id: photoData.id, url: photoData.urls.small, photographer: photoData.user.name });
            localStorage.setItem("history", JSON.stringify(history));
            renderHistory();
        }
    }

    // Отображение истории
    function renderHistory() {
        historyList.innerHTML = history
            .map(
                item => `
            <div class="col-md-4">
                <img src="${item.url}" alt="${item.photographer}" class="img-fluid">
                <p>${item.photographer}</p>
            </div>
        `
            )
            .join("");
    }

    // Лайк фото
    likeBtn.addEventListener("click", function() {
        likeCount++;
        likeCountElement.textContent = likeCount;
        localStorage.setItem(`likes_${currentPhotoId}`, likeCount);
    });

    // Инициализация
    displayPhoto();
    renderHistory();
});