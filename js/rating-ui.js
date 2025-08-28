// Rating UI Component for FreePromptHub
(function() {
    // Wait for rating system to load
    function initRatingUI() {
        if (!window.FPH?.ratingSystem) {
            setTimeout(initRatingUI, 100);
            return;
        }

        // Add rating display to prompt pages
        function addRatingDisplay() {
            const promptDisplay = document.querySelector('.prompt-display');
            if (!promptDisplay) return;

            const promptId = window.location.pathname;
            const rating = ratingSystem.getRating(promptId);
            const stats = ratingSystem.getStatistics(promptId);
            const userRating = ratingSystem.getUserRating(promptId);

            // Create rating section
            const ratingSection = document.createElement('div');
            ratingSection.className = 'rating-section';
            ratingSection.style.cssText = `
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                border: 1px solid #dee2e6;
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
            `;

            // Build rating HTML
            ratingSection.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                    <!-- Rating Summary -->
                    <div class="rating-summary" style="text-align: center; padding: 20px; background: white; border-radius: 8px;">
                        <div style="font-size: 3rem; font-weight: bold; color: #0066CC;">
                            ${rating.average || 'New'}
                        </div>
                        <div class="stars" style="margin: 10px 0;">
                            ${generateStars(rating.average)}
                        </div>
                        <div style="color: #6c757d; font-size: 0.95rem;">
                            ${rating.total} ratings
                        </div>
                        ${stats.reviewCount > 0 ? `
                            <div style="color: #6c757d; font-size: 0.9rem; margin-top: 5px;">
                                ${stats.reviewCount} reviews
                            </div>
                        ` : ''}
                        ${stats.recommendationRate > 0 ? `
                            <div style="margin-top: 15px; padding: 10px; background: #e8f5e9; border-radius: 6px;">
                                <strong style="color: #2e7d32;">${stats.recommendationRate}%</strong>
                                <div style="font-size: 0.85rem; color: #2e7d32;">Recommend this prompt</div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Rating Breakdown -->
                    <div class="rating-breakdown">
                        <h3 style="margin-bottom: 20px; font-size: 1.2rem;">Rating Breakdown</h3>
                        
                        <!-- Star distribution -->
                        <div class="star-distribution" style="margin-bottom: 20px;">
                            ${[5, 4, 3, 2, 1].map(star => {
                                const count = rating.distribution[star] || 0;
                                const percentage = rating.total > 0 ? (count / rating.total * 100).toFixed(0) : 0;
                                return `
                                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                        <span style="width: 40px; font-size: 0.9rem;">${star} ⭐</span>
                                        <div style="flex: 1; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden;">
                                            <div style="height: 100%; width: ${percentage}%; background: ${star >= 4 ? '#28a745' : star === 3 ? '#ffc107' : '#dc3545'}; transition: width 0.3s;"></div>
                                        </div>
                                        <span style="width: 40px; text-align: right; font-size: 0.9rem; color: #6c757d;">${count}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        <!-- Aspect ratings -->
                        ${rating.helpful > 0 ? `
                            <div class="aspect-ratings" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem; font-weight: bold; color: #0066CC;">${rating.helpful}</div>
                                    <div style="font-size: 0.85rem; color: #6c757d;">Helpful</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem; font-weight: bold; color: #0066CC;">${rating.quality}</div>
                                    <div style="font-size: 0.85rem; color: #6c757d;">Quality</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem; font-weight: bold; color: #0066CC;">${rating.easyToUse}</div>
                                    <div style="font-size: 0.85rem; color: #6c757d;">Easy to Use</div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Rate This Prompt -->
                ${!userRating ? `
                    <div class="rate-prompt" style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #dee2e6;">
                        <h3 style="margin-bottom: 20px;">Rate This Prompt</h3>
                        <div id="ratingForm" style="background: white; padding: 20px; border-radius: 8px;">
                            <div class="star-rating" style="text-align: center; margin-bottom: 20px;">
                                <span style="display: block; margin-bottom: 10px; color: #6c757d;">Click to rate:</span>
                                <div class="star-selector" style="font-size: 2rem; cursor: pointer;">
                                    ${[1, 2, 3, 4, 5].map(star => 
                                        `<span class="star-btn" data-rating="${star}" style="color: #ddd; transition: color 0.2s;">⭐</span>`
                                    ).join('')}
                                </div>
                                <div id="ratingText" style="margin-top: 10px; font-size: 0.95rem; color: #6c757d; min-height: 20px;"></div>
                            </div>

                            <div class="quick-feedback" style="display: none;">
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; margin-bottom: 10px; font-weight: 500;">What did you think?</label>
                                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                        <label style="display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px; cursor: pointer;">
                                            <input type="checkbox" id="helpful" style="margin-right: 8px;"> Helpful
                                        </label>
                                        <label style="display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px; cursor: pointer;">
                                            <input type="checkbox" id="quality" style="margin-right: 8px;"> High Quality
                                        </label>
                                        <label style="display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px; cursor: pointer;">
                                            <input type="checkbox" id="easyToUse" style="margin-right: 8px;"> Easy to Use
                                        </label>
                                    </div>
                                </div>
                                <button id="submitRating" class="btn-primary" style="width: 100%; padding: 12px; background: #0066CC; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer;">
                                    Submit Rating
                                </button>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.1rem; color: #2e7d32;">✓ You rated this prompt ${userRating.rating} stars</div>
                        <div style="font-size: 0.9rem; color: #2e7d32; margin-top: 5px;">Thank you for your feedback!</div>
                    </div>
                `}

                <!-- Write Review Button -->
                <div style="text-align: center; margin-top: 20px;">
                    <button id="writeReviewBtn" style="padding: 12px 30px; background: white; border: 2px solid #0066CC; color: #0066CC; border-radius: 6px; font-size: 1rem; cursor: pointer; transition: all 0.2s;">
                        ✍️ Write a Review
                    </button>
                </div>
            `;

            // Insert after prompt content
            const promptContent = document.querySelector('.prompt-content');
            if (promptContent && promptContent.parentNode) {
                promptContent.parentNode.insertBefore(ratingSection, promptContent.nextSibling);
            }

            // Add event listeners
            setupRatingListeners(promptId);
        }

        // Setup rating event listeners
        function setupRatingListeners(promptId) {
            // Star rating hover and click
            const stars = document.querySelectorAll('.star-btn');
            const ratingText = document.getElementById('ratingText');
            const quickFeedback = document.querySelector('.quick-feedback');
            let selectedRating = 0;

            const ratingTexts = {
                1: 'Not helpful at all',
                2: 'Needs improvement',
                3: 'Average',
                4: 'Good prompt',
                5: 'Excellent prompt!'
            };

            stars.forEach((star, index) => {
                // Hover effect
                star.addEventListener('mouseenter', () => {
                    const rating = index + 1;
                    updateStarDisplay(stars, rating);
                    if (ratingText) {
                        ratingText.textContent = ratingTexts[rating];
                    }
                });

                // Click to select
                star.addEventListener('click', () => {
                    selectedRating = index + 1;
                    updateStarDisplay(stars, selectedRating);
                    if (quickFeedback) {
                        quickFeedback.style.display = 'block';
                    }
                });
            });

            // Mouse leave - restore selected rating
            const starSelector = document.querySelector('.star-selector');
            if (starSelector) {
                starSelector.addEventListener('mouseleave', () => {
                    updateStarDisplay(stars, selectedRating);
                    if (ratingText) {
                        ratingText.textContent = selectedRating ? ratingTexts[selectedRating] : '';
                    }
                });
            }

            // Submit rating
            const submitBtn = document.getElementById('submitRating');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    if (selectedRating === 0) {
                        alert('Please select a rating');
                        return;
                    }

                    const aspects = {};
                    if (document.getElementById('helpful')?.checked) aspects.helpful = 5;
                    if (document.getElementById('quality')?.checked) aspects.quality = 5;
                    if (document.getElementById('easyToUse')?.checked) aspects.easyToUse = 5;

                    const result = ratingSystem.submitRating(promptId, selectedRating, aspects);
                    
                    if (result.success) {
                        // Show success message
                        document.getElementById('ratingForm').innerHTML = `
                            <div style="padding: 30px; text-align: center;">
                                <div style="font-size: 3rem; margin-bottom: 10px;">✅</div>
                                <div style="font-size: 1.2rem; font-weight: 500; margin-bottom: 10px;">Thank you for rating!</div>
                                <div style="color: #6c757d;">Your feedback helps others find the best prompts</div>
                            </div>
                        `;
                        
                        // Refresh rating display after 2 seconds
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    } else {
                        alert(result.message);
                    }
                });
            }

            // Write review button
            const writeReviewBtn = document.getElementById('writeReviewBtn');
            if (writeReviewBtn) {
                writeReviewBtn.addEventListener('click', () => {
                    showReviewModal(promptId);
                });
            }
        }

        // Update star display
        function updateStarDisplay(stars, rating) {
            stars.forEach((star, index) => {
                star.style.color = index < rating ? '#ffc107' : '#ddd';
            });
        }

        // Generate star display
        function generateStars(rating) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
            let html = '';
            for (let i = 0; i < fullStars; i++) {
                html += '<span style="color: #ffc107; font-size: 1.2rem;">★</span>';
            }
            if (hasHalfStar) {
                html += '<span style="color: #ffc107; font-size: 1.2rem;">☆</span>';
            }
            for (let i = 0; i < emptyStars; i++) {
                html += '<span style="color: #ddd; font-size: 1.2rem;">★</span>';
            }
            return html;
        }

        // Show review modal
        function showReviewModal(promptId) {
            const modal = document.createElement('div');
            modal.className = 'review-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            `;

            modal.innerHTML = `
                <div style="background: white; border-radius: 12px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px;">
                    <h2 style="margin-bottom: 20px;">Write a Review</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Rating *</label>
                        <div class="review-star-selector" style="font-size: 2rem;">
                            ${[1, 2, 3, 4, 5].map(star => 
                                `<span class="review-star" data-rating="${star}" style="color: #ddd; cursor: pointer;">⭐</span>`
                            ).join('')}
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Review Title</label>
                        <input type="text" id="reviewTitle" style="width: 100%; padding: 10px; border: 1px solid #dee2e6; border-radius: 6px;" 
                               placeholder="Summarize your experience">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Your Review *</label>
                        <textarea id="reviewComment" style="width: 100%; padding: 10px; border: 1px solid #dee2e6; border-radius: 6px; min-height: 100px; resize: vertical;" 
                                  placeholder="Share your experience with this prompt..." required></textarea>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">What worked well?</label>
                        <input type="text" id="reviewPros" style="width: 100%; padding: 10px; border: 1px solid #dee2e6; border-radius: 6px;" 
                               placeholder="e.g., Easy to customize, great results">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">What could be better?</label>
                        <input type="text" id="reviewCons" style="width: 100%; padding: 10px; border: 1px solid #dee2e6; border-radius: 6px;" 
                               placeholder="e.g., Needs more examples">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">How did you use this prompt?</label>
                        <input type="text" id="reviewUseCase" style="width: 100%; padding: 10px; border: 1px solid #dee2e6; border-radius: 6px;" 
                               placeholder="e.g., Used for my startup's business plan">
                    </div>

                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="cancelReview" style="padding: 10px 20px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                        <button id="submitReview" style="padding: 10px 20px; background: #0066CC; color: white; border: none; border-radius: 6px; cursor: pointer;">
                            Submit Review
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Setup review modal listeners
            let reviewRating = 0;
            const reviewStars = modal.querySelectorAll('.review-star');
            
            reviewStars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    reviewRating = index + 1;
                    reviewStars.forEach((s, i) => {
                        s.style.color = i < reviewRating ? '#ffc107' : '#ddd';
                    });
                });
            });

            // Cancel button
            document.getElementById('cancelReview').addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            // Submit review
            document.getElementById('submitReview').addEventListener('click', () => {
                const comment = document.getElementById('reviewComment').value;
                
                if (reviewRating === 0) {
                    alert('Please select a rating');
                    return;
                }
                
                if (!comment || comment.length < 10) {
                    alert('Please write at least 10 characters in your review');
                    return;
                }

                const reviewData = {
                    rating: reviewRating,
                    title: document.getElementById('reviewTitle').value,
                    comment: comment,
                    pros: document.getElementById('reviewPros').value,
                    cons: document.getElementById('reviewCons').value,
                    useCase: document.getElementById('reviewUseCase').value,
                    aspects: {
                        helpful: reviewRating,
                        quality: reviewRating,
                        easyToUse: reviewRating
                    }
                };

                const result = ratingSystem.submitReview(promptId, reviewData);
                
                if (result.success) {
                    document.body.removeChild(modal);
                    alert('Thank you for your review!');
                    location.reload();
                } else {
                    alert(result.message);
                }
            });

            // Click outside to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        }

        // Initialize
        addRatingDisplay();
    }

    // Start initialization
    initRatingUI();
})();