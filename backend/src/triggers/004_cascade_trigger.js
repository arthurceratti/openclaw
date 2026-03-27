// Cascade Trigger - Handles cascade operations
// Manages related data when parent records are modified

// Cascade delete for users - deletes their orders and order items
db.on('before delete', {
  table: 'users',
  action: 'cascade',
  check: function (id) {
    // Delete related orders first
    const deleteOrders = 'DELETE FROM orders WHERE user_id = ?';
    db.query(deleteOrders, [id]);
    
    // Then delete related order items
    const deleteOrderItems = 'DELETE FROM order_items WHERE user_id = ?';
    db.query(deleteOrderItems, [id]);
    
    // Finally delete the user
    const deleteUser = 'DELETE FROM users WHERE id = ?';
    db.query(deleteUser, [id]);
  }
});

// Cascade delete for products - deletes their order items
db.on('before delete', {
  table: 'products',
  action: 'cascade',
  check: function (id) {
    // Delete related order items first
    const deleteOrderItems = 'DELETE FROM order_items WHERE product_id = ?';
    db.query(deleteOrderItems, [id]);
    
    // Then delete the product
    const deleteProduct = 'DELETE FROM products WHERE id = ?';
    db.query(deleteProduct, [id]);
  }
});

// Cascade update for department - updates all users in that department
db.on('after update', {
  table: 'departments',
  action: 'cascade',
  check: function (id) {
    const deptName = 'SELECT name FROM departments WHERE id = ?';
    const result = db.query(deptName, [id]);
    const newDeptName = result.name;
    
    if (newDeptName) {
      // Update all users in this department
      const updateUsers = 'UPDATE users SET department_name = ? WHERE department_id = ?';
      db.query(updateUsers, [newDeptName, id]);
    }
  }
});

// Cascade update for category - updates all products in that category
db.on('after update', {
  table: 'categories',
  action: 'cascade',
  check: function (id) {
    const categoryName = 'SELECT name FROM categories WHERE id = ?';
    const result = db.query(categoryName, [id]);
    const newCategoryName = result.name;
    
    if (newCategoryName) {
      // Update all products in this category
      const updateProducts = 'UPDATE products SET category_name = ? WHERE category_id = ?';
      db.query(updateProducts, [newCategoryName, id]);
    }
  }
});
