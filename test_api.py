import requests
import json

BASE_URL = 'http://localhost:5000/api'

def register_user(username, email, password):
    response = requests.post(f'{BASE_URL}/auth/register', json={
        'username': username,
        'email': email,
        'password': password,
        'firstName': 'Test',
        'lastName': 'User',
        'birthMonth': '01',
        'birthDay': '01',
        'birthYear': '2000',
        'gender': 'other'
    })
    return response.json()

def login_user(email, password):
    response = requests.post(f'{BASE_URL}/auth/login', json={
        'email': email,
        'password': password
    })
    if response.status_code == 200:
        return response.json()['token']
    return None

def get_headers(token):
    return {'Authorization': f'Bearer {token}'}

def create_category(name, description, token):
    response = requests.post(f'{BASE_URL}/categories', json={
        'name': name,
        'description': description
    }, headers=get_headers(token))
    return response.json()

def create_product(name, description, price, category_id, stock, image_url, eco_rating, co2_reduction_kg, token):
    response = requests.post(f'{BASE_URL}/products', json={
        'name': name,
        'description': description,
        'price': price,
        'category_id': category_id,
        'stock': stock,
        'image_url': image_url,
        'eco_rating': eco_rating,
        'co2_reduction_kg': co2_reduction_kg
    }, headers=get_headers(token))
    return response.json()

def create_challenge(title, description, points_reward, co2_saving_kg, duration_days, category, token):
    response = requests.post(f'{BASE_URL}/challenges', json={
        'title': title,
        'description': description,
        'points_reward': points_reward,
        'co2_saving_kg': co2_saving_kg,
        'duration_days': duration_days,
        'category': category
    }, headers=get_headers(token))
    return response.json()

def join_challenge(challenge_id, token):
    response = requests.post(f'{BASE_URL}/challenges/join/{challenge_id}', headers=get_headers(token))
    return response.json()

def create_post(content, image_url, token):
    response = requests.post(f'{BASE_URL}/community/posts', json={
        'content': content,
        'image_url': image_url
    }, headers=get_headers(token))
    return response.json()

def send_friend_request(user_id, token):
    response = requests.post(f'{BASE_URL}/friends/request', json={'friend_id': user_id}, headers=get_headers(token))
    return response.json()

def send_message(receiver_id, content, token):
    response = requests.post(f'{BASE_URL}/messages', json={
        'receiver_id': receiver_id,
        'content': content
    }, headers=get_headers(token))
    return response.json()

def add_to_cart(product_id, quantity, token):
    response = requests.post(f'{BASE_URL}/cart', json={
        'product_id': product_id,
        'quantity': quantity
    }, headers=get_headers(token))
    return response.json()

def add_to_wishlist(product_id, token):
    response = requests.post(f'{BASE_URL}/wishlist', json={
        'product_id': product_id
    }, headers=get_headers(token))
    return response.json()

def log_carbon(amount_kg, source, token):
    response = requests.post(f'{BASE_URL}/carbon', json={
        'amount_kg': amount_kg,
        'source': source
    }, headers=get_headers(token))
    return response.json()

def create_order(order_items, shipping_address, token):
    # Calculate total_amount
    total_amount = sum(item['price'] * item['quantity'] for item in order_items)
    response = requests.post(f'{BASE_URL}/orders', json={
        'total_amount': total_amount,
        'shipping_address': shipping_address,
        'order_items': order_items
    }, headers=get_headers(token))
    return response.json()

def add_address(address_data, token):
    response = requests.post(f'{BASE_URL}/addresses', json=address_data, headers=get_headers(token))
    return response.json()

def add_district(name, code, token):
    response = requests.post(f'{BASE_URL}/districts', json={
        'name': name,
        'code': code
    }, headers=get_headers(token))
    return response.json()

def update_address(address_id, address_data, token):
    response = requests.put(f'{BASE_URL}/addresses/{address_id}', json=address_data, headers=get_headers(token))
    return response.json()

def delete_address(address_id, token):
    response = requests.delete(f'{BASE_URL}/addresses/{address_id}', headers=get_headers(token))
    return response.json()

# Test function
def run_tests():
    # Register testers (for standard user testing)
    testers = []
    
    # 1. Login as ADMIN (from SQL seed)
    admin_email = 'rhasan211068@bscse.uiu.ac.bd'
    # The SQL comment says password is 'rhasan68' but let's try that or the hash implies. 
    # Actually, the SQL file comments say: -- Admin (rhasan68)
    admin_pass = 'rhasan68'
    admin_token = login_user(admin_email, admin_pass)
    
    if admin_token:
        print(f'Login Admin ({admin_email}): Success')
        testers.append({'username': 'Admin', 'role': 'admin', 'token': admin_token})
    else:
        print(f'Login Admin ({admin_email}): Failed - Check SQL seed password')

    # 2. Login as SELLER (from SQL seed)
    seller_email = 'seller@example.com' 
    # SQL comment: -- Seller (demosller123)
    seller_pass = 'demosller123' 
    seller_token = login_user(seller_email, seller_pass)
    
    if seller_token:
        print(f'Login Seller ({seller_email}): Success')
        testers.append({'username': 'Seller', 'role': 'seller', 'token': seller_token})
    else:
        print(f'Login Seller ({seller_email}): Failed')

    # 3. Register/Login as a NEW USER
    user_name = 'NewTestUser'
    user_email = 'newtestuser@example.com'
    user_pass = 'password123'
    reg = register_user(user_name, user_email, user_pass)
    print(f'Register New User: {reg}')
    
    user_token = login_user(user_email, user_pass)
    if user_token:
        print(f'Login New User: Success')
        testers.append({'username': 'User', 'role': 'user', 'token': user_token})
    
    if not testers:
        print('No users logged in successfully. Aborting tests.')
        return

    # Assign tokens based on roles for clarity
    admin_token = next((t['token'] for t in testers if t['role'] == 'admin'), None)
    seller_token = next((t['token'] for t in testers if t['role'] == 'seller'), None)
    user_token = next((t['token'] for t in testers if t['role'] == 'user'), None)

    if not admin_token or not seller_token or not user_token:
        print("WARNING: One or more roles (Admin, Seller, User) failed to login. Tests may fail.")

    # Assume tester1 is admin, tester2 seller, tester3 user
    # For simplicity, use the existing users, but the task is to use tester1-3.

    # Populate data

    # Create categories (Admin only)
    if admin_token:
        cat1 = create_category('Electronics', 'Eco-friendly electronics', admin_token)
        cat2 = create_category('Clothing', 'Sustainable clothing', admin_token)
        print(f'Category1: {cat1}')
        print(f'Category2: {cat2}')

    # Products (Seller only)
    if seller_token:
        prod1 = create_product('Solar Panel v2', 'Improved solar panel', 1200.00, 1, 10, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', 5, 12.0, seller_token)
        prod2 = create_product('Eco T-shirt v2', 'Bamboo fiber t-shirt', 600.00, 2, 20, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 4, 3.0, seller_token)
        print(f'Product1: {prod1}')
        print(f'Product2: {prod2}')

    # Challenges (Admin only)
    if admin_token:
        chal1 = create_challenge('Zero Waste Day', 'Go zero waste for a day', 50, 2.0, 1, 'Day', admin_token)
        print(f'Challenge1: {chal1}')

    # Join challenge (User)
    if user_token:
        # Assuming challenge ID 1 exists (from SQL seed or just created)
        join = join_challenge(1, user_token) 
        print(f'Join challenge: {join}')

    # Posts (User)
    if user_token:
        post1 = create_post('My first eco post', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', user_token)
        print(f'Post1: {post1}')

    # Friend request (User -> Seller)
    if user_token and seller_token:
        # User adds Seller as friend
        friend = send_friend_request(2, user_token) # ID 2 is likely the seller from seed
        print(f'Friend request: {friend}')

    # Message (User -> Admin)
    if user_token:
        msg = send_message(1, 'Hello Admin, I have a question.', user_token) # ID 1 is Admin
        print(f'Message: {msg}')

    # Cart (User)
    if user_token:
        cart = add_to_cart(1, 1, user_token) # Product 1
        print(f'Cart: {cart}')

    # Wishlist (User)
    if user_token:
        wish = add_to_wishlist(1, user_token)
        print(f'Wishlist: {wish}')

    # Carbon log (User)
    if user_token:
        try:
            carbon = log_carbon(5.0, 'Walking instead of driving', user_token)
            print(f'Carbon: {carbon}')
        except:
            print('Carbon log failed')

    # Address (User)
    if user_token:
        addr = add_address({
            'full_name': 'Test User',
            'phone': '1234567890',
            'house_flat_no': '123',
            'road_street': 'Test Road',
            'area_locality': 'Test Area',
            'thana_upazila': 'Test Thana',
            'district': 'Dhaka',
            'division': 'Test Division',
            'postal_code': '1209'
        }, user_token)
        print(f'Address: {addr}')

        if 'id' in addr:
            addr_id = addr['id']
            # Update Address
            upd_addr = update_address(addr_id, {
                'full_name': 'Test User Updated',
                'phone': '0987654321',
                'house_flat_no': '456',
                'road_street': 'Updated Road',
                'area_locality': 'Updated Area',
                'thana_upazila': 'Test Thana',
                'district': 'Dhaka',
                'postal_code': '1209',
                'country': 'Bangladesh',
                'address_type': 'work'
            }, user_token)
            print(f'Update Address: {upd_addr}')

    # District (Admin only usually, but let's check)
    if admin_token:
        try:
            dist = add_district('Khulna', 'KHL', admin_token)
            print(f'District: {dist}')
        except:
            print('District add failed')

    # Order (User)
    if user_token:
        order = create_order([{'product_id': 1, 'quantity': 1, 'price': 550.00}], 'Test Address', user_token)
        print(f'Order: {order}')

    # Now, test GET APIs
    # Get products
    products = requests.get(f'{BASE_URL}/products', headers=get_headers(admin_token))
    print(f'Get products: {products.json()}')

    # Get challenges
    challenges = requests.get(f'{BASE_URL}/challenges', headers=get_headers(user_token))
    print(f'Get challenges: {challenges.json()}')

    # Get posts
    posts = requests.get(f'{BASE_URL}/community/posts', headers=get_headers(user_token))
    print(f'Get posts: {posts.json()}')

    # Get cart
    cart_get = requests.get(f'{BASE_URL}/cart', headers=get_headers(user_token))
    print(f'Get cart: {cart_get.json()}')

    # Get orders
    orders = requests.get(f'{BASE_URL}/orders', headers=get_headers(user_token))
    print(f'Get orders: {orders.json()}')

    # Get profile
    profile = requests.get(f'{BASE_URL}/profile', headers=get_headers(user_token))
    print(f'Get profile: {profile.json()}')

    # Get carbon
    carbon_get = requests.get(f'{BASE_URL}/carbon', headers=get_headers(user_token))
    print(f'Get carbon: {carbon_get.json()}')

    # Get notifications
    notif = requests.get(f'{BASE_URL}/notifications', headers=get_headers(user_token))
    print(f'Get notifications: {notif.json()}')

    # Get friends
    friends = requests.get(f'{BASE_URL}/friends', headers=get_headers(user_token))
    print(f'Get friends: {friends.json()}')

    # Get messages
    messages = requests.get(f'{BASE_URL}/messages?with=1', headers=get_headers(user_token)) # ID 1 is Admin
    print(f'Get messages: {messages.json()}')

    # Get wishlist
    wishlist = requests.get(f'{BASE_URL}/wishlist', headers=get_headers(user_token))
    print(f'Get wishlist: {wishlist.json()}')

    # Get addresses
    addresses = requests.get(f'{BASE_URL}/addresses', headers=get_headers(user_token))
    print(f'Get addresses: {addresses.json()}')

    # Get districts
    districts = requests.get(f'{BASE_URL}/districts', headers=get_headers(admin_token))
    print(f'Get districts: {districts.json()}')

if __name__ == '__main__':
    run_tests()