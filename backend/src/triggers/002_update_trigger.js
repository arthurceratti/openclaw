// Update Trigger - Called when records are updated
// Validates data integrity on updates
db.on('after update', {
  table: 'users',
  action: 'validate',
  check: function (row) {
    // Check for duplicate email if email was changed
    const query = 'SELECT COUNT(*) FROM users WHERE email = ? AND id <> ?';
    const result = db.query(query, [row.email, row.id]);
    
    if (result.count > 0) {
      throw new Error('Email already exists for another user');
    }
    
    // Validate foreign key relationships
    if (row.department_id !== null) {
      const deptCheck = 'SELECT COUNT(*) FROM departments WHERE id = ?';
      const deptResult = db.query(deptCheck, [row.department_id]);
      if (deptResult.count === 0) {
        throw new Error('Invalid department_id');
      }
    }
  }
});

// Update trigger for products table
db.on('after update', {
  table: 'products',
  action: 'validate',
  check: function (row) {
    // Check for duplicate name if name was changed
    const query = 'SELECT COUNT(*) FROM products WHERE name = ? AND id <> ?';
    const result = db.query(query, [row.name, row.id]);
    
    if (result.count > 0) {
      throw new Error('Product name already exists for another product');
    }
    
    // Validate category_id if changed
    if (row.category_id !== null) {
      const categoryCheck = 'SELECT COUNT(*) FROM categories WHERE id = ?';
      const categoryResult = db.query(categoryCheck, [row.category_id]);
      if (categoryResult.count === 0) {
        throw new Error('Invalid category_id');
      }
    }
  }
});
