// Catalog-specific JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Product filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            filterProducts(filter);
        });
    });
    
    function filterProducts(filter) {
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update product count
        updateProductCount(filter);
    }
    
    function updateProductCount(filter) {
        const totalProducts = productCards.length;
        let visibleProducts = totalProducts;
        
        if (filter !== 'all') {
            visibleProducts = document.querySelectorAll(`[data-category="${filter}"]`).length;
        }
        
        // Add or update product count display
        let countDisplay = document.querySelector('.product-count');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.className = 'product-count';
            countDisplay.style.cssText = `
                text-align: center;
                margin: 20px 0;
                color: var(--text-secondary);
                font-size: var(--font-size-small);
            `;
            
            const container = document.querySelector('.products-catalog .container');
            container.insertBefore(countDisplay, container.querySelector('.products-grid'));
        }
        
        countDisplay.textContent = `Showing ${visibleProducts} of ${totalProducts} products`;
    }
    
    // Initialize product count
    updateProductCount('all');
    
    // Add sorting functionality
    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-container';
    sortContainer.innerHTML = `
        <label for="sort-select">Sort by:</label>
        <select id="sort-select" class="sort-select">
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
        </select>
    `;
    
    // Add CSS for sort container
    sortContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
        justify-content: flex-end;
    `;
    
    const sortSelect = sortContainer.querySelector('#sort-select');
    sortSelect.style.cssText = `
        padding: 8px 12px;
        border: 2px solid var(--border);
        border-radius: var(--border-radius);
        background: var(--white);
        color: var(--text-primary);
        font-size: var(--font-size-small);
        cursor: pointer;
    `;
    
    // Insert sort container
    const filterSection = document.querySelector('.filter-container');
    filterSection.appendChild(sortContainer);
    
    // Sort functionality
    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        sortProducts(sortBy);
    });
    
    function sortProducts(sortBy) {
        const productsGrid = document.querySelector('.products-grid');
        const products = Array.from(productCards);
        
        products.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    const nameA = a.querySelector('h3').textContent;
                    const nameB = b.querySelector('h3').textContent;
                    return nameA.localeCompare(nameB);
                
                case 'price-low':
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                    return priceA - priceB;
                
                case 'price-high':
                    const priceC = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                    const priceD = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                    return priceD - priceC;
                
                default:
                    return 0;
            }
        });
        
        // Re-append sorted products
        products.forEach(product => {
            productsGrid.appendChild(product);
        });
        
        // Animate the reordering
        products.forEach((product, index) => {
            product.style.animation = `slideIn 0.3s ease ${index * 0.05}s both`;
        });
    }
    
    // Add CSS animation for sorting
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .page-header {
            background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
            color: var(--white);
            padding: 60px 0;
            text-align: center;
        }
        
        .page-header-content h1 {
            color: var(--white);
            font-size: clamp(2rem, 4vw, 3rem);
            margin-bottom: var(--spacing-sm);
        }
        
        .page-header-content p {
            font-size: var(--font-size-large);
            color: rgba(255, 255, 255, 0.9);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .filter-section {
            padding: var(--spacing-xl) 0;
            background-color: var(--background-alt);
        }
        
        .filter-container h3 {
            margin-bottom: var(--spacing-md);
            text-align: center;
        }
        
        .filter-options {
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-sm);
            justify-content: center;
            margin-bottom: var(--spacing-md);
        }
        
        .filter-btn {
            padding: var(--spacing-sm) var(--spacing-md);
            border: 2px solid var(--primary-color);
            background-color: transparent;
            color: var(--primary-color);
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: var(--transition);
            font-size: var(--font-size-small);
            font-weight: 500;
        }
        
        .filter-btn:hover,
        .filter-btn.active {
            background-color: var(--primary-color);
            color: var(--white);
        }
        
        .products-catalog {
            padding: var(--spacing-xl) 0;
        }
        
        .benefit-tag {
            display: inline-block;
            background-color: var(--secondary-color);
            color: var(--primary-color);
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            margin: 2px;
        }
        
        .product-benefits {
            margin: var(--spacing-sm) 0;
        }
        
        .product-price {
            font-size: var(--font-size-large);
            font-weight: 600;
            color: var(--primary-color);
            margin: var(--spacing-sm) 0;
        }
        
        .load-more-section {
            text-align: center;
            margin-top: var(--spacing-xxl);
            padding: var(--spacing-xl);
            background-color: var(--background-alt);
            border-radius: var(--border-radius);
        }
        
        .load-more-section p {
            margin-bottom: var(--spacing-md);
            font-size: var(--font-size-large);
        }
        
        @media (max-width: 768px) {
            .filter-options {
                flex-direction: column;
                align-items: center;
            }
            
            .filter-btn {
                width: 200px;
            }
            
            .sort-container {
                justify-content: center !important;
                flex-direction: column;
                gap: 5px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add product comparison feature
    let comparisonList = [];
    const maxComparisons = 3;
    
    function addComparisonButton() {
        productCards.forEach(card => {
            const compareBtn = document.createElement('button');
            compareBtn.className = 'btn-compare';
            compareBtn.textContent = 'Compare';
            compareBtn.style.cssText = `
                background: var(--secondary-color);
                color: var(--primary-color);
                border: none;
                padding: 6px 12px;
                border-radius: var(--border-radius);
                font-size: 12px;
                cursor: pointer;
                margin-top: var(--spacing-xs);
                transition: var(--transition);
            `;
            
            compareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleComparison(card, compareBtn);
            });
            
            card.querySelector('.product-info').appendChild(compareBtn);
        });
    }
    
    function toggleComparison(card, button) {
        const productName = card.querySelector('h3').textContent;
        const index = comparisonList.findIndex(item => item.name === productName);
        
        if (index > -1) {
            // Remove from comparison
            comparisonList.splice(index, 1);
            button.textContent = 'Compare';
            button.style.background = 'var(--secondary-color)';
            card.classList.remove('in-comparison');
        } else {
            // Add to comparison
            if (comparisonList.length >= maxComparisons) {
                alert(`You can only compare up to ${maxComparisons} products at once.`);
                return;
            }
            
            comparisonList.push({
                name: productName,
                price: card.querySelector('.product-price').textContent,
                benefits: Array.from(card.querySelectorAll('.benefit-tag')).map(tag => tag.textContent)
            });
            
            button.textContent = 'Added';
            button.style.background = 'var(--primary-color)';
            button.style.color = 'var(--white)';
            card.classList.add('in-comparison');
        }
        
        updateComparisonBar();
    }
    
    function updateComparisonBar() {
        let comparisonBar = document.querySelector('.comparison-bar');
        
        if (comparisonList.length === 0) {
            if (comparisonBar) {
                comparisonBar.remove();
            }
            return;
        }
        
        if (!comparisonBar) {
            comparisonBar = document.createElement('div');
            comparisonBar.className = 'comparison-bar';
            comparisonBar.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--primary-color);
                color: var(--white);
                padding: var(--spacing-md);
                z-index: 1000;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
            `;
            document.body.appendChild(comparisonBar);
        }
        
        comparisonBar.innerHTML = `
            <span>Comparing ${comparisonList.length} product${comparisonList.length > 1 ? 's' : ''}</span>
            <div>
                <button class="btn btn-secondary" onclick="showComparison()" style="margin-right: 10px;">Compare Now</button>
                <button class="btn btn-outline" onclick="clearComparison()">Clear All</button>
            </div>
        `;
    }
    
    // Initialize comparison buttons
    addComparisonButton();
    
    // Global functions for comparison
    window.showComparison = function() {
        if (comparisonList.length < 2) {
            alert('Please select at least 2 products to compare.');
            return;
        }
        
        // Create comparison modal
        const modal = document.createElement('div');
        modal.className = 'modal comparison-modal';
        modal.style.display = 'block';
        
        let comparisonHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>Product Comparison</h2>
                <div class="comparison-grid" style="display: grid; grid-template-columns: repeat(${comparisonList.length}, 1fr); gap: 20px; margin-top: 20px;">
        `;
        
        comparisonList.forEach(product => {
            comparisonHTML += `
                <div class="comparison-item" style="text-align: center; padding: 20px; border: 1px solid var(--border); border-radius: var(--border-radius);">
                    <h3>${product.name}</h3>
                    <div class="price" style="font-size: var(--font-size-large); color: var(--primary-color); margin: 10px 0;">${product.price}</div>
                    <div class="benefits" style="margin-top: 15px;">
                        <h4 style="font-size: 14px; margin-bottom: 10px;">Benefits:</h4>
                        ${product.benefits.map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                    </div>
                </div>
            `;
        });
        
        comparisonHTML += `
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-primary" onclick="clearComparison(); this.closest('.modal').remove();">Close Comparison</button>
                </div>
            </div>
        `;
        
        modal.innerHTML = comparisonHTML;
        document.body.appendChild(modal);
    };
    
    window.clearComparison = function() {
        comparisonList = [];
        document.querySelectorAll('.btn-compare').forEach(btn => {
            btn.textContent = 'Compare';
            btn.style.background = 'var(--secondary-color)';
            btn.style.color = 'var(--primary-color)';
        });
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('in-comparison');
        });
        updateComparisonBar();
    };
    
    // Add search functionality
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="product-search" placeholder="Search products..." style="
            width: 100%;
            max-width: 300px;
            padding: 12px;
            border: 2px solid var(--border);
            border-radius: var(--border-radius);
            font-size: var(--font-size-base);
            margin-bottom: 20px;
        ">
    `;
    
    const filterContainer = document.querySelector('.filter-container');
    filterContainer.insertBefore(searchContainer, filterContainer.firstChild);
    
    const searchInput = document.getElementById('product-search');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterBySearch(searchTerm);
    });
    
    function filterBySearch(searchTerm) {
        productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const benefits = Array.from(card.querySelectorAll('.benefit-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const matches = title.includes(searchTerm) || description.includes(searchTerm) || benefits.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update product count based on search
        const visibleProducts = Array.from(productCards).filter(card => card.style.display !== 'none').length;
        const countDisplay = document.querySelector('.product-count');
        if (countDisplay) {
            if (searchTerm) {
                countDisplay.textContent = `Found ${visibleProducts} products matching "${searchTerm}"`;
            } else {
                countDisplay.textContent = `Showing ${visibleProducts} of ${productCards.length} products`;
            }
        }
    }
});