import React, { useEffect } from 'react';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { EQUIPMENT_MODELS, EQUIPMENT_TYPES, PRIORITY_LEVELS } from '../constants';

const EquipmentSection = ({ 
  formData, 
  handleChange, 
  isSubmitting 
}) => {
  // Get available models based on selected equipment type
  const getAvailableModels = () => {
    if (!formData.typeOfEquipment || formData.typeOfEquipment === EQUIPMENT_TYPES.OTHERS) {
      return [];
    }
    return EQUIPMENT_MODELS[formData.typeOfEquipment] || [];
  };

  // Handle equipment type change - clear model when type changes
  const handleEquipmentTypeChange = (event) => {
    const newType = event.target.value;
    
    // Call the original handleChange
    handleChange(event);
    
    // Clear model when type changes (except when selecting "Others")
    if (newType !== formData.typeOfEquipment) {
      const modelEvent = {
        target: {
          name: 'modelOfEquipment',
          value: ''
        }
      };
      handleChange(modelEvent);
      
      // Also clear custom model if it exists
      if (formData.customModel) {
        const customModelEvent = {
          target: {
            name: 'customModel',
            value: ''
          }
        };
        handleChange(customModelEvent);
      }
    }
  };

  const availableModels = getAvailableModels();

  return (
    <>
      {/* Equipment Information */}
      <TextField
        required
        label="Date of Request"
        name="dateOfRequest"
        type="date"
        value={formData.dateOfRequest}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        disabled={isSubmitting}
      />

      <FormControl required disabled={isSubmitting}>
        <InputLabel>Type of Equipment</InputLabel>
        <Select
          name="typeOfEquipment"
          value={formData.typeOfEquipment}
          onChange={handleEquipmentTypeChange}
          label="Type of Equipment"
        >
          <MenuItem value="">
            <em>Select Equipment Type</em>
          </MenuItem>
          <MenuItem value={EQUIPMENT_TYPES.DESKTOP}>Desktop</MenuItem>
          <MenuItem value={EQUIPMENT_TYPES.LAPTOP}>Laptop</MenuItem>
          <MenuItem value={EQUIPMENT_TYPES.PRINTER}>Printer</MenuItem>
          <MenuItem value={EQUIPMENT_TYPES.SCANNER}>Scanner</MenuItem>
          <MenuItem value={EQUIPMENT_TYPES.OTHERS}>Others</MenuItem>
        </Select>
      </FormControl>

      {formData.typeOfEquipment === EQUIPMENT_TYPES.OTHERS && (
        <TextField
          required
          name="customEquipmentType"
          label="Specify Equipment Type"
          value={formData.customEquipmentType || ''}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      )}

      {/* Model Selection - Only show when equipment type is selected */}
      {formData.typeOfEquipment && (
        <FormControl 
          required 
          disabled={isSubmitting}
        >
          {formData.typeOfEquipment === EQUIPMENT_TYPES.OTHERS ? (
            <TextField
              required
              name="modelOfEquipment"
              label="Specify Equipment Model"
              value={formData.modelOfEquipment || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter the model of your equipment"
            />
          ) : (
            <>
              <InputLabel>Model of Equipment</InputLabel>
              <Select
                name="modelOfEquipment"
                value={formData.modelOfEquipment}
                onChange={handleChange}
                label="Model of Equipment"
              >
                <MenuItem value="">
                  <em>Select Model</em>
                </MenuItem>
                {availableModels.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </FormControl>
      )}

      {/* Custom Model Input - Only show when "Other" model is selected */}
      {formData.modelOfEquipment === 'Other' && formData.typeOfEquipment !== EQUIPMENT_TYPES.OTHERS && (
        <TextField
          required
          name="customModel"
          label="Specify Other Model"
          value={formData.customModel || ''}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter the specific model"
        />
      )}

      <TextField
        required
        label="Serial No."
        name="serialNo"
        value={formData.serialNo}
        onChange={handleChange}
        disabled={isSubmitting}
        placeholder="Enter equipment serial number"
      />

      <FormControl required disabled={isSubmitting}>
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          label="Priority"
        >
          <MenuItem value="">
            <em>Select Priority</em>
          </MenuItem>
          <MenuItem value={PRIORITY_LEVELS.HIGH}>High</MenuItem>
          <MenuItem value={PRIORITY_LEVELS.MEDIUM}>Medium</MenuItem>
          <MenuItem value={PRIORITY_LEVELS.LOW}>Low</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default EquipmentSection; 