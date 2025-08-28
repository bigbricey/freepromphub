// Reviews Display Component for FreePromptHub
(function() {
    // Wait for rating system to load
    function initReviewsDisplay() {
        if (!window.FPH?.ratingSystem) {
            setTimeout(initReviewsDisplay, 100);
            return;
        }

        // Add reviews section to prompt pages
        function addReviewsSection() {
            const promptDisplay = document.querySelector('.prompt-display');
            if (!promptDisplay) return;

            const promptId = window.location.pathname;
            const reviewsData = ratingSystem.getReviews(promptId, { limit: 10 });
            
            // Don't show section if no reviews
            if (reviewsData.total === 0) return;

            // Create reviews section
            const reviewsSection = document.createElement('section');
            reviewsSection.className = 'reviews-section';
            reviewsSection.style.cssText = `
                margin: 40px 0;
                padding: 30px 0;
                border-top: 2px solid #dee2e6;
            `;

            reviewsSection.innerHTML = `
                <div class="reviews-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="font-size: 1.5rem; margin: 0;">
                        User Reviews 
                        <span style="font-size: 1rem; color: #6c757d; font-weight: normal;">
                            (${reviewsData.total})
                        </span>
                    </h2>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <label for="sortReviews" style="font-size: 0.95rem; color: #6c757d;">Sort by:</label>
                        <select id="sortReviews" style="padding: 8px 12px; border: 1px solid #dee2e6; border-radius: 6px; background: white; cursor: pointer;">
                            <option value="newest">Newest First</option>
                            <option value="helpful">Most Helpful</option>
                            <option value="rating-high">Highest Rating</option>
                            <option value="rating-low">Lowest Rating</option>
                        </select>
                    </div>
                </div>

                <div id="reviewsList" class="reviews-list">
                    ${renderReviews(reviewsData.reviews, promptId)}
                </div>

                ${reviewsData.hasMore ? `
                    <div style="text-align: center; margin-top: 30px;">
                        <button id="loadMoreReviews" style="padding: 12px 30px; background: white; border: 2px solid #0066CC; color: #0066CC; border-radius: 6px; font-size: 1rem; cursor: pointer;">
                            Load More Reviews
                        </button>
                    </div>
                ` : ''}
            `;

            // Insert before related prompts
            const relatedSection = document.querySelector('.related-prompts');
            if (relatedSection && relatedSection.parentNode) {
                relatedSection.parentNode.insertBefore(reviewsSection, relatedSection);
            }

            // Setup event listeners
            setupReviewsListeners(promptId);
        }

        // Render reviews HTML
        function renderReviews(reviews, promptId) {
            if (reviews.length === 0) {
                return '<p style="text-align: center; color: #6c757d;">No reviews yet. Be the first to review!</p>';
            }

            return reviews.map(review => {
                const date = new Date(review.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });

                const userId = ratingSystem.getCurrentUserId();
                const hasVoted = ratingSystem.userVotes[userId]?.reviewVotes?.[`${promptId}_${review.id}`];

                return `
                    <div class="review-card" style="background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                        <div class="review-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                                    <div style="width: 36px; height: 36px; background: #0066CC; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                        ${review.userName[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div style="font-weight: 500;">
                                            ${review.userName}
                                            ${review.verified ? '<span style="color: #28a745; margin-left: 5px;">✓ Verified</span>' : ''}
                                        </div>
                                        <div style="font-size: 0.85rem; color: #6c757d;">${formattedDate}</div>
                                    </div>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div class="review-rating" style="color: #ffc107; font-size: 1.1rem; margin-bottom: 5px;">
                                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                                </div>
                                <button class="report-btn" data-review-id="${review.id}" style="background: none; border: none; color: #6c757d; font-size: 0.85rem; cursor: pointer; text-decoration: underline;">
                                    Report
                                </button>
                            </div>
                        </div>

                        ${review.title ? `
                            <h4 style="margin-bottom: 10px; font-size: 1.1rem;">${review.title}</h4>
                        ` : ''}

                        <p style="line-height: 1.6; margin-bottom: 15px;">${review.comment}</p>

                        ${review.pros || review.cons || review.useCase ? `
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
                                ${review.pros ? `
                                    <div style="margin-bottom: 10px;">
                                        <strong style="color: #28a745;">✓ Pros:</strong> ${review.pros}
                                    </div>
                                ` : ''}
                                ${review.cons ? `
                                    <div style="margin-bottom: 10px;">
                                        <strong style="color: #dc3545;">✗ Cons:</strong> ${review.cons}
                                    </div>
                                ` : ''}
                                ${review.useCase ? `
                                    <div>
                                        <strong style="color: #0066CC;">Use Case:</strong> ${review.useCase}
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}

                        <div class="review-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                            <div class="helpful-buttons" style="display: flex; gap: 15px; align-items: center;">
                                <span style="font-size: 0.95rem; color: #6c757d;">Was this helpful?</span>
                                <button class="helpful-btn" data-review-id="${review.id}" data-helpful="true" 
                                        style="padding: 5px 15px; background: ${hasVoted === true ? '#28a745' : 'white'}; color: ${hasVoted === true ? 'white' : '#28a745'}; border: 1px solid #28a745; border-radius: 4px; cursor: ${hasVoted ? 'default' : 'pointer'};" 
                                        ${hasVoted ? 'disabled' : ''}>
                                    👍 Yes (${review.helpful || 0})
                                </button>
                                <button class="helpful-btn" data-review-id="${review.id}" data-helpful="false" 
                                        style="padding: 5px 15px; background: ${hasVoted === false ? '#dc3545' : 'white'}; color: ${hasVoted === false ? 'white' : '#dc3545'}; border: 1px solid #dc3545; border-radius: 4px; cursor: ${hasVoted ? 'default' : 'pointer'};"
                                        ${hasVoted ? 'disabled' : ''}>
                                    👎 No (${review.notHelpful || 0})
                                </button>
                            </div>
                            ${review.edited ? '<span style="font-size: 0.85rem; color: #6c757d;">(edited)</span>' : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Setup reviews event listeners
        function setupReviewsListeners(promptId) {
            // Sort reviews
            const sortSelect = document.getElementById('sortReviews');
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    const sortBy = e.target.value;
                    const reviewsData = ratingSystem.getReviews(promptId, { sortBy, limit: 10 });
                    document.getElementById('reviewsList').innerHTML = renderReviews(reviewsData.reviews, promptId);
                    setupReviewButtonListeners(promptId);
                });
            }

            // Load more reviews
            const loadMoreBtn = document.getElementById('loadMoreReviews');
            if (loadMoreBtn) {
                let offset = 10;
                loadMoreBtn.addEventListener('click', () => {
                    const sortBy = document.getElementById('sortReviews')?.value || 'newest';
                    const moreReviews = ratingSystem.getReviews(promptId, { sortBy, limit: 10, offset });
                    
                    const reviewsList = document.getElementById('reviewsList');
                    reviewsList.innerHTML += renderReviews(moreReviews.reviews, promptId);
                    
                    offset += 10;
                    
                    if (!moreReviews.hasMore) {
                        loadMoreBtn.style.display = 'none';
                    }
                    
                    setupReviewButtonListeners(promptId);
                });
            }

            setupReviewButtonListeners(promptId);
        }

        // Setup individual review button listeners
        function setupReviewButtonListeners(promptId) {
            // Helpful/Not helpful buttons
            document.querySelectorAll('.helpful-btn:not([disabled])').forEach(btn => {
                btn.addEventListener('click', function() {
                    const reviewId = this.dataset.reviewId;
                    const isHelpful = this.dataset.helpful === 'true';
                    
                    const result = ratingSystem.voteReview(promptId, reviewId, isHelpful);
                    
                    if (result.success) {
                        // Update button states
                        const buttons = document.querySelectorAll(`.helpful-btn[data-review-id="${reviewId}"]`);
                        buttons.forEach(button => {
                            button.disabled = true;
                            if ((button.dataset.helpful === 'true') === isHelpful) {
                                button.style.background = isHelpful ? '#28a745' : '#dc3545';
                                button.style.color = 'white';
                            }
                            button.style.cursor = 'default';
                        });
                        
                        // Update counts
                        buttons[0].innerHTML = `👍 Yes (${result.helpful})`;
                        buttons[1].innerHTML = `👎 No (${result.notHelpful})`;
                    } else {
                        alert(result.message);
                    }
                });
            });

            // Report buttons
            document.querySelectorAll('.report-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const reviewId = this.dataset.reviewId;
                    const reason = prompt('Please specify why you are reporting this review:');
                    
                    if (reason) {
                        const result = ratingSystem.reportReview(promptId, reviewId, reason);
                        if (result.success) {
                            alert(result.message);
                            this.style.display = 'none';
                        }
                    }
                });
            });
        }

        // Add rating badge to prompt cards on category pages
        function addRatingBadges() {
            const promptCards = document.querySelectorAll('.prompt-card');
            
            promptCards.forEach(card => {
                const link = card.getAttribute('href');
                if (!link) return;
                
                const rating = ratingSystem.getRating(link);
                
                if (rating.total > 0) {
                    // Check if badge already exists
                    if (card.querySelector('.rating-badge')) return;
                    
                    const badge = document.createElement('div');
                    badge.className = 'rating-badge';
                    badge.style.cssText = `
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: white;
                        padding: 5px 10px;
                        border-radius: 20px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        font-size: 0.9rem;
                    `;
                    
                    badge.innerHTML = `
                        <span style="color: #ffc107;">★</span>
                        <span style="font-weight: 600;">${rating.average}</span>
                        <span style="color: #6c757d; font-size: 0.85rem;">(${rating.total})</span>
                    `;
                    
                    card.style.position = 'relative';
                    card.appendChild(badge);
                }
            });
        }

        // Initialize
        addReviewsSection();
        addRatingBadges();
        
        // Update badges periodically (in case new cards are added dynamically)
        setInterval(addRatingBadges, 2000);
    }

    // Start initialization
    initReviewsDisplay();
})();