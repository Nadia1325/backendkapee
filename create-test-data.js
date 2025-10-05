const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function createTestData() {
  try {
    console.log('🚀 Creating test data for KAPEE Ecommerce...');

    // 1. Create test user
    console.log('\n📝 Creating test user...');
    try {
      const userResponse = await axios.post(`${API_BASE}/auth/register`, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Test user created:', userResponse.data.user.email);
      
      // Save token for product creation
      const token = userResponse.data.token;
      
      // 2. Create test products
      console.log('\n📦 Creating test products...');
      
      const products = [
        {
          name: 'Wireless Bluetooth Headphones',
          price: 89.99,
          description: 'High-quality wireless headphones with noise cancellation',
          image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'
        },
        {
          name: 'Smart Phone 128GB',
          price: 599.99,
          description: 'Latest smartphone with advanced camera and fast processor',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
        },
        {
          name: 'Laptop Stand',
          price: 49.99,
          description: 'Adjustable aluminum laptop stand for better ergonomics',
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
        },
        {
          name: 'Wireless Charging Pad',
          price: 29.99,
          description: 'Fast wireless charging pad compatible with all devices',
          image: 'https://images.unsplash.com/photo-1609091843889-9aae50c49dd0?w=400'
        }
      ];

      for (const product of products) {
        try {
          // Create form data
          const formData = new FormData();
          formData.append('name', product.name);
          formData.append('price', product.price.toString());
          formData.append('description', product.description);
          formData.append('image', product.image);

          const productResponse = await axios.post(`${API_BASE}/products/create`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log(`✅ Product created: ${product.name} (ID: ${productResponse.data._id})`);
        } catch (productError) {
          console.log(`❌ Failed to create product ${product.name}:`, productError.response?.data?.message || productError.message);
        }
      }

    } catch (userError) {
      if (userError.response?.data?.message?.includes('already exists')) {
        console.log('✅ Test user already exists');
      } else {
        console.log('❌ Failed to create user:', userError.response?.data?.message || userError.message);
      }
    }

    // 3. List all products to verify
    console.log('\n📋 Listing all products...');
    const listResponse = await axios.get(`${API_BASE}/products`);
    console.log(`✅ Total products: ${listResponse.data.length}`);
    
    listResponse.data.forEach(product => {
      console.log(`  - ${product.name} ($${product.price}) - ID: ${product._id}`);
    });

    console.log('\n🎉 Test data creation completed!');
    console.log('\n📝 Test credentials:');
    console.log('  Email: test@example.com');
    console.log('  Password: password123');
    console.log('\n🌐 Frontend: http://localhost:5174');
    console.log('🔧 API Docs: http://localhost:5000/api-docs');

  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
  }
}

// Run the script
createTestData();