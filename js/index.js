document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const searchForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    // Event listener for form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get the search query from the input field
        const query = searchInput.value.trim();

        if (query === '') {
            return;
        }

        // Clear previous search results
        userList.innerHTML = '';
        reposList.innerHTML = '';

        try {
            // Make a request to the GitHub User Search Endpoint
            const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!response.ok) {
                throw new Error(`GitHub API request failed with status ${response.status}`);
            }

            const data = await response.json();

            // Display user search results
            if (data.items && data.items.length > 0) {
                data.items.forEach((user) => {
                    const userElement = document.createElement('li');
                    userElement.innerHTML = `
                        <img src="${user.avatar_url}" alt="${user.login}">
                        <p><strong>${user.login}</strong></p>
                        <a href="${user.html_url}" target="_blank">Profile</a>
                    `;
                    userElement.addEventListener('click', () => {
                        displayUserRepos(user.login);
                    });
                    userList.appendChild(userElement);
                });
            } else {
                userList.textContent = 'No users found.';
            }
        } catch (error) {
            console.error('Error:', error);
            userList.textContent = 'An error occurred while fetching data.';
        }
    });

    // Function to display repositories for a specific user
    async function displayUserRepos(username) {
        try {
            // Make a request to the User Repos Endpoint
            const response = await fetch(`https://api.github.com/users/${username}/repos`, {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!response.ok) {
                throw new Error(`GitHub API request failed with status ${response.status}`);
            }

            const repos = await response.json();

            // Display user repositories
            if (repos && repos.length > 0) {
                repos.forEach((repo) => {
                    const repoItem = document.createElement('li');
                    repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                    reposList.appendChild(repoItem);
                });
            } else {
                reposList.textContent = 'No repositories found for this user.';
            }
        } catch (error) {
            console.error('Error:', error);
            reposList.textContent = 'An error occurred while fetching repositories.';
        }
    }
});

