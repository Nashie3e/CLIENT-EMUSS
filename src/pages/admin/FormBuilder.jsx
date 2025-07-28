import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'File Upload' },
];

const FormBuilder = () => {
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState({
    id: null,
    category: '',
    name: '',
    description: '',
    fields: []
  });
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchForms();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/settings/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.categories) {
        setCategories(response.data.categories);
      } else {
        setError('Invalid category data received');
      }
    } catch (error) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    }
  };

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/forms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.forms) {
        const processedForms = response.data.forms.map(form => ({
          ...form,
          fields: form.fields || []
        }));
        setForms(processedForms);
      } else {
        setError('Invalid form data received');
      }
    } catch (error) {
      setError('Failed to fetch forms');
      console.error('Error fetching forms:', error);
    }
  };

  const handleAddField = () => {
    const newField = {
      id: Date.now().toString(),
      type: 'text',
      label: '',
      required: false,
      options: [],
      placeholder: '',
      validation: {
        required: false,
        minLength: 0,
        maxLength: 100,
        pattern: ''
      }
    };
    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const handleFieldChange = (fieldId, property, value) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, [property]: value } : field
      )
    }));
  };

  const handleRemoveField = (fieldId) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const fields = Array.from(currentForm.fields);
    const [reorderedField] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, reorderedField);

    setCurrentForm(prev => ({
      ...prev,
      fields
    }));
  };

  const handleSaveForm = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = currentForm.id ? 'put' : 'post';
      const url = currentForm.id 
        ? `${API_BASE_URL}/admin/forms/${currentForm.id}`
        : `${API_BASE_URL}/admin/forms`;

      await axios[method](url, currentForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Form saved successfully');
      fetchForms();
      setShowForm(false);
    } catch (error) {
      setError('Failed to save form');
    }
  };

  const handleEditForm = (form) => {
    setCurrentForm(form);
    setShowForm(true);
  };

  const handleDeleteForm = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/forms/${formId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchForms();
      setSuccess('Form deleted successfully');
    } catch (error) {
      setError('Failed to delete form');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Form Builder</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentForm({
              id: null,
              category: '',
              name: '',
              description: '',
              fields: []
            });
            setShowForm(true);
          }}
        >
          Create New Form
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>
      )}

      {!showForm ? (
        <Grid container spacing={3}>
          {forms.map(form => (
            <Grid item xs={12} md={6} key={form.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{form.name || 'Untitled Form'}</Typography>
                    <Box>
                      <IconButton onClick={() => handleEditForm(form)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteForm(form.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    Category: {form.category ? form.category.replace(/_/g, ' ') : 'Uncategorized'}
                  </Typography>
                  <Typography variant="body2">
                    {form.description || 'No description'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Fields: {(form.fields || []).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {forms.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center">
                No forms available. Click "Create New Form" to add one.
              </Typography>
            </Grid>
          )}
        </Grid>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={currentForm.category}
                    onChange={(e) => setCurrentForm(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name.replace(/_/g, ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Form Name"
                  value={currentForm.name}
                  onChange={(e) => setCurrentForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={currentForm.description}
                  onChange={(e) => setCurrentForm(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </Grid>
            </Grid>
          </Box>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {currentForm.fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{ p: 2, mb: 2 }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box {...provided.dragHandleProps}>
                              <DragIndicatorIcon />
                            </Box>
                            <Grid container spacing={2} sx={{ ml: 1 }}>
                              <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                  <InputLabel>Field Type</InputLabel>
                                  <Select
                                    value={field.type}
                                    onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                                  >
                                    {FIELD_TYPES.map(type => (
                                      <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="Field Label"
                                  value={field.label}
                                  onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={field.required}
                                      onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                                    />
                                  }
                                  label="Required"
                                />
                              </Grid>
                              <Grid item xs={12} md={1}>
                                <IconButton onClick={() => handleRemoveField(field.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                              {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Options (comma-separated)"
                                    value={field.options.join(',')}
                                    onChange={(e) => handleFieldChange(field.id, 'options', e.target.value.split(','))}
                                  />
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddField}
            >
              Add Field
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveForm}
            >
              Save Form
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default FormBuilder; 