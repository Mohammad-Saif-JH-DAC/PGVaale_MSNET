import React, { useState, useEffect } from 'react';
import api from '../api';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    menuDate: '',
    foodCategory: 'Veg',
    price: 0
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    try {
      const res = await api.get('/api/tiffin/menu');
      setMenus(res.data);
    } catch (err) {
      alert('Error fetching menu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingMenu) {
        await api.put(`/api/tiffin/menu/${editingMenu.id}`, formData);
      } else {
        await api.post('/api/tiffin/menu', formData);
      }
      resetForm();
      fetchMenus();
    } catch (err) {
      alert('Error saving menu: ' + err.message);
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({ ...menu });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this menu item?')) {
      await api.delete(`/api/tiffin/menu/${id}`);
      fetchMenus();
    }
  };

  const resetForm = () => {
    setFormData({ dayOfWeek: '', breakfast: '', lunch: '', dinner: '', menuDate: '', foodCategory: 'Veg', price: 0 });
    setEditingMenu(null);
    setShowForm(false);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status" /></div>;

  return (
    <div className="container mt-4">
      <h2>🍽️ Menu Management</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>+ Add Menu Item</button>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Day of Week</label>
                  <select className="form-select" name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} required>
                    <option value="">Select Day</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Menu Date (Optional)</label>
                  <input type="date" className="form-control" name="menuDate" value={formData.menuDate} onChange={handleInputChange} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Breakfast</label>
                  <textarea className="form-control" name="breakfast" rows="2" value={formData.breakfast} onChange={handleInputChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Lunch</label>
                  <textarea className="form-control" name="lunch" rows="2" value={formData.lunch} onChange={handleInputChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Dinner</label>
                  <textarea className="form-control" name="dinner" rows="2" value={formData.dinner} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Category</label>
                  <select className="form-select" name="foodCategory" value={formData.foodCategory} onChange={handleInputChange} required>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Price per Meal</label>
                  <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" required />
                </div>
              </div>
              <div className="text-end">
                <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-success">{editingMenu ? 'Update' : 'Save'} Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr><th>Day</th><th>Category</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Price</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {menus.map(menu => (
                  <tr key={menu.id}>
                    <td>{menu.dayOfWeek}</td>
                    <td><span className={`badge bg-${menu.foodCategory === 'Veg' ? 'success' : menu.foodCategory === 'Non-Veg' ? 'danger' : 'warning'}`}>{menu.foodCategory}</span></td>
                    <td><small>{menu.breakfast}</small></td>
                    <td><small>{menu.lunch}</small></td>
                    <td><small>{menu.dinner}</small></td>
                    <td>₹{menu.price}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(menu)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(menu.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
