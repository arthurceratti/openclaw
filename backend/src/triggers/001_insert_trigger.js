// Insert Trigger - Called when new records are inserted
// Prevents duplicate entries and validates foreign keys
db.on('after insert', {
  table: 'users',
  action: 'validate',
  check: function (row) {
    // Check for duplicate email
    const query = 'SELECT COUNT(*) FROM users WHERE email = ?';
    const result = db.query(query, [row.email]);
    
    if (result.count > 0) {
      throw new Error('Email already exists');
    }
    
    // Validate foreign key relationships if applicable
    if (row.department_id) {
      const deptCheck = 'SELECT COUNT(*) FROM departments WHERE id = ?';
      const deptResult = db.query(deptCheck, [row.department_id]);
      if (deptResult.count === 0) {
        throw new Error('Invalid department_id');
      }
    }
  }
});

// Insert trigger for products table
db.on('after insert', {
  table: 'products',
  action: 'validate',
  check: function (row) {
    // Check for duplicate product name
    const query = 'SELECT COUNT(*) FROM products WHERE name = ?';
    const result = db.query(query, [row.name]);
    
    if (result.count > 0) {
      throw new Error('Product name already exists');
    }
    
    // Validate category_id if provided
    if (row.category_id) {
      const categoryCheck = 'SELECT COUNT(*) FROM categories WHERE id = ?';
      const categoryResult = db.query(categoryCheck, [row.category_id]);
      if (categoryResult.count === 0) {
        throw new Error('Invalid category_id');
      }
    }
  }
});
