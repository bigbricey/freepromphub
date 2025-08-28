// Rating and Feedback System for FreePromptHub
class RatingSystem {
    constructor() {
        this.ratings = this.loadRatings();
        this.reviews = this.loadReviews();
        this.userVotes = this.loadUserVotes();
        this.initializeDefaults();
    }

    // Initialize default ratings for all prompts
    initializeDefaults() {
        // If no ratings exist, create default ones
        if (Object.keys(this.ratings).length === 0) {
            // Sample default ratings to show the system works
            this.ratings = {
                '/prompts/business/business-plan.html': {
                    average: 4.8,
                    total: 234,
                    distribution: { 5: 180, 4: 42, 3: 8, 2: 3, 1: 1 },
                    helpful: 4.9,
                    quality: 4.8,
                    easyToUse: 4.7
                },
                '/prompts/content/blog-post.html': {
                    average: 4.7,
                    total: 189,
                    distribution: { 5: 142, 4: 35, 3: 9, 2: 2, 1: 1 },
                    helpful: 4.8,
                    quality: 4.7,
                    easyToUse: 4.6
                },
                '/prompts/everyday/meal-planner.html': {
                    average: 4.9,
                    total: 412,
                    distribution: { 5: 350, 4: 52, 3: 8, 2: 1, 1: 1 },
                    helpful: 4.9,
                    quality: 4.8,
                    easyToUse: 4.9
                }
            };
            this.saveRatings();
        }
    }

    // Load data from localStorage
    loadRatings() {
        try {
            return JSON.parse(localStorage.getItem('fph_ratings') || '{}');
        } catch (e) {
            return {};
        }
    }

    loadReviews() {
        try {
            return JSON.parse(localStorage.getItem('fph_reviews') || '{}');
        } catch (e) {
            return {};
        }
    }

    loadUserVotes() {
        try {
            return JSON.parse(localStorage.getItem('fph_user_votes') || '{}');
        } catch (e) {
            return {};
        }
    }

    // Save data to localStorage
    saveRatings() {
        localStorage.setItem('fph_ratings', JSON.stringify(this.ratings));
    }

    saveReviews() {
        localStorage.setItem('fph_reviews', JSON.stringify(this.reviews));
    }

    saveUserVotes() {
        localStorage.setItem('fph_user_votes', JSON.stringify(this.userVotes));
    }

    // Get rating for a prompt
    getRating(promptId) {
        return this.ratings[promptId] || {
            average: 0,
            total: 0,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            helpful: 0,
            quality: 0,
            easyToUse: 0
        };
    }

    // Submit a rating
    submitRating(promptId, rating, aspects = {}) {
        const user = window.FPH?.auth?.getCurrentUser();
        const userId = user?.id || 'anonymous_' + Date.now();

        // Check if user already rated
        if (this.hasUserRated(promptId, userId)) {
            return { success: false, message: 'You have already rated this prompt' };
        }

        // Initialize rating object if doesn't exist
        if (!this.ratings[promptId]) {
            this.ratings[promptId] = {
                average: 0,
                total: 0,
                distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                helpful: 0,
                quality: 0,
                easyToUse: 0
            };
        }

        const promptRating = this.ratings[promptId];
        
        // Update distribution
        promptRating.distribution[rating]++;
        promptRating.total++;

        // Calculate new average
        let sum = 0;
        for (let i = 1; i <= 5; i++) {
            sum += i * promptRating.distribution[i];
        }
        promptRating.average = (sum / promptRating.total).toFixed(1);

        // Update aspect ratings
        if (aspects.helpful) {
            promptRating.helpful = this.updateAspectRating(promptRating.helpful, aspects.helpful, promptRating.total);
        }
        if (aspects.quality) {
            promptRating.quality = this.updateAspectRating(promptRating.quality, aspects.quality, promptRating.total);
        }
        if (aspects.easyToUse) {
            promptRating.easyToUse = this.updateAspectRating(promptRating.easyToUse, aspects.easyToUse, promptRating.total);
        }

        // Record user vote
        if (!this.userVotes[userId]) {
            this.userVotes[userId] = {};
        }
        this.userVotes[userId][promptId] = {
            rating: rating,
            aspects: aspects,
            timestamp: new Date().toISOString()
        };

        // Save to storage
        this.saveRatings();
        this.saveUserVotes();

        // Track event if auth is available
        if (window.FPH?.auth) {
            window.FPH.auth.trackEvent('rating_submitted', { promptId, rating });
        }

        return { success: true, newRating: promptRating };
    }

    // Update aspect rating with new value
    updateAspectRating(current, newValue, totalCount) {
        if (totalCount === 1) {
            return newValue;
        }
        const currentSum = current * (totalCount - 1);
        return ((currentSum + newValue) / totalCount).toFixed(1);
    }

    // Check if user has rated a prompt
    hasUserRated(promptId, userId) {
        if (!userId) {
            userId = this.getCurrentUserId();
        }
        return this.userVotes[userId]?.[promptId] !== undefined;
    }

    // Submit a review
    submitReview(promptId, reviewData) {
        const user = window.FPH?.auth?.getCurrentUser();
        const userId = user?.id || 'anonymous_' + Date.now();
        const userName = user?.name || 'Anonymous User';

        // Validate review
        if (!reviewData.rating || !reviewData.comment) {
            return { success: false, message: 'Please provide both rating and comment' };
        }

        if (reviewData.comment.length < 10) {
            return { success: false, message: 'Review must be at least 10 characters' };
        }

        // Initialize reviews array for prompt if doesn't exist
        if (!this.reviews[promptId]) {
            this.reviews[promptId] = [];
        }

        // Create review object
        const review = {
            id: 'review_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            userId: userId,
            userName: userName,
            rating: reviewData.rating,
            comment: reviewData.comment,
            title: reviewData.title || '',
            pros: reviewData.pros || '',
            cons: reviewData.cons || '',
            useCase: reviewData.useCase || '',
            helpful: 0,
            notHelpful: 0,
            timestamp: new Date().toISOString(),
            edited: false,
            verified: user !== null, // Verified if logged in
            moderated: false
        };

        // Add review
        this.reviews[promptId].unshift(review);

        // Also submit rating
        this.submitRating(promptId, reviewData.rating, reviewData.aspects);

        // Save to storage
        this.saveReviews();

        // Track event
        if (window.FPH?.auth) {
            window.FPH.auth.trackEvent('review_submitted', { promptId, rating: reviewData.rating });
        }

        return { success: true, review: review };
    }

    // Get reviews for a prompt
    getReviews(promptId, options = {}) {
        const {
            sortBy = 'newest',
            limit = 10,
            offset = 0
        } = options;

        const reviews = this.reviews[promptId] || [];
        
        // Sort reviews
        let sorted = [...reviews];
        switch (sortBy) {
            case 'helpful':
                sorted.sort((a, b) => b.helpful - a.helpful);
                break;
            case 'rating-high':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-low':
                sorted.sort((a, b) => a.rating - b.rating);
                break;
            case 'newest':
            default:
                // Already sorted by newest
                break;
        }

        // Paginate
        return {
            reviews: sorted.slice(offset, offset + limit),
            total: reviews.length,
            hasMore: offset + limit < reviews.length
        };
    }

    // Vote review as helpful/not helpful
    voteReview(promptId, reviewId, isHelpful) {
        const userId = this.getCurrentUserId();
        const voteKey = `${promptId}_${reviewId}`;

        // Check if already voted
        if (this.userVotes[userId]?.reviewVotes?.[voteKey]) {
            return { success: false, message: 'You have already voted on this review' };
        }

        // Find the review
        const reviews = this.reviews[promptId];
        if (!reviews) return { success: false, message: 'Review not found' };

        const review = reviews.find(r => r.id === reviewId);
        if (!review) return { success: false, message: 'Review not found' };

        // Update vote count
        if (isHelpful) {
            review.helpful++;
        } else {
            review.notHelpful++;
        }

        // Record user vote
        if (!this.userVotes[userId]) {
            this.userVotes[userId] = {};
        }
        if (!this.userVotes[userId].reviewVotes) {
            this.userVotes[userId].reviewVotes = {};
        }
        this.userVotes[userId].reviewVotes[voteKey] = isHelpful;

        // Save
        this.saveReviews();
        this.saveUserVotes();

        return { success: true, helpful: review.helpful, notHelpful: review.notHelpful };
    }

    // Report a review
    reportReview(promptId, reviewId, reason) {
        const review = this.reviews[promptId]?.find(r => r.id === reviewId);
        if (!review) return { success: false, message: 'Review not found' };

        // In production, this would send to a moderation queue
        console.log('Review reported:', { promptId, reviewId, reason });
        
        // For demo, just mark as reported
        review.reported = true;
        review.reportReason = reason;
        
        this.saveReviews();
        
        return { success: true, message: 'Thank you for reporting. We will review this content.' };
    }

    // Get statistics for a prompt
    getStatistics(promptId) {
        const rating = this.getRating(promptId);
        const reviews = this.reviews[promptId] || [];
        
        // Calculate sentiment from reviews
        let sentiment = { positive: 0, neutral: 0, negative: 0 };
        reviews.forEach(review => {
            if (review.rating >= 4) sentiment.positive++;
            else if (review.rating === 3) sentiment.neutral++;
            else sentiment.negative++;
        });

        // Get common keywords from reviews
        const keywords = this.extractKeywords(reviews);

        return {
            rating: rating,
            reviewCount: reviews.length,
            sentiment: sentiment,
            keywords: keywords,
            recommendationRate: rating.total > 0 ? 
                Math.round((rating.distribution[5] + rating.distribution[4]) / rating.total * 100) : 0
        };
    }

    // Extract common keywords from reviews
    extractKeywords(reviews) {
        const wordCount = {};
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'this', 'that', 'it', 'very', 'really']);
        
        reviews.forEach(review => {
            const words = (review.comment + ' ' + review.pros + ' ' + review.cons)
                .toLowerCase()
                .replace(/[^a-z\s]/g, '')
                .split(/\s+/);
            
            words.forEach(word => {
                if (word.length > 3 && !stopWords.has(word)) {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                }
            });
        });

        // Return top 10 keywords
        return Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));
    }

    // Get user's rating for a prompt
    getUserRating(promptId, userId) {
        if (!userId) {
            userId = this.getCurrentUserId();
        }
        return this.userVotes[userId]?.[promptId];
    }

    // Get current user ID
    getCurrentUserId() {
        const user = window.FPH?.auth?.getCurrentUser();
        return user?.id || 'anonymous_' + this.getOrCreateAnonymousId();
    }

    // Get or create anonymous ID
    getOrCreateAnonymousId() {
        let anonId = localStorage.getItem('fph_anon_id');
        if (!anonId) {
            anonId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('fph_anon_id', anonId);
        }
        return anonId;
    }

    // Get top rated prompts
    getTopRated(limit = 10) {
        return Object.entries(this.ratings)
            .filter(([_, rating]) => rating.total >= 5) // Min 5 ratings
            .sort((a, b) => b[1].average - a[1].average)
            .slice(0, limit)
            .map(([promptId, rating]) => ({
                promptId,
                average: rating.average,
                total: rating.total
            }));
    }

    // Get recent reviews across all prompts
    getRecentReviews(limit = 10) {
        const allReviews = [];
        
        Object.entries(this.reviews).forEach(([promptId, reviews]) => {
            reviews.forEach(review => {
                allReviews.push({ ...review, promptId });
            });
        });

        return allReviews
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
}

// Initialize rating system
const ratingSystem = new RatingSystem();

// Export for use
window.FPH = window.FPH || {};
window.FPH.ratingSystem = ratingSystem;