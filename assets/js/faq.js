// FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('faq-search');
    
    // Initialize FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    otherAnswer.style.maxHeight = null;
                    otherToggle.textContent = '+';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                toggle.textContent = '+';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.textContent = '−';
            }
        });
        
        // Initialize closed state
        answer.style.maxHeight = null;
    });
    
    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter FAQ items
            filterFAQsByCategory(category);
        });
    });
    
    function filterFAQsByCategory(category) {
        faqItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Close all open FAQ items when switching categories
        faqItems.forEach(item => {
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            answer.style.maxHeight = null;
            toggle.textContent = '+';
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterFAQsBySearch(searchTerm);
        });
    }
    
    function filterFAQsBySearch(searchTerm) {
        let hasResults = false;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            const matches = question.includes(searchTerm) || answer.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                hasResults = true;
                
                // Highlight search terms
                if (searchTerm !== '') {
                    highlightSearchTerm(item, searchTerm);
                } else {
                    removeHighlight(item);
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message
        showNoResultsMessage(!hasResults && searchTerm !== '');
        
        // Reset category filter when searching
        if (searchTerm !== '') {
            categoryButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
            });
        }
    }
    
    function highlightSearchTerm(item, searchTerm) {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer');
        
        // Remove existing highlights
        removeHighlight(item);
        
        // Highlight in question
        const questionText = question.textContent;
        const questionRegex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
        question.innerHTML = questionText.replace(questionRegex, '<mark>$1</mark>');
        
        // Highlight in answer (first paragraph only to avoid complexity)
        const firstParagraph = answer.querySelector('p');
        if (firstParagraph) {
            const answerText = firstParagraph.textContent;
            const answerRegex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
            firstParagraph.innerHTML = answerText.replace(answerRegex, '<mark>$1</mark>');
        }
    }
    
    function removeHighlight(item) {
        const marks = item.querySelectorAll('mark');
        marks.forEach(mark => {
            mark.outerHTML = mark.textContent;
        });
    }
    
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function showNoResultsMessage(show) {
        let noResultsDiv = document.querySelector('.no-results');
        
        if (show && !noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <h3>No results found</h3>
                    <p>Try different keywords or browse by category</p>
                    <button class="btn btn-outline" onclick="document.getElementById('faq-search').value=''; document.getElementById('faq-search').dispatchEvent(new Event('input'));">Clear Search</button>
                </div>
            `;
            document.querySelector('.faq-grid').appendChild(noResultsDiv);
        } else if (!show && noResultsDiv) {
            noResultsDiv.remove();
        }
    }
    
    // Smooth scroll to FAQ item from external links
    function scrollToFAQ(faqId) {
        const faqItem = document.querySelector(`[data-faq-id="${faqId}"]`);
        if (faqItem) {
            faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            faqItem.querySelector('.faq-question').click();
        }
    }
    
    // Check for URL hash to auto-open specific FAQ
    if (window.location.hash) {
        const faqId = window.location.hash.substring(1);
        setTimeout(() => scrollToFAQ(faqId), 500);
    }
    
    // Add FAQ item IDs for linking
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question h3').textContent;
        const faqId = question.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        item.setAttribute('data-faq-id', faqId);
    });
    
    // Add helpful FAQ suggestions
    addHelpfulSuggestions();
    
    function addHelpfulSuggestions() {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'helpful-suggestions';
        suggestionsContainer.innerHTML = `
            <div style="background: var(--background-alt); padding: 30px; border-radius: var(--border-radius); margin: 40px 0; text-align: center;">
                <h3>Quick Links</h3>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
                    <button class="suggestion-btn" data-search="ingredients">What's in treats?</button>
                    <button class="suggestion-btn" data-search="shipping">When available?</button>
                    <button class="suggestion-btn" data-search="feeding guide">How much to feed?</button>
                    <button class="suggestion-btn" data-search="allergies">Safe for allergies?</button>
                    <button class="suggestion-btn" data-search="results">How long for results?</button>
                </div>
            </div>
        `;
        
        // Insert before contact section
        const contactSection = document.querySelector('.contact-section');
        contactSection.parentNode.insertBefore(suggestionsContainer, contactSection);
        
        // Add click handlers for suggestion buttons
        const suggestionButtons = suggestionsContainer.querySelectorAll('.suggestion-btn');
        suggestionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const searchTerm = this.getAttribute('data-search');
                searchInput.value = searchTerm;
                filterFAQsBySearch(searchTerm);
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }
    
    // Add print FAQ functionality
    const printButton = document.createElement('button');
    printButton.textContent = 'Print FAQ';
    printButton.className = 'btn btn-outline print-faq';
    printButton.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        z-index: 100;
        display: none;
    `;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printButton);
    
    // Show print button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            printButton.style.display = 'block';
        } else {
            printButton.style.display = 'none';
        }
    });
    
    // Global function for chat
    window.openChat = function() {
        // In a real application, this would integrate with a chat service
        alert('Chat feature coming soon! For now, please email us at support@puretreats.com');
    };
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Clear search
            if (searchInput.value) {
                searchInput.value = '';
                filterFAQsBySearch('');
            }
            
            // Close all FAQ items
            faqItems.forEach(item => {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                const toggle = item.querySelector('.faq-toggle');
                answer.style.maxHeight = null;
                toggle.textContent = '+';
            });
        }
    });
    
    // Add analytics tracking for popular FAQs
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Track FAQ clicks (in real app, send to analytics)
            const questionText = this.querySelector('h3').textContent;
            console.log('FAQ clicked:', questionText);
        });
    });
    
});

// Add CSS for FAQ functionality
const faqStyles = document.createElement('style');
faqStyles.textContent = `
    .faq-hero {
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
        color: var(--white);
        padding: 80px 0 60px;
        text-align: center;
    }
    
    .faq-hero-content h1 {
        color: var(--white);
        font-size: clamp(2.5rem, 5vw, 4rem);
        margin-bottom: var(--spacing-sm);
    }
    
    .faq-hero-content p {
        font-size: var(--font-size-large);
        color: rgba(255, 255, 255, 0.9);
        max-width: 600px;
        margin: 0 auto;
    }
    
    .faq-search {
        padding: 30px 0;
        background-color: var(--background-alt);
    }
    
    .search-container {
        position: relative;
        max-width: 500px;
        margin: 0 auto;
    }
    
    #faq-search {
        width: 100%;
        padding: 15px 50px 15px 20px;
        border: 2px solid var(--border);
        border-radius: 50px;
        font-size: var(--font-size-base);
        background: var(--white);
        transition: var(--transition);
    }
    
    #faq-search:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
    }
    
    .search-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-light);
    }
    
    .faq-categories {
        padding: 30px 0;
        border-bottom: 1px solid var(--border);
    }
    
    .category-nav {
        display: flex;
        gap: var(--spacing-sm);
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .category-btn {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 2px solid var(--primary-color);
        background-color: transparent;
        color: var(--primary-color);
        border-radius: 25px;
        cursor: pointer;
        transition: var(--transition);
        font-size: var(--font-size-small);
        font-weight: 500;
    }
    
    .category-btn:hover,
    .category-btn.active {
        background-color: var(--primary-color);
        color: var(--white);
    }
    
    .faq-content {
        padding: var(--spacing-xxl) 0;
    }
    
    .faq-grid {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    .faq-item {
        background-color: var(--white);
        border: 1px solid var(--border);
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: var(--transition);
    }
    
    .faq-item:hover {
        box-shadow: var(--box-shadow);
    }
    
    .faq-question {
        padding: var(--spacing-lg);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: var(--transition);
    }
    
    .faq-question:hover {
        background-color: var(--background-alt);
    }
    
    .faq-question h3 {
        margin: 0;
        font-size: var(--font-size-large);
        font-weight: 600;
    }
    
    .faq-toggle {
        font-size: 24px;
        font-weight: bold;
        color: var(--primary-color);
        min-width: 30px;
        text-align: center;
        transition: var(--transition);
    }
    
    .faq-answer {
        padding: 0 var(--spacing-lg) var(--spacing-lg);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .faq-answer p {
        margin-bottom: var(--spacing-sm);
        line-height: 1.6;
    }
    
    .faq-answer ul {
        margin: var(--spacing-sm) 0;
        padding-left: 20px;
    }
    
    .faq-answer li {
        margin-bottom: var(--spacing-xs);
    }
    
    .faq-answer strong {
        color: var(--primary-color);
    }
    
    .contact-section {
        background-color: var(--background-alt);
        padding: var(--spacing-xxl);
        border-radius: var(--border-radius);
        margin-top: var(--spacing-xxl);
    }
    
    .contact-content h2 {
        text-align: center;
        margin-bottom: var(--spacing-sm);
    }
    
    .contact-content p {
        text-align: center;
        margin-bottom: var(--spacing-xl);
        color: var(--text-secondary);
    }
    
    .contact-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg);
    }
    
    .contact-option {
        background-color: var(--white);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius);
        text-align: center;
        box-shadow: var(--box-shadow);
    }
    
    .contact-option h3 {
        margin-bottom: var(--spacing-sm);
        font-size: var(--font-size-base);
    }
    
    .contact-option p {
        margin-bottom: var(--spacing-md);
        font-size: var(--font-size-small);
    }
    
    .suggestion-btn {
        background: var(--white);
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: var(--font-size-small);
        transition: var(--transition);
    }
    
    .suggestion-btn:hover {
        background: var(--primary-color);
        color: var(--white);
    }
    
    mark {
        background-color: var(--accent-color);
        color: var(--white);
        padding: 2px 4px;
        border-radius: 3px;
    }
    
    @media (max-width: 768px) {
        .category-nav {
            flex-direction: column;
            align-items: center;
        }
        
        .category-btn {
            width: 200px;
        }
        
        .contact-options {
            grid-template-columns: 1fr;
        }
        
        .faq-question {
            padding: var(--spacing-md);
        }
        
        .faq-question h3 {
            font-size: var(--font-size-base);
        }
        
        .print-faq {
            display: none !important;
        }
    }
    
    @media print {
        .header, .faq-hero, .faq-search, .faq-categories, .footer, .contact-section {
            display: none !important;
        }
        
        .faq-item {
            break-inside: avoid;
            margin-bottom: 20px;
        }
        
        .faq-answer {
            max-height: none !important;
        }
    }
`;

document.head.appendChild(faqStyles);