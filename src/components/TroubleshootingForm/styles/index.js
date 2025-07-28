// Common style constants
export const commonStyles = {
  sectionTitle: {
    color: '#000000',
    fontWeight: 600,
    mb: 3,
    fontFamily: 'Poppins',
    fontSize: '1.2rem',
    borderBottom: '2px solid #e0e0e0',
    pb: 1
  },
  dialogCard: {
    p: 3, 
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#ffffff'
  },
  dialogCardTitle: {
    color: '#000000',
    fontWeight: 600,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontSize: '1.1rem',
    fontFamily: 'Poppins'
  },
  poppinsText: {
    fontFamily: 'Poppins'
  }
};

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
    mx: { xs: 1, sm: 0 },
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
  }
};

// Button styles
export const buttonStyles = {
  submit: {
    mt: { xs: 1, sm: 2 },
    py: { xs: 1.5, sm: 1.8 },
    fontSize: { xs: '0.9rem', sm: '1rem' },
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 2,
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
  fileUpload: {
    py: 1.8,
    textTransform: 'none',
    borderRadius: 2,
    borderColor: '#000000',
    color: '#000000',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    backgroundColor: '#f8fafc',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      borderColor: '#333333',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }
  }
};

// CAPTCHA styles
export const captchaStyles = {
  container: {
    mt: { xs: 2, sm: 4 }, 
    mb: { xs: 2, sm: 4 }, 
    textAlign: 'center',
    width: '100%',
    gridColumn: '1 / -1',
    backgroundColor: '#f8f8f8',
    borderRadius: 2,
    p: { xs: 2, sm: 4 },
    border: '1px solid rgba(0, 0, 0, 0.1)'
  },
  codeDisplay: {
    fontFamily: 'monospace',
    letterSpacing: { xs: '0.3em', sm: '0.5em' },
    padding: { xs: '15px', sm: '20px' },
    borderRadius: '8px',
    userSelect: 'none',
    backgroundColor: '#f8f8f8',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    mb: 2,
    fontWeight: 600,
    fontSize: { xs: '1.2rem', sm: '1.5rem' }
  },
  input: {
    '& .MuiInputBase-input': { 
      textAlign: 'center',
      fontSize: '1.2rem',
      letterSpacing: '0.3em',
      fontFamily: 'monospace',
      fontWeight: 600,
      padding: '16px 14px'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '2px'
      },
      '&:hover fieldset': {
        borderWidth: '2px'
      },
      '&.Mui-focused fieldset': {
        borderWidth: '2.5px'
      }
    }
  }
}; 