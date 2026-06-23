document.addEventListener('DOMContentLoaded', function () {

    //Flavor checkbox list
    const availableFlavors = [
        'Chocolate',
        'Vanilla',
        'Strawberry',
        'Fruit Punch',
        'Blue Raspberry',
        'Mango',
        'Unflavored'
    ];

    // Build checkboxes dynamically
    const flavorContainer = document.getElementById('flavor-checkboxes');
    availableFlavors.forEach(function (flavor) {
        var id = 'flavor-' + flavor.toLowerCase().replace(/\s+/g, '-');

        var label = document.createElement('label');
        label.className = 'flavor-label';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'flavor-cb';
        checkbox.value = flavor;
        checkbox.id = id;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + flavor));

        flavorContainer.appendChild(label);
    });


    //Form submit
    var form = document.getElementById('edit-order-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Form submitted');

        var name = document.getElementById('input-product').value.trim();
        var price = document.getElementById('input-price').value.trim();
        var brand = document.getElementById('input-brand').value.trim();
        var stock = document.getElementById('input-stock').value.trim();

        console.log('Name:', name);

        var images = [
            document.getElementById('input-firstimg').value.trim(),
            document.getElementById('input-secondimg').value.trim(),
            document.getElementById('input-thirdimg').value.trim()
        ].filter(function (img) { return img !== ''; });

        // Collect checked flavors
        var flavors = [];
        document.querySelectorAll('.flavor-cb:checked').forEach(function (cb) {
            flavors.push(cb.value);
        });

        console.log('Images:', images);
        console.log('Flavors:', flavors);

        //  front-end validation
        if (!name || !price || !brand || !stock) {
            showMessage('error', 'Please fill in Name, Price, Brand and Stock.');
            return;
        }

        if (images.length === 0) {
            showMessage('error', 'Please enter at least one image path.');
            return;
        }

        // Build POST data
        var postData = {
            name: name,
            price: price,
            brand: brand,
            stock: stock,
            flavors: flavors,
            images: images
        };

        // Disable button while submitting
        var btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Adding...';

        fetch('http://localhost/Combat Fitness/Admin Panel/PHP/add_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(function (response) {
                // Convert the response into JSON first so we can get the error message even if the request fails.
                return response.json()
                    .catch(function () {
                        
                        throw new Error('Request failed.');
                    })
                    .then(function (data) {
                        if (!response.ok) {
                            // The server sent back an error response.
                            throw new Error(data.error || 'Request failed.');
                        }
                        return data;
                    });
            })
            .then(function (data) {
                if (data.success) {
                    showMessage('success', 'Product added successfully! (ID: ' + data.product_id + ')');
                    resetForm();
                } else {
                    showMessage('error', data.error || 'Something went wrong.');
                }
            })
            .catch(function (err) {
                showMessage('error', err.message || 'Request failed.');
            })
            .finally(function () {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Add Product';
            });
    });


    //Cancel button
    document.getElementById('cancel-btn-bottom').addEventListener('click', function () {
        resetForm();
    });


    //Helpers
    function resetForm() {
        ['input-product', 'input-price', 'input-brand', 'input-stock',
            'input-firstimg', 'input-secondimg', 'input-thirdimg'].forEach(function (id) {
                document.getElementById(id).value = '';
            });

        document.querySelectorAll('.flavor-cb').forEach(function (cb) {
            cb.checked = false;
        });

        var existingMsg = document.getElementById('form-message');
        if (existingMsg) existingMsg.remove();
    }

    function showMessage(type, text) {
        var existingMsg = document.getElementById('form-message');
        if (existingMsg) existingMsg.remove();

        var color = type === 'success' ? '#2ecc71' : '#e74c3c';
        var icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';

        var msgDiv = document.createElement('div');
        msgDiv.id = 'form-message';
        msgDiv.style.margin = '16px 0';
        msgDiv.style.padding = '12px 16px';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.background = color + '20';
        msgDiv.style.border = '1px solid ' + color;
        msgDiv.style.color = color;
        msgDiv.style.display = 'flex';
        msgDiv.style.alignItems = 'center';
        msgDiv.style.gap = '10px';
        msgDiv.style.fontWeight = '500';
        msgDiv.innerHTML = '<i class="fa-solid ' + icon + '"></i>' + text;

        var bottomActions = document.querySelector('.bottom-actions');
        bottomActions.parentNode.insertBefore(msgDiv, bottomActions);

        var targetY = msgDiv.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
    }

});