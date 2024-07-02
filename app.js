async function fetchNews() {
    try {
        const response = await fetch('https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news');
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }
        const newsList = await response.json();
        renderNewsList(newsList);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}


function formatDateString(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'N/A'; 
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}


function renderNewsList(newsList) {
    const table = document.querySelector('table');
    table.querySelectorAll('tr:not(:first-child)').forEach(row => row.remove());

    newsList.forEach(news => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${news.id}</td>
            <td>${news.title}</td>
            <td>${news.category}</td>
            <td>${news.likes}</td>
            <td>${news.dateUpdated ? formatDateString(news.dateUpdated) : 'N/A'}</td>
            <td>${news.dateCreated ? formatDateString(news.dateCreated) : 'N/A'}</td>
            <td style="display: flex; justify-content: space-between; align-items: center;">
                <button class="delete-button" data-id="${news.id}">Delete</button>  
            </td>
        `;
        table.appendChild(row);
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', deleteNews);
    });

    document.querySelectorAll('.update-button').forEach(button => {
        button.addEventListener('click', showUpdateForm);
    });
}

async function deleteNews(event) {
    const newsId = event.target.getAttribute('data-id');
    const rowToDelete = event.target.closest('tr');
    try {
        const response = await fetch(`https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${newsId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete news');
        }

        rowToDelete.classList.add('fade-out');
        setTimeout(() => {
            rowToDelete.remove();
        }, 500); 

    } catch (error) {
        console.error('Error deleting news:', error);
    }
}

async function createNews(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newsData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        editorFirstName: formData.get('editorFirstname'),
        editorLastName: formData.get('editorLastname'),
        dateCreated: new Date().toISOString(), 
        dateUpdated: null 
    };

    try {
        const response = await fetch('https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        });
        if (!response.ok) {
            throw new Error('Failed to create news item');
        }
        fetchNews(); 
        window.location.href = '/'; 
    } catch (error) {
        console.error('Error creating news:', error);
    }
}



async function fetchSingleNews(newsId) {
    try {
        const response = await fetch(`https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${newsId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch single news item');
        }
        const newsItem = await response.json();
        return newsItem;
    } catch (error) {
        console.error('Error fetching single news:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchNews);

if (document.querySelector('form')) {
    document.querySelector('form').addEventListener('submit', createNews);
}
