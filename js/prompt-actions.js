// Prompt actions - favorites and usage tracking
(function() {
    // Wait for auth to be loaded
    function initPromptActions() {
        if (typeof auth === 'undefined' || !window.FPH || !window.FPH.auth) {
            setTimeout(initPromptActions, 100);
            return;
        }

        // Add favorite button to prompt pages
        function addFavoriteButton() {
            const promptDisplay = document.querySelector('.prompt-display');
            if (!promptDisplay) return;

            const promptTitle = document.querySelector('.prompt-title')?.textContent || 'Untitled';
            const promptId = window.location.pathname;
            const category = window.location.pathname.split('/')[2] || 'uncategorized';

            // Create favorite button container
            const favoriteContainer = document.createElement('div');
            favoriteContainer.className = 'favorite-container';
            favoriteContainer.style.cssText = `
                margin: 20px 0;
                display: flex;
                align-items: center;
                gap: 15px;
            `;

            // Create favorite button
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-btn';
            favoriteBtn.dataset.promptId = promptId;
            
            // Style the button
            favoriteBtn.style.cssText = `
                padding: 10px 20px;
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            // Check if already favorited
            updateFavoriteButton(favoriteBtn, promptId);

            // Add click handler
            favoriteBtn.onclick = function() {
                if (!auth.isLoggedIn()) {
                    auth.showLoginPrompt();
                    return;
                }

                if (auth.isFavorited(promptId)) {
                    auth.removeFavorite(promptId);
                } else {
                    auth.addFavorite(promptId, promptTitle, category);
                }
                
                updateFavoriteButton(favoriteBtn, promptId);
            };

            // Add usage counter
            const usageCounter = document.createElement('span');
            usageCounter.className = 'usage-counter';
            usageCounter.style.cssText = `
                color: #6c757d;
                font-size: 0.9rem;
            `;
            
            const usageCount = auth.getUsageCount(promptId);
            if (usageCount > 0) {
                usageCounter.textContent = `You've used this ${usageCount} time${usageCount > 1 ? 's' : ''}`;
            }

            favoriteContainer.appendChild(favoriteBtn);
            favoriteContainer.appendChild(usageCounter);

            // Insert after title
            const titleElement = document.querySelector('.prompt-title');
            if (titleElement && titleElement.parentNode) {
                titleElement.parentNode.insertBefore(favoriteContainer, titleElement.nextSibling);
            }
        }

        // Update favorite button state
        function updateFavoriteButton(btn, promptId) {
            if (auth.isFavorited(promptId)) {
                btn.innerHTML = '❤️ <span>Saved to Favorites</span>';
                btn.style.background = '#fff5f5';
                btn.style.borderColor = '#ff4444';
                btn.style.color = '#ff4444';
            } else {
                btn.innerHTML = '🤍 <span>Save to Favorites</span>';
                btn.style.background = 'white';
                btn.style.borderColor = '#dee2e6';
                btn.style.color = '#212529';
            }
        }

        // Track copy button clicks
        function trackCopyUsage() {
            const copyButton = document.getElementById('copy-button');
            if (!copyButton) return;

            const originalOnclick = copyButton.onclick;
            copyButton.onclick = function(e) {
                // Track usage if logged in
                if (auth.isLoggedIn()) {
                    const promptTitle = document.querySelector('.prompt-title')?.textContent || 'Untitled';
                    const promptId = window.location.pathname;
                    const category = window.location.pathname.split('/')[2] || 'uncategorized';
                    
                    auth.trackUsage(promptId, promptTitle, category);
                    
                    // Update usage counter
                    const usageCounter = document.querySelector('.usage-counter');
                    if (usageCounter) {
                        const count = auth.getUsageCount(promptId);
                        usageCounter.textContent = `You've used this ${count} time${count > 1 ? 's' : ''}`;
                    }
                }

                // Call original handler
                if (originalOnclick) {
                    originalOnclick.call(this, e);
                }
            };
        }

        // Add login prompt for non-logged users
        function addLoginPrompt() {
            if (auth.isLoggedIn()) return;

            const promptDisplay = document.querySelector('.prompt-display');
            if (!promptDisplay) return;

            const loginPrompt = document.createElement('div');
            loginPrompt.className = 'login-prompt';
            loginPrompt.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
                text-align: center;
            `;
            
            loginPrompt.innerHTML = `
                <h3 style="margin-bottom: 10px;">🚀 Track Your Progress</h3>
                <p style="margin-bottom: 20px; opacity: 0.95;">
                    Create a free account to save favorites, track usage, and get personalized recommendations
                </p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <a href="/auth/register.html" style="
                        background: white;
                        color: #764ba2;
                        padding: 10px 30px;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: 600;
                        display: inline-block;
                    ">Sign Up Free</a>
                    <a href="/auth/login.html" style="
                        background: transparent;
                        color: white;
                        padding: 10px 30px;
                        border: 2px solid white;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: 600;
                        display: inline-block;
                    ">Login</a>
                </div>
            `;

            // Insert before related prompts
            const relatedSection = document.querySelector('.related-prompts');
            if (relatedSection && relatedSection.parentNode) {
                relatedSection.parentNode.insertBefore(loginPrompt, relatedSection);
            }
        }

        // Initialize all features
        addFavoriteButton();
        trackCopyUsage();
        addLoginPrompt();
        
        // Update auth UI
        if (auth) {
            auth.updateUIState();
        }
    }

    // Start initialization
    initPromptActions();
})();