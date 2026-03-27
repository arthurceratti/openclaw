// Delete Trigger - Called when records are deleted
// Performs cleanup and validation on delete
db.on('before delete', {
  table: 'users',
  action: 'validate',
  check: function (id) {
    // Check if user has pending orders
    const query = 'SELECT COUNT(*) FROM orders WHERE user_id = ? AND status = ?';
    const result = db.query(query, [id, 'pending']);
    
    if (result.count > 0) {
      throw new Error('Cannot delete user with pending orders');
    }
  }
});

// Delete trigger for products table
db.on('before delete', {
  table: 'products',
  action: 'validate',
  check: function (id) {
    // Check if product has active orders
    const query = 'SELECT COUNT(*) FROM orders WHERE product_id = ? AND status = ?';
    const result = db.query(query, [id, 'active']);
    
    if (result.count > 0) {
      throw new Error('Cannot delete product with active orders');
    }
  }
});

// Cleanup trigger after delete
db.on('after delete', {
  table: 'users',
  action: 'cleanup',
  check: function (id) {
    // Clean up any orphaned foreign key references if needed
    const query = 'UPDATE order_items SET user_id = NULL WHERE user_id = ?';
    db.query(query, [id]);
  }
});

// Cleanup trigger after delete for products
db.on('after delete', {
  table: 'products',
  action: 'cleanup',
  check: function (id) {
    // Clean up any orphaned foreign key references if needed
    const query = 'UPDATE order_items SET product_id = NULL WHERE product_id = ?';
    db.query(query, [id]);
  }
});
