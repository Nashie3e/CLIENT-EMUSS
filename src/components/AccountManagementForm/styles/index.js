// Container styles
export const containerStyles = {
  main: {
    mt: { xs: 1, sm: 4 }, 
    mb: { xs: 1, sm: 4 }, 
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    px: { xs: 1, sm: 3 },
    '&::before': {
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      opacity: 0.5,
      zIndex: -1
    }
  },
  header: {
    textAlign: 'center', 
    mb: { xs: 2, sm: 4 },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: { xs: '1rem', sm: '2rem' },
    borderRadius: { xs: '8px', sm: '16px' },
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    mx: { xs: 1, sm: 0 }
  }
};

// Form styles
export const formStyles = {
  paper: {
    p: { xs: 1.5, sm: 3, md: 4 },
    borderRadius: { xs: '8px', sm: '12px' },
    backgroundColor: '#ffffff',
    position: 'relative',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    mx: { xs: 1, sm: 0 }
  },
  grid: {
    display: 'grid', 
    gap: { xs: 2, sm: 3 },
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
    '& .full-width': {
      gridColumn: { xs: '1', sm: '1 / -1' }
    },
    '& .MuiFormControl-root': {
      minHeight: { xs: '70px', sm: '80px' }
    }
  },
  fieldStyles: {
    '& .MuiTextField-root, & .MuiFormControl-root': {
      backgroundColor: '#ffffff',
      borderRadius: 1,
      '& .MuiOutlinedInput-root': {
        transition: 'all 0.2s ease-in-out',
        '& fieldset': {
          borderWidth: '1px',
          borderColor: 'rgba(0, 0, 0, 0.2)',
        },
        '&:hover fieldset': {
          borderColor: '#000000',
          borderWidth: '1px',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#000000',
          borderWidth: '2px',
        }
      },
      '& .MuiInputLabel-root': {
        color: '#666666',
        fontWeight: 500,
        fontSize: { xs: '0.85rem', sm: '1rem' },
        '&.Mui-focused': {
          color: '#000000',
          fontWeight: 600
        }
      },
      '& .MuiInputBase-input': {
        fontSize: { xs: '0.85rem', sm: '0.95rem' },
        padding: { xs: '12px 10px', sm: '16px 14px' },
        fontWeight: 500
      },
      '& .MuiSelect-select': {
        padding: { xs: '12px 10px', sm: '16px 14px' },
        fontWeight: 500
      }
    }
  }
};

// Button styles
export const buttonStyles = {
  primary: {
    mt: { xs: 1, sm: 2 },
    py: { xs: 1.5, sm: 1.8 },
    fontSize: { xs: '0.9rem', sm: '1rem' },
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: { xs: '8px', sm: '12px' },
    backgroundColor: '#000000',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#333333',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
      transform: 'translateY(-1px)'
    },
    '&:active': {
      transform: 'translateY(1px)'
    }
  },
  formLink: {
    textTransform: 'none',
    borderColor: '#1976d2',
    color: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    padding: { xs: '8px 16px', sm: '10px 20px' },
    fontSize: { xs: '0.85rem', sm: '0.9rem' },
    fontWeight: 500,
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      borderColor: '#1565c0',
    },
    width: { xs: '100%', sm: 'fit-content' }
  }
};

// Dialog styles
export const dialogStyles = {
  paper: {
    borderRadius: { xs: '12px', sm: '16px' },
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    margin: { xs: 2, sm: 4 },
    maxHeight: { xs: '90vh', sm: '85vh' }
  },
  title: {
    backgroundColor: '#f8f8f8',
    borderBottom: '2px solid #e0e0e0',
    pb: { xs: 2, sm: 3 },
    pt: { xs: 2, sm: 3 },
    px: { xs: 2, sm: 4 },
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 1, sm: 2 }
  },
  content: {
    p: { xs: 2, sm: 4 },
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: '4px'
    }
  },
  actions: {
    p: { xs: 2, sm: 3 },
    backgroundColor: '#f8f8f8',
    borderTop: '1px solid #e0e0e0',
    gap: { xs: 1, sm: 2 },
    flexDirection: { xs: 'column', sm: 'row' },
    '& .MuiButton-root': {
      width: { xs: '100%', sm: 'auto' }
    }
  }
};

// Common styles
export const commonStyles = {
  poppinsText: {
    fontFamily: 'Poppins'
  },
  sectionTitle: {
    color: '#000000',
    fontWeight: 600,
    mb: 3,
    fontFamily: 'Poppins',
    fontSize: '1.2rem',
    borderBottom: '2px solid #e0e0e0',
    pb: 1
  },
  cardTitle: {
    color: '#000000',
    fontWeight: 600,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontSize: '1.1rem',
    fontFamily: 'Poppins'
  },
  captchaContainer: {
    mt: { xs: 2, sm: 4 }, 
    mb: { xs: 2, sm: 4 }, 
    textAlign: 'center',
    width: '100%',
    gridColumn: '1 / -1',
    backgroundColor: '#f8f8f8',
    borderRadius: { xs: '8px', sm: '12px' },
    p: { xs: 2, sm: 4 },
    border: '1px solid rgba(0, 0, 0, 0.1)'
  }
}; 